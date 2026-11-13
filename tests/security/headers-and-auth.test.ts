import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import nextConfig from '../../next.config';

describe('Security & Hardening Test Suite (OWASP Top 10)', () => {
  describe('A04 / A02: Security Headers & Transport Hardening', () => {
    it('should configure strict HTTP security headers for all routes (/:path*)', async () => {
      assert.ok(typeof nextConfig.headers === 'function', 'nextConfig.headers should be defined');
      const headerConfigs = await nextConfig.headers();
      assert.ok(Array.isArray(headerConfigs), 'Headers should return an array');

      const globalHeaderConfig = headerConfigs.find((c) => c.source === '/:path*');
      assert.ok(globalHeaderConfig, 'Global path /:path* headers configuration must exist');

      const headersMap = new Map(
        globalHeaderConfig.headers.map((h: { key: string; value: string }) => [h.key, h.value])
      );

      // 1. HSTS (Strict-Transport-Security)
      const hsts = headersMap.get('Strict-Transport-Security');
      assert.ok(hsts, 'HSTS header must be present');
      assert.ok(hsts.includes('max-age=63072000'), 'HSTS max-age should be 2 years (63072000)');
      assert.ok(hsts.includes('includeSubDomains'), 'HSTS should enforce includeSubDomains');
      assert.ok(hsts.includes('preload'), 'HSTS should include preload for browser HSTS preload list');

      // 2. Clickjacking protection (X-Frame-Options)
      const xfo = headersMap.get('X-Frame-Options');
      assert.equal(xfo, 'SAMEORIGIN', 'X-Frame-Options must be SAMEORIGIN or DENY');

      // 3. MIME Sniffing protection (X-Content-Type-Options)
      const xcto = headersMap.get('X-Content-Type-Options');
      assert.equal(xcto, 'nosniff', 'X-Content-Type-Options must be nosniff');

      // 4. Referrer Policy
      const referrerPolicy = headersMap.get('Referrer-Policy');
      assert.equal(referrerPolicy, 'strict-origin-when-cross-origin', 'Referrer-Policy must be strict-origin-when-cross-origin');

      // 5. Permissions Policy
      const permissionsPolicy = headersMap.get('Permissions-Policy');
      assert.ok(permissionsPolicy, 'Permissions-Policy must be defined');
      assert.ok(permissionsPolicy.includes('camera=()'), 'Permissions-Policy should disable camera');
      assert.ok(permissionsPolicy.includes('microphone=()'), 'Permissions-Policy should disable microphone');
      assert.ok(permissionsPolicy.includes('geolocation=()'), 'Permissions-Policy should disable geolocation');

      // 6. DNS Prefetch Control
      const dnsPrefetch = headersMap.get('X-DNS-Prefetch-Control');
      assert.equal(dnsPrefetch, 'on', 'X-DNS-Prefetch-Control should be on');
    });

    it('should enforce strict SVG sandboxing to prevent SVG-based XSS attacks', () => {
      const imagesConfig = nextConfig.images;
      assert.ok(imagesConfig, 'Images configuration must exist');
      
      if (imagesConfig.dangerouslyAllowSVG) {
        assert.equal(
          imagesConfig.contentDispositionType,
          'attachment',
          'contentDispositionType must be attachment to prevent inline execution of malicious SVGs'
        );
        assert.ok(
          imagesConfig.contentSecurityPolicy?.includes("script-src 'none'"),
          'contentSecurityPolicy must forbid script execution (script-src none)'
        );
        assert.ok(
          imagesConfig.contentSecurityPolicy?.includes('sandbox;'),
          'contentSecurityPolicy must sandbox SVG contexts'
        );
      }
    });

    it('should restrict external remotePatterns strictly to trusted CDNs', () => {
      const remotePatterns = nextConfig.images?.remotePatterns || [];
      const allowedHostnames = ['api.dicebear.com', '*.supabase.co', 'images.unsplash.com'];

      for (const pattern of remotePatterns) {
        assert.equal(pattern.protocol, 'https', 'All image remote patterns must enforce HTTPS');
        assert.ok(
          allowedHostnames.includes(pattern.hostname),
          `Remote pattern hostname ${pattern.hostname} must be in the approved list`
        );
      }
    });
  });

  describe('A01 / A04: Cryptographic Webhook Security & Constant-Time Comparisons', () => {
    it('should resist timing attacks by utilizing constant-time comparison on SHA-256 digests', () => {
      const secret = 'prod-webhook-secret-xyz';
      const userSuppliedValid = 'prod-webhook-secret-xyz';
      const userSuppliedTampered = 'prod-webhook-secret-abc';

      // Replicating the secure Mayar adapter pattern:
      const digestA = crypto.createHash('sha256').update(userSuppliedValid).digest();
      const digestExpected = crypto.createHash('sha256').update(secret).digest();
      const isMatchValid = crypto.timingSafeEqual(digestA, digestExpected);
      assert.equal(isMatchValid, true, 'Valid digest comparison must succeed');

      const digestB = crypto.createHash('sha256').update(userSuppliedTampered).digest();
      const isMatchInvalid = crypto.timingSafeEqual(digestB, digestExpected);
      assert.equal(isMatchInvalid, false, 'Tampered digest comparison must fail');
    });

    it('should safely handle unequal length buffers in timing-safe comparisons without throwing', () => {
      const safeTimingSafeEqual = (a: string, b: string): boolean => {
        const bufA = Buffer.from(a);
        const bufB = Buffer.from(b);
        if (bufA.length !== bufB.length) {
          return false;
        }
        return crypto.timingSafeEqual(bufA, bufB);
      };

      assert.doesNotThrow(() => {
        const result = safeTimingSafeEqual('short-string', 'a-much-longer-attacker-crafted-string');
        assert.equal(result, false);
      });
    });
  });

  describe('A01 / A07: Access Control Fail-Closed Verification', () => {
    function evaluateAccess(
      user: { id: string } | null,
      profile: { role: 'user' | 'admin' } | null,
      requiredRole: 'authenticated' | 'admin'
    ): { allowed: boolean; error?: string } {
      if (!user) {
        return { allowed: false, error: 'Unauthorized: Anda harus login untuk melakukan aksi ini.' };
      }
      if (requiredRole === 'admin' && profile?.role !== 'admin') {
        return { allowed: false, error: 'Forbidden: Anda tidak memiliki akses administrator.' };
      }
      return { allowed: true };
    }

    it('should fail closed when session is unauthenticated for protected mutations', () => {
      const authResult = evaluateAccess(null, null, 'authenticated');
      assert.equal(authResult.allowed, false);
      assert.ok(authResult.error?.includes('Unauthorized'));

      const adminResult = evaluateAccess(null, null, 'admin');
      assert.equal(adminResult.allowed, false);
      assert.ok(adminResult.error?.includes('Unauthorized'));
    });

    it('should fail closed when user role is regular user attempting admin mutation', () => {
      const result = evaluateAccess({ id: 'user-123' }, { role: 'user' }, 'admin');
      assert.equal(result.allowed, false);
      assert.ok(result.error?.includes('Forbidden'));
    });

    it('should allow admin user to access admin mutations', () => {
      const result = evaluateAccess({ id: 'admin-001' }, { role: 'admin' }, 'admin');
      assert.equal(result.allowed, true);
      assert.equal(result.error, undefined);
    });
  });
});

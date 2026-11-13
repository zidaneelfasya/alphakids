import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import nextConfig from '../../next.config';

describe('Performance Budget & LCP Asset Verification', () => {
  const rootDir = process.cwd();

  describe('Hero LCP Asset Budgets', () => {
    const hero1Path = path.join(rootDir, 'public/assets/img/hero_1.webp');
    const hero2Path = path.join(rootDir, 'public/assets/img/hero_2.webp');

    it('should verify hero_1.webp exists and satisfies the < 100KB performance budget', () => {
      assert.ok(fs.existsSync(hero1Path), 'hero_1.webp must exist in public/assets/img/');
      const stats = fs.statSync(hero1Path);
      const sizeKb = stats.size / 1024;
      assert.ok(
        sizeKb < 100,
        `hero_1.webp is ${sizeKb.toFixed(2)}KB, which exceeds the 100KB budget for fast mobile LCP`
      );
    });

    it('should verify hero_2.webp exists and satisfies the < 100KB performance budget', () => {
      assert.ok(fs.existsSync(hero2Path), 'hero_2.webp must exist in public/assets/img/');
      const stats = fs.statSync(hero2Path);
      const sizeKb = stats.size / 1024;
      assert.ok(
        sizeKb < 100,
        `hero_2.webp is ${sizeKb.toFixed(2)}KB, which exceeds the 100KB budget for fast mobile LCP`
      );
    });
  });

  describe('Next.js Image Optimization Engine Configuration', () => {
    it('should configure modern image formats (AVIF and WebP) for Edge transcoding', () => {
      const formats = nextConfig.images?.formats;
      assert.ok(Array.isArray(formats), 'images.formats should be configured as an array');
      assert.ok(formats.includes('image/avif'), 'images.formats must include image/avif for highest compression');
      assert.ok(formats.includes('image/webp'), 'images.formats must include image/webp for wide modern support');
    });
  });

  describe('Agentic Discovery & SEO Indexing Assets', () => {
    it('should supply machine-readable /llms.txt for AI agents and agentic browsing', () => {
      const llmsPath = path.join(rootDir, 'public/llms.txt');
      assert.ok(fs.existsSync(llmsPath), 'llms.txt must exist in public root');
      const content = fs.readFileSync(llmsPath, 'utf-8');
      assert.ok(content.includes('# Alpha Kids'), 'llms.txt must have title # Alpha Kids');
      assert.ok(content.includes('## Informasi Utama'), 'llms.txt must describe main platform info');
      assert.ok(content.includes('## Katalog Program Unggulan'), 'llms.txt must describe featured programs');
    });

    it('should supply comprehensive /llms-full.txt documentation', () => {
      const fullPath = path.join(rootDir, 'public/llms-full.txt');
      assert.ok(fs.existsSync(fullPath), 'llms-full.txt must exist in public root');
      const content = fs.readFileSync(fullPath, 'utf-8');
      assert.ok(content.length > 500, 'llms-full.txt must provide in-depth platform details');
    });
  });
});

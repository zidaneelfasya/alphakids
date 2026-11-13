import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Instant Route Navigation & Persistent Shell Architecture', () => {
  const rootDir = process.cwd();

  it('should have persistent layout and instant loading skeletons for Admin panel', () => {
    const adminLayoutPath = path.join(rootDir, 'app/admin/layout.tsx');
    const adminLoadingPath = path.join(rootDir, 'app/admin/loading.tsx');

    assert.ok(fs.existsSync(adminLayoutPath), 'app/admin/layout.tsx must exist');
    assert.ok(fs.existsSync(adminLoadingPath), 'app/admin/loading.tsx must exist');

    const layoutContent = fs.readFileSync(adminLayoutPath, 'utf-8');
    assert.ok(
      layoutContent.includes('requireAdmin'),
      'Admin layout must enforce requireAdmin authentication guard'
    );
    assert.ok(
      layoutContent.includes('SidebarProvider') && layoutContent.includes('AdminSidebar'),
      'Admin layout must mount persistent SidebarProvider and AdminSidebar'
    );
  });

  it('should have persistent layout and instant loading skeletons for Dashboard panel', () => {
    const dashboardLayoutPath = path.join(rootDir, 'app/dashboard/layout.tsx');
    const dashboardLoadingPath = path.join(rootDir, 'app/dashboard/loading.tsx');

    assert.ok(fs.existsSync(dashboardLayoutPath), 'app/dashboard/layout.tsx must exist');
    assert.ok(fs.existsSync(dashboardLoadingPath), 'app/dashboard/loading.tsx must exist');

    const layoutContent = fs.readFileSync(dashboardLayoutPath, 'utf-8');
    assert.ok(
      layoutContent.includes('requireAuth'),
      'Dashboard layout must enforce requireAuth authentication guard'
    );
    assert.ok(
      layoutContent.includes('SidebarProvider') && layoutContent.includes('AppSidebar'),
      'Dashboard layout must mount persistent SidebarProvider and AppSidebar'
    );
  });

  it('should ensure zero subpages re-mount AdminShell or DashboardShell', () => {
    const scanDir = (dir: string): string[] => {
      let results: string[] = [];
      const list = fs.readdirSync(dir, { withFileTypes: true });
      for (const item of list) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
          results = results.concat(scanDir(fullPath));
        } else if (item.name === 'page.tsx') {
          results.push(fullPath);
        }
      }
      return results;
    };

    const adminPages = scanDir(path.join(rootDir, 'app/admin'));
    const dashboardPages = scanDir(path.join(rootDir, 'app/dashboard'));

    for (const file of adminPages) {
      const content = fs.readFileSync(file, 'utf-8');
      assert.ok(
        !content.includes('AdminShell'),
        `File ${path.relative(rootDir, file)} must not re-render AdminShell (layout already handles persistent shell)`
      );
    }

    for (const file of dashboardPages) {
      const content = fs.readFileSync(file, 'utf-8');
      assert.ok(
        !content.includes('DashboardShell'),
        `File ${path.relative(rootDir, file)} must not re-render DashboardShell (layout already handles persistent shell)`
      );
    }
  });

  it('should ensure loading skeletons use neutral gray and white styling without flashy colors', () => {
    const adminLoading = fs.readFileSync(path.join(rootDir, 'app/admin/loading.tsx'), 'utf-8');
    const dashboardLoading = fs.readFileSync(path.join(rootDir, 'app/dashboard/loading.tsx'), 'utf-8');

    // Verify neutral slate / gray classes and animate-pulse
    assert.ok(adminLoading.includes('animate-pulse'), 'Admin skeleton must have animate-pulse');
    assert.ok(adminLoading.includes('slate-'), 'Admin skeleton must use neutral slate colors');
    assert.ok(dashboardLoading.includes('animate-pulse'), 'Dashboard skeleton must have animate-pulse');
    assert.ok(dashboardLoading.includes('slate-'), 'Dashboard skeleton must use neutral slate colors');

    // Confirm no gaudy color backgrounds in skeletons
    assert.ok(!adminLoading.includes('bg-cyan-'), 'Admin skeleton must not use flashy cyan backgrounds');
    assert.ok(!dashboardLoading.includes('bg-cyan-'), 'Dashboard skeleton must not use flashy cyan backgrounds');
  });
});

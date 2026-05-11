import { test as base, expect } from '@playwright/test';
import { LoginPage, InventoryPage } from '../../src/pages';
import { USERS, PASSWORD, TIMEOUTS } from '@fixtures/testData';

// Override storageState — this test logs in as a different user
base.use({ storageState: { cookies: [], origins: [] } });

base.describe('Performance Glitch User', () => {
  base(
    'inventory page loads within acceptable timeout for performance_glitch_user',
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      await loginPage.goto();

      // SauceDemo artificially introduces a ~5 s delay for this user.
      // Our threshold is 10 s — generous enough to avoid false failures on
      // slow CI machines, but tight enough to catch a genuine regression
      // (e.g., if the delay increased from 5 s to 15 s). We chose 10 s after
      // manual timing: the delay is consistently ~5–6 s, so 10 s gives a
      // 4 s buffer without being so permissive it defeats the purpose.
      const start = Date.now();

      await loginPage.loginAs(USERS.perfGlitch, PASSWORD);

      await inventoryPage.assertOnInventoryPage();

      const elapsed = Date.now() - start;

      // Log elapsed time so reviewers can see it in the HTML report
      console.log(
        `Inventory load time for performance_glitch_user: ${elapsed} ms`,
      );

      expect(
        elapsed,
        `Inventory load exceeded ${TIMEOUTS.perfGlitchInventoryLoad} ms threshold (actual: ${elapsed} ms)`,
      ).toBeLessThan(TIMEOUTS.perfGlitchInventoryLoad);
    },
  );
});

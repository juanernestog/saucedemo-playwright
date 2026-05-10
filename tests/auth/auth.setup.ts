import { test as setup, expect, defineConfig, devices } from '@playwright/test';
import { LoginPage } from '@pages/index';

const AUTH_FILE = '.auth/user.json';

// This file is matched by `testMatch: /.*\.setup\.ts/` in the config.
// It runs once, before any browser project starts.
setup('authenticate as standard_user', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.loginAs(
    process.env.STANDARD_USER ?? 'standard_user',
    process.env.PASSWORD ?? 'secret_sauce',
  );

  // Confirm we are on the inventory page before saving state
  await expect(page).toHaveURL(/inventory/);

  // Persist cookies + localStorage to disk
  await page.context().storageState({ path: AUTH_FILE });
});

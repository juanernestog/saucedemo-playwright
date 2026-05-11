import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '@pages/index';
import { USERS, PASSWORD, AUTH_FILE } from '@fixtures/testData';

// This file is matched by `testMatch: /.*\.setup\.ts/` in the config.
// It runs once, before any browser project starts.
setup('authenticate as standard_user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const userId = USERS.standard;
  console.log(`Authenticating as ${userId}`);

  await loginPage.goto();
  await loginPage.loginAs(USERS.standard, PASSWORD);

  // Confirm we are on the inventory page before saving state
  await expect(page).toHaveURL(/inventory/);

  // Persist cookies + localStorage to disk
  await page.context().storageState({ path: AUTH_FILE });
});

import { test, expect } from '../../src/fixtures';
import { LoginPage } from '../../src/pages';
import { USERS, PASSWORD, ERROR_MESSAGES } from '@fixtures/testData';

// Auth tests must NOT use storageState — they test the login flow itself.
// Playwright lets you override storageState per project or per test.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication', () => {
  test('standard_user logs in successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs(USERS.standard, PASSWORD);
    await expect(page).toHaveURL(/inventory/);
  });

  test('locked_out_user sees a descriptive error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs(USERS.lockedOut, PASSWORD);
    await loginPage.assertErrorVisible(ERROR_MESSAGES.lockedOut);
  });

  test('wrong password shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs(USERS.standard, 'wrong_password');
    await loginPage.assertErrorVisible(ERROR_MESSAGES.wrongCredentials);
  });

  test('empty username shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs('', PASSWORD);
    await loginPage.assertErrorVisible(ERROR_MESSAGES.usernameRequired);
  });

  test('logout returns user to login page', async ({ page, inventoryPage }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs(USERS.standard, PASSWORD);
    await page.goto('/inventory.html');
    await inventoryPage.logout();
    await expect(page).toHaveURL('/');
  });
});

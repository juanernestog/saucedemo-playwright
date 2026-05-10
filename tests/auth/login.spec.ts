import { test, expect } from '../../src/fixtures';
import { LoginPage } from '../../src/pages';

// Auth tests must NOT use storageState — they test the login flow itself.
// Playwright lets you override storageState per project or per test.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication', () => {
  test('standard_user logs in successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);
  });

  test('locked_out_user sees a descriptive error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs('locked_out_user', 'secret_sauce');
    await loginPage.assertErrorVisible('Sorry, this user has been locked out');
  });

  test('wrong password shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs('standard_user', 'wrong_password');
    await loginPage.assertErrorVisible('Username and password do not match');
  });

  test('empty username shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs('', 'secret_sauce');
    await loginPage.assertErrorVisible('Username is required');
  });

  test('logout returns user to login page', async ({ page, inventoryPage }) => {
    // This test DOES use storageState (standard login already done)
    await page.goto('/inventory.html');
    await inventoryPage.logout();
    await expect(page).toHaveURL('/');
  });
});

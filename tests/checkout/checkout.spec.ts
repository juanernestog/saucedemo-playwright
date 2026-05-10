import { test, expect } from '../../src/fixtures';
import type { CustomerInfo } from '../../src/pages/CheckoutPage';

const CUSTOMER: CustomerInfo = {
  firstName: 'John',
  lastName: 'Doe',
  zipCode: '10001',
};

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page, inventoryPage }) => {
    await page.goto('/inventory.html');
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
  });

  test('complete checkout end-to-end', async ({ cartPage, checkoutPage }) => {
    await cartPage.goto();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCustomerInfo(CUSTOMER);
    // Assert summary page shows a total before finishing
    const total = await checkoutPage.getOrderTotal();
    expect(total).toMatch(/\$\d+\.\d{2}/);
    await checkoutPage.finish();
    await checkoutPage.assertOrderConfirmed();
  });

  test('checkout requires first name', async ({ cartPage, page }) => {
    await cartPage.goto();
    await cartPage.proceedToCheckout();
    // Submit with empty first name
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText(
      'First Name is required',
    );
  });

  test('checkout requires last name', async ({ cartPage, page }) => {
    await cartPage.goto();
    await cartPage.proceedToCheckout();
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Last Name is required',
    );
  });
});

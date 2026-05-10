import { test, expect } from '../../src/fixtures';

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory.html');
  });

  test('added product appears in cart', async ({
    page,
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await cartPage.goto();
    const names = await cartPage.getItemNames();
    expect(names).toContain('Sauce Labs Backpack');
  });

  test('removing an item from cart empties it', async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await cartPage.goto();
    await cartPage.removeItemByName('Sauce Labs Backpack');
    await cartPage.assertEmpty();
  });

  test('multiple items can be added', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await inventoryPage.addToCartByName('Sauce Labs Bike Light');
    await cartPage.goto();
    expect(await cartPage.getItemCount()).toBe(2);
  });
});

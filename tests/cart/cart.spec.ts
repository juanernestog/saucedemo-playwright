import { test, expect } from '../../src/fixtures';
import { PRODUCTS } from '@fixtures/testData';

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory.html');
  });

  test('added product appears in cart', async ({
    page,
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addToCartByName(PRODUCTS.backpack);
    await cartPage.goto();
    const names = await cartPage.getItemNames();
    expect(names).toContain(PRODUCTS.backpack);
  });

  test('removing an item from cart empties it', async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addToCartByName(PRODUCTS.backpack);
    await cartPage.goto();
    await cartPage.removeItemByName(PRODUCTS.backpack);
    await cartPage.assertEmpty();
  });

  test('multiple items can be added', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCartByName(PRODUCTS.backpack);
    await inventoryPage.addToCartByName(PRODUCTS.bikeLight);
    await cartPage.goto();
    expect(await cartPage.getItemCount()).toBe(2);
  });
});

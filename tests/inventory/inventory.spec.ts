import { test, expect } from '../../src/fixtures';

test.describe('Product Catalogue', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory.html');
  });

  test('inventory page displays products', async ({ inventoryPage }) => {
    await inventoryPage.assertOnInventoryPage();
  });

  test('sort products A→Z', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('az');
    const names = await inventoryPage.getProductNames();
    expect(names).toEqual([...names].sort());
  });

  test('sort products Z→A', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getProductNames();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('sort products price low→high', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getProductPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sort products price high→low', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getProductPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('adding a product updates cart badge', async ({
    page,
    inventoryPage,
  }) => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    const count = await inventoryPage.getCartBadgeCount();
    expect(count).toBe(1);
  });
});

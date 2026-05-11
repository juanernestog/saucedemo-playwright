import { Page, Locator, expect } from '@playwright/test';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
  private readonly sortDropdown: Locator;
  private readonly inventoryItems: Locator;
  private readonly burgerMenu: Locator;
  private readonly logoutLink: Locator;
  private readonly cartBadge: Locator;

  constructor(private readonly page: Page) {
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.burgerMenu = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  async assertOnInventoryPage(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory/);
    await expect(this.inventoryItems.first()).toBeVisible();
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async getProductNames(): Promise<string[]> {
    return this.page
      .locator('[data-test="inventory-item-name"]')
      .allInnerTexts();
  }

  async getProductPrices(): Promise<number[]> {
    const rawPrices = await this.page
      .locator('[data-test="inventory-item-price"]')
      .allInnerTexts();
    return rawPrices.map((p) => parseFloat(p.replace('$', '')));
  }

  async addToCartByName(productName: string): Promise<void> {
    const item = this.page.locator('[data-test="inventory-item"]', {
      has: this.page.locator(`text="${productName}"`),
    });
    await item.locator('button').click({ delay: 20 });
  }

  async getCartBadgeCount(): Promise<number> {
    const text = await this.cartBadge.innerText();
    return parseInt(text, 10);
  }

  async logout(): Promise<void> {
    await this.burgerMenu.click();
    await this.logoutLink.click();
  }
}

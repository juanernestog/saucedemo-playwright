import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  private readonly cartItems: Locator;
  private readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.cartItems = page.locator('[data-test="cart-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/cart.html');
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getItemNames(): Promise<string[]> {
    return this.page
      .locator('[data-test="inventory-item-name"]')
      .allInnerTexts();
  }

  async removeItemByName(productName: string): Promise<void> {
    const item = this.page.locator('[data-test="cart-item"]', {
      has: this.page.locator(`text="${productName}"`),
    });
    await item.locator('button[id^="remove"]').click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async assertEmpty(): Promise<void> {
    await expect(this.cartItems).toHaveCount(0);
  }
}

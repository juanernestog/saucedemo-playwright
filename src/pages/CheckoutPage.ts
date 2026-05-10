import { Page, Locator, expect } from '@playwright/test';

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  zipCode: string;
}

export class CheckoutPage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly zipInput: Locator;
  private readonly continueButton: Locator;
  private readonly finishButton: Locator;
  private readonly confirmationHeader: Locator;
  private readonly totalLabel: Locator;

  constructor(private readonly page: Page) {
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.zipInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.confirmationHeader = page.locator('[data-test="complete-header"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
  }

  async fillCustomerInfo(info: CustomerInfo): Promise<void> {
    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    await this.zipInput.fill(info.zipCode);
    await this.continueButton.click();
  }

  async getOrderTotal(): Promise<string> {
    return this.totalLabel.innerText();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async assertOrderConfirmed(): Promise<void> {
    await expect(this.confirmationHeader).toBeVisible();
    await expect(this.confirmationHeader).toContainText('Thank you');
  }
}

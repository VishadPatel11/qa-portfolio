import { expect, Locator, Page } from '@playwright/test';

export class BasketPage {
  readonly rows: Locator;
  readonly checkoutButton: Locator;
  readonly totalPrice: Locator;

  constructor(private readonly page: Page) {
    this.rows = page.locator('mat-row');
    this.checkoutButton = page.locator('#checkoutButton');
    this.totalPrice = page.getByText(/^Total Price:/);
  }

  async goto() {
    await this.page.goto('/#/basket');
  }

  row(productName: string): Locator {
    return this.rows.filter({
      has: this.page.getByRole('cell', { name: productName, exact: true }),
    });
  }

  quantity(productName: string): Locator {
    return this.row(productName).locator('.mat-column-quantity > span.cell-initial-font');
  }

  price(productName: string): Locator {
    return this.row(productName).locator('.mat-column-price');
  }

  async deleteFromBasket(productName: string) {
    await this.row(productName).locator('.mat-column-remove button').click();
  }

  async deleteFromBasketAndWait(productName: string) {
    const responsePromise = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'DELETE' &&
        response.url().includes('/api/BasketItems')
    );

    await this.deleteFromBasket(productName);
    const response = await responsePromise;
    expect(response.ok(), `deleting ${productName} from the basket`).toBeTruthy();
  }
}

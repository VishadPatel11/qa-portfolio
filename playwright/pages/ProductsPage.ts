import { Locator, Page } from '@playwright/test';

export class ProductsPage {
  readonly searchIcon: Locator;
  readonly searchInput: Locator;
  readonly productCards: Locator;
  readonly snackbar: Locator;

  constructor(private readonly page: Page) {
    this.searchIcon = page.locator('#searchQuery');
    this.searchInput = page.locator('#searchQuery input');
    this.productCards = page.locator('mat-card');
    this.snackbar = page.locator('simple-snack-bar');
  }

  async goto() {
    await this.page.goto('/#/search');
  }

  async search(term: string) {
    await this.searchIcon.click();
    await this.searchInput.fill(term);
    await this.searchInput.press('Enter');
  }

  /** Find a product card by its visible name, then click its "Add to Basket" button. */
  async addToBasket(productName: string) {
    const card = this.productCards.filter({
    has: this.page.getByText(productName, { exact: true }),
  });
    await card.getByRole('button', { name: 'Add to Basket' }).click();
  }
}

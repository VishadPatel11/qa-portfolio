import { test, expect } from '../fixtures/test';

const PRODUCT = 'Apple Juice (1000ml)';

test.describe('Basket', () => {
  test.beforeEach(async ({ loginPage, user }) => {
    await loginPage.goto();
    await loginPage.login(user.email, user.password);
    await loginPage.expectLoggedIn();
  });

  test('a product added from search appears in the basket @smoke', async ({ productsPage, basketPage }) => {
    await productsPage.search('apple juice');
    await productsPage.addToBasket(PRODUCT);
await expect(
  productsPage.snackbar.filter({ hasText: `Placed ${PRODUCT} into basket` })
).toBeVisible();
    await basketPage.goto();
    await expect(basketPage.row(PRODUCT)).toBeVisible();
    await expect(basketPage.checkoutButton).toBeEnabled();
  });

  // TODO (week 2 exercises):
  // 1. Add the same product twice and assert the quantity shows 2, not two rows.
  // 2. Remove the product and assert the basket is empty and checkout is disabled.
  // 3. Assert the basket total equals the sum of the row prices (read them, add them up).
});

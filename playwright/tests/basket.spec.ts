import { test, expect } from '../fixtures/test';

const PRODUCT = 'Apple Juice (1000ml)';
const OTHER_PRODUCT = 'Pineapple Juice (1000ml)';

function priceInCents(text: string): number {
  const amount = Number(text.replace(/[^\d.]/g, ''));
  expect(Number.isFinite(amount), `Could not parse price "${text}"`).toBeTruthy();
  return Math.round(amount * 100);
}

test.describe('Basket', () => {
  test.beforeEach(async ({ loginPage, user }) => {
    await loginPage.goto();
    await loginPage.login(user.email, user.password);
    await loginPage.expectLoggedIn();
  });

  test('a product added from search appears in the basket @smoke', async ({ productsPage, basketPage }) => {
    await productsPage.search('apple juice');
    await productsPage.addToBasketAndWait(PRODUCT);
    await expect(
      productsPage.snackbar.filter({ hasText: `Placed ${PRODUCT} into basket` })
    ).toBeVisible();
    await basketPage.goto();
    await expect(basketPage.row(PRODUCT)).toBeVisible();
    await expect(basketPage.checkoutButton).toBeEnabled();
  });

  test('adding the same product twice creates one row with quantity 2', async ({
    productsPage,
    basketPage,
  }) => {
    await productsPage.search('apple juice');
    await productsPage.addToBasketAndWait(PRODUCT);
    await productsPage.addToBasketAndWait(PRODUCT);

    await basketPage.goto();
    await expect(basketPage.row(PRODUCT)).toHaveCount(1);
    await expect(basketPage.quantity(PRODUCT)).toHaveText('2');
  });

  test('basket total equals the sum of row prices times quantities', async ({
    request,
    productsPage,
    basketPage,
  }) => {
    const catalogResponse = await request.get('/api/Products');
    expect(catalogResponse.ok(), 'loading product prices from API').toBeTruthy();
    const catalog: { data: Array<{ name: string; price: number }> } = await catalogResponse.json();

    await productsPage.search('apple juice');
    await productsPage.addToBasketAndWait(PRODUCT);
    await productsPage.addToBasketAndWait(PRODUCT);
    await productsPage.addToBasketAndWait(OTHER_PRODUCT);

    await basketPage.goto();
    await expect(basketPage.rows).toHaveCount(2);
    await expect(basketPage.quantity(PRODUCT)).toHaveText('2');
    await expect(basketPage.totalPrice).toBeVisible();

    const products = [PRODUCT, OTHER_PRODUCT];
    let expectedTotalCents = 0;
    let rowTotalCents = 0;
    for (const productName of products) {
      await expect(basketPage.price(productName)).toHaveText(/[\d.]+¤/);
      await expect(basketPage.quantity(productName)).toHaveText(/\d+/);

      const quantity = Number(await basketPage.quantity(productName).innerText());
      expect(Number.isInteger(quantity), `Invalid quantity for ${productName}`).toBeTruthy();

      const apiProduct = catalog.data.find((product) => product.name === productName);
      if (!apiProduct) {
        throw new Error(`Product API did not return ${productName}`);
      }
      expectedTotalCents += Math.round(apiProduct.price * 100) * quantity;

      const rowPriceCents = priceInCents(await basketPage.price(productName).innerText());
      rowTotalCents += rowPriceCents * quantity;
    }

    const displayedTotalCents = priceInCents(await basketPage.totalPrice.innerText());
    expect(displayedTotalCents).toBe(expectedTotalCents);
    expect(displayedTotalCents).toBe(rowTotalCents);
  });

  test('deleting a product removes only its matching basket row', async ({
    productsPage,
    basketPage,
  }) => {
    await productsPage.search('apple juice');
    await productsPage.addToBasketAndWait(PRODUCT);
    await productsPage.addToBasketAndWait(OTHER_PRODUCT);

    await basketPage.goto();
    await expect(basketPage.row(PRODUCT)).toHaveCount(1);
    await expect(basketPage.row(OTHER_PRODUCT)).toHaveCount(1);

    await basketPage.deleteFromBasketAndWait(PRODUCT);

    await expect(basketPage.row(PRODUCT)).toHaveCount(0);
    await expect(basketPage.row(OTHER_PRODUCT)).toHaveCount(1);
  });

  test('deleting the last product leaves the basket empty and checkout disabled', async ({
    productsPage,
    basketPage,
  }) => {
    await productsPage.search('apple juice');
    await productsPage.addToBasketAndWait(PRODUCT);

    await basketPage.goto();
    await expect(basketPage.row(PRODUCT)).toHaveCount(1);

    await basketPage.deleteFromBasketAndWait(PRODUCT);

    await expect(basketPage.rows).toHaveCount(0);
    await expect(basketPage.checkoutButton).toBeDisabled();
  });

});

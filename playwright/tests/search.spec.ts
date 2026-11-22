import { test, expect } from '../fixtures/test';

test.describe('Product search', () => {
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.goto();
  });

  test('finds products matching the term @smoke', async ({ productsPage }) => {
    await productsPage.search('apple');
    await expect(productsPage.productCards.first()).toBeVisible();
    // Every result should actually match — not just "at least one result came back".
    for (const name of await productsPage.productCards.allInnerTexts()) {
      expect(name.toLowerCase()).toContain('apple');
    }
  });

  test('shows no products for a nonsense term', async ({ productsPage }) => {
    await productsPage.search('zzzz-no-such-product');
    await expect(productsPage.noResultsMessage).toBeVisible();
  await expect(productsPage.productCards.filter({ hasNotText: 'No results found' })).toHaveCount(0);
  });

  // TODO (week 1 exercise): is search case-insensitive? Write a test that searches "APPLE"
  // and compares the result count with "apple".
});

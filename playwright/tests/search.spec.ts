import { test, expect } from '../fixtures/test';
import type { ProductsPage } from '../pages/ProductsPage';

async function searchAndCollect(productsPage: ProductsPage, term: string, mustMatch: RegExp) { 
  await productsPage.goto();
  await productsPage.search(term);
  await expect(productsPage.productCards.first()).toBeVisible();
  await expect(productsPage.productCards.filter({ hasNotText: /apple/i })).toHaveCount(0);
  return (await productsPage.productCards.allInnerTexts()).sort();
}

test.describe('Product search', () => {
  test('finds products matching the term @smoke', async ({ productsPage }) => {
    const products = await searchAndCollect(productsPage, 'apple', /apple/i);
  });

  test('shows no products for a nonsense term', async ({ productsPage }) => {
    await productsPage.goto();
    await productsPage.search('zzzz-no-such-product');
    await expect(productsPage.noResultsMessage).toBeVisible();
    await expect(productsPage.productCards.filter({ hasNotText: 'No results found' })).toHaveCount(0);
  });

  for (const term of ['APPLE', 'ApPlE']) {
    test(`returns the same products for "${term}" as for "apple"`, async ({ productsPage }) => {
      const baseline = await searchAndCollect(productsPage, 'apple', /apple/i);
      const variant = await searchAndCollect(productsPage, term, /apple/i);

      expect(variant).toEqual(baseline);
    });
  }
});

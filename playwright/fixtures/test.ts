import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { BasketPage } from '../pages/BasketPage';
import { newTestUser, registerUser, TestUser } from '../utils/api';

type Fixtures = {
  loginPage: LoginPage;
  productsPage: ProductsPage;
  basketPage: BasketPage;
  user: TestUser;          // a fresh, registered user for each test
};

/**
 * Custom fixtures: every test gets ready-made page objects and its own user,
 * and Juice Shop's welcome banner and cookie popup are pre-dismissed so they
 * never block a click.
 */
export const test = base.extend<Fixtures>({
  page: async ({ page, baseURL }, use) => {
    const { hostname } = new URL(baseURL!);
    await page.context().addCookies([
      { name: 'welcomebanner_status', value: 'dismiss', domain: hostname, path: '/' },
      { name: 'cookieconsent_status', value: 'dismiss', domain: hostname, path: '/' },
    ]);
    await use(page);
  },
  user: async ({ request }, use) => {
    const user = newTestUser();
    await registerUser(request, user);
    await use(user);
  },
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  productsPage: async ({ page }, use) => use(new ProductsPage(page)),
  basketPage: async ({ page }, use) => use(new BasketPage(page)),
});

export { expect };

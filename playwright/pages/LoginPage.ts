import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly error: Locator;
  readonly accountMenu: Locator;
  readonly logoutButton: Locator;
  readonly loginMenuButton: Locator;

  constructor(private readonly page: Page) {
    this.email = page.locator('#email');
    this.password = page.locator('#password');
    this.submit = page.locator('#loginButton');
    this.error = page.locator('.error');
    this.accountMenu = page.locator('#navbarAccount');
    this.logoutButton = page.locator('#navbarLogoutButton');
    this.loginMenuButton = page.locator('#navbarLoginButton');
  }

  async goto() {
    await this.page.goto('/#/login');
  }

  async login(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }

  /** Logged in = the Account menu offers "Logout". */
  async expectLoggedIn() {
    await expect(this.page).not.toHaveURL(/\/login/);   // successful login navigates away
    await this.accountMenu.click();
    await expect(this.logoutButton).toBeVisible();
    await this.page.keyboard.press('Escape');            // close the menu again
  }

  /** Logged out = still on the login page, and the Account menu offers "Login". */
  async expectLoggedOut() {
    await expect(this.page).toHaveURL(/\/login/);
    await this.accountMenu.click();
    await expect(this.loginMenuButton).toBeVisible();
    await expect(this.logoutButton).toBeHidden();
    await this.page.keyboard.press('Escape');
  }
}
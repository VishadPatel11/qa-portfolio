import { test, expect } from '../fixtures/test';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('a registered user can log in @smoke', async ({ loginPage, user }) => {
    await loginPage.login(user.email, user.password);
    await loginPage.expectLoggedIn();

  });

  test('wrong password shows an error and keeps the user logged out', async ({ loginPage, user }) => {
    await loginPage.login(user.email, 'not-the-password');
    await expect(loginPage.error).toHaveText(/Invalid email or password/);
    await loginPage.expectLoggedOut();
  });

  // Data-driven: one test definition, several cases. Interviewers like seeing this pattern.
  const invalid = [
    { name: 'unknown email', email: 'nobody@test.local', password: 'whatever' },
    { name: 'email without domain', email: 'nobody', password: 'whatever' },
  ];
  for (const c of invalid) {
    test(`rejects login: ${c.name}`, async ({ loginPage }) => {
      await loginPage.login(c.email, c.password);
      await loginPage.expectLoggedOut();
    });
  }

  test('login button is disabled until both fields are filled', async ({ loginPage }) => {
    await expect(loginPage.submit).toBeDisabled();
    await loginPage.email.fill('someone@test.local');
    await expect(loginPage.submit).toBeDisabled();
    await loginPage.password.fill('x');
    await expect(loginPage.submit).toBeEnabled();
  });

  // TODO (week 1 exercise): Juice Shop's login is vulnerable to SQL injection.
  // Write a test that logs in with email  ' OR 1=1--  and any password, and assert what happens.
  // Then write in a comment what bug report you'd file. This is your first "security-minded" test.

test('rejects SQL injection in the email field @security', async ({ loginPage }) => {
  test.fail(true, 'Known vulnerability: login is open to SQL injection. Remove test.fail() once fixed.');

  await loginPage.login("' OR 1=1--", 'anyPassword');
  await loginPage.expectLoggedOut();
});
});

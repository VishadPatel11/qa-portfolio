describe('Login', () => {
  beforeEach(() => {
    cy.createUser().as('user');
  });

  it('a registered user can log in', function () {
    cy.loginUi(this.user.email, this.user.password);
    cy.get('button[aria-label="Show the shopping cart"]').should('be.visible');
  });

  it('wrong password shows an error', function () {
    cy.loginUi(this.user.email, 'not-the-password');
    cy.get('.error').should('contain.text', 'Invalid email or password');
    cy.get('button[aria-label="Show the shopping cart"]').should('not.exist');
  });

  // TODO (week 3 exercise): port the data-driven "rejects login" cases from
  // playwright/tests/login.spec.ts using a fixture file (cypress/fixtures/invalid-logins.json).
});

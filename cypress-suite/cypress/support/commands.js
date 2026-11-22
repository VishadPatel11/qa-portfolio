// Custom commands are Cypress's answer to Playwright fixtures / page objects.

/** Create a fresh user through the API and yield { email, password }. */
Cypress.Commands.add('createUser', () => {
  const id = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  const user = { email: `qa-${id}@test.local`, password: 'Str0ng!Passw0rd' };
  return cy
    .request('POST', '/api/Users', {
      email: user.email,
      password: user.password,
      passwordRepeat: user.password,
      securityQuestion: { id: 1 },
      securityAnswer: 'test',
    })
    .its('status')
    .should('eq', 201)
    .then(() => user);
});

/** Log in through the UI. */
Cypress.Commands.add('loginUi', (email, password) => {
  cy.visit('/#/login');
  cy.get('#email').type(email);
  cy.get('#password').type(password, { log: false });
  cy.get('#loginButton').click();
});

/**
 * Log in through the API and put the token where the Angular app expects it.
 * Much faster than the UI; use it for every test that is NOT about login itself.
 */
Cypress.Commands.add('loginApi', (email, password) => {
  cy.request('POST', '/rest/user/login', { email, password }).then(({ body }) => {
    const { token, bid } = body.authentication;
    cy.setCookie('token', token);
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', token);
        win.sessionStorage.setItem('bid', String(bid));
      },
    });
  });
});

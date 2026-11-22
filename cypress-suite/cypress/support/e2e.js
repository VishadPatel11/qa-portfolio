import './commands';

// Pre-dismiss Juice Shop's welcome banner and cookie popup before every test.
beforeEach(() => {
  cy.setCookie('welcomebanner_status', 'dismiss');
  cy.setCookie('cookieconsent_status', 'dismiss');
});

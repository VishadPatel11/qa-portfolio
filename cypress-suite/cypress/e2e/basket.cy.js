const PRODUCT = 'Apple Juice (1000ml)';

describe('Basket', () => {
  beforeEach(() => {
    cy.createUser().then((user) => cy.loginApi(user.email, user.password));
  });

  it('a product added from search appears in the basket', () => {
    // Wait on the real network call rather than a fixed sleep.
    cy.intercept('POST', '/api/BasketItems').as('addItem');

    cy.visit('/#/search?q=apple%20juice');
    cy.contains('mat-card', PRODUCT).find('button[aria-label="Add to Basket"]').click();
    cy.wait('@addItem').its('response.statusCode').should('eq', 200);

    cy.visit('/#/basket');
    cy.contains('mat-row', PRODUCT).should('be.visible');
    cy.get('#checkoutButton').should('be.enabled');
  });

  // TODO (week 3 exercise): use cy.intercept to STUB /rest/products/search with a
  // fixture that returns an empty list, and assert the UI handles "no results" cleanly.
  // Stubbing the network is a Cypress strength worth showing off.
});

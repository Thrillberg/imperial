describe('Login', () => {
  it('is successful', () => {
    cy.factory('account', { email: 'a@b.com', password: 'password' });

    cy.visit('/');
    cy.get('.incognito').click();
    cy.contains('Sign In').click();

    cy.get('input').eq('0').type('a@b.com');
    cy.get('input').eq('1').type('password');
    cy.contains('Sign In').click();
  });
});

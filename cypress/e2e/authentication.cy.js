describe('Login', () => {
  it('is successful', () => {
    cy.factory('account', { email: 'a@b.com', password: 'password' });

    cy.visit('/');
    cy.contains('Sign In').click();

    cy.get('input').eq('0').should('have.attr', 'placeholder', 'email');
    cy.get('input').eq('1').should('have.attr', 'placeholder', 'password');

    cy.get('input').eq('0').type('a@b.com');
    cy.get('input').eq('1').type('password');
    cy.get('input').eq('2').click();

    cy.contains('Signed in as');
  });
});

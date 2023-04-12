describe('Swiss banks', () => {
  it('works', () => {
    cy.factory('account', { email: 'a@b.com', password: 'password' });
    cy.login('a@b.com');

    cy.visit('/');
    cy.contains('New Game').click();
    cy.get('input[value="auction"]').check();
    cy.contains('New Game').click();
    cy.contains('Start Solo Game').click();

    // AH
    cy.get('.bg-AH').contains('2:4').click();
    cy.get('.bg-AH').contains('3:6').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    // IT
    cy.get('.bg-IT').contains('2:4').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.bg-IT').contains('3:6').click();
    // FR
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.bg-FR').contains('2:4').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    // GB
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.bg-GB').contains('2:4').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    // GE
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    // RU
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    // Game starts
    // AH
    cy.get('#investor').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.bg-IT').contains('4:9').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    // IT
    cy.get('#production1').click();
    // FR
    cy.get('#production1').click();
    // GB
    cy.get('#production1').click();
    // GE
    cy.get('#production1').click();
    // RU
    cy.get('#production1').click();
    // AH
    cy.get('#production2').click();
    // IT
    cy.get('#import').click();
    cy.contains('Undo').click();
    cy.get('#import').click();
    // TODO: Fix the below errors. They arise from a very unrealistic game but should be handled nonetheless.
    // cy.contains('Undo').click();
    // cy.get('#import').click();
    // cy.contains('Undo').click();
    // cy.get('#import').click();
    // cy.contains('Force investor').click();
    // cy.contains('Do not buy a bond').click();
    // cy.contains('Do not buy a bond').click();
    // cy.contains('Do not buy a bond').click();
  });
});

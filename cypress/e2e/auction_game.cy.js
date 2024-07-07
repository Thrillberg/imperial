describe('Auction game', () => {
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
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-title').within(() => {
      cy.get('button').click();
    });
    cy.contains('Undo').click();
    cy.contains('Buy a bond').click();
    cy.get('.bg-IT').contains('2:4').click();
    cy.get('.bg-IT').contains('3:6').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    // FR
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.bg-FR').contains('2:4').click();
    cy.get('.bg-FR').contains('3:6').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    // GB
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.bg-GB').contains('2:4').click();
    cy.get('.bg-GB').contains('3:6').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    // GE
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.bg-GE').contains('2:4').click();
    cy.get('.bg-GE').contains('3:6').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    // RU
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.v-card-actions').contains('Do not buy a bond').click();
    cy.get('.bg-RU').contains('2:4').click();
    cy.get('.bg-RU').contains('3:6').click();
    // Game starts
    // AH
    cy.get('#production1').click();
    // IT
    cy.get('#maneuver1').click();
    cy.contains('Undo').click();
    cy.get('#production1').click();
    // FR
    cy.get('#factory').click();
    cy.contains('Dijon').next().click();
    // GB
    cy.get('#investor').click();
    cy.get('.bg-AH').contains('1:2').click();
    cy.get('.bg-AH').contains('4:9').click();
    // GE
    cy.get('#import').click();
    cy.contains('Danzig').next().click();
    cy.contains('Fleet').click();
    cy.contains('Berlin').next().click();
    cy.contains('Berlin').next().click();
    // RU
    cy.get('#production2').click();
    // AH
    cy.get('#import').click();
    cy.contains('Force investor').click();
  });
});

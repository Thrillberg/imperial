describe('Standard game', () => {
  it('works', () => {
    cy.factory('account', { email: 'a@b.com', password: 'password' });
    cy.login('a@b.com');

    cy.visit('/');
    cy.contains('New Game').click();
    cy.contains('New Game').click();
    cy.contains('Start Solo Game').click();
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
    cy.get('.bg-AH').contains('2:4').click();
    // GE
    cy.get('#import').click();
    cy.contains('Danzig').next().click();
    cy.contains('Fleet').click();
    cy.contains('Berlin').next().click();
    cy.contains('Berlin').next().click();
    // RU
    cy.get('#production2').click();
    // AH
    cy.get('#maneuver1').click();
    cy.contains('Budapest').next().click();
    cy.contains('Romania').click();
    cy.contains('Vienna').next().click();
    cy.contains('Danzig').click();
    cy.contains('Fight').click();
    // IT
    cy.get('#maneuver1').click();
    cy.contains('Rome').next().click();
    cy.contains('Spain').click();
    cy.contains('Undo').click();
    cy.get('#maneuver1').click();
    cy.contains('Naples').next().click();
    cy.contains('Western Mediterranean Sea').click();
    cy.contains('Rome').next().click();
    cy.contains('Spain').click();
    // FR
    cy.get('#production1').click();
    // GB
    cy.get('#production2').click();
    // GR
    cy.get('#production1').click();
    cy.get('#maneuver2').click();
    cy.contains('Berlin').next().click();
    cy.contains('Holland').click();
    cy.contains('Berlin').next().click();
    cy.contains('Denmark').click();
    // RU
    cy.get('#maneuver2').click();
    cy.contains('Moscow').next().click();
    cy.contains('Lemberg').next().click();
    cy.contains('Enter unfriendly').click();
    // AH
    cy.get('#investor').click();
    cy.get('.bg-IT').contains('2:4').click();
    // IT
    cy.get('#investor').click();
    cy.get('.bg-RU').contains('3:6').click();
    // FR
    cy.get('#maneuver1').click();
    cy.contains('Bordeaux').next().click();
    cy.contains('Bay of Biscay').click();
    cy.contains('Paris').next().click();
    cy.contains('Belgium').click();
    cy.contains('Dijon').next().click();
    cy.contains('Portugal').click();
    // GB
    cy.get('#maneuver2').click();
    cy.contains('Liverpool').next().click();
    cy.contains('North Atlantic').click();
    cy.contains('London').next().click();
    cy.contains('English Channel').click();
    // GE
    cy.get('#taxation').click();
    // RU
    cy.get('#factory').click();
    cy.contains('Kiev').next().click();
    // AH
    cy.get('#production2').click();
    // IT
    cy.get('#production2').click();
    // FR
    cy.get('#investor').click();
    cy.get('.bg-AH').contains('3:6').click();
    // GB
    cy.get('#taxation').click();
    // GE
    cy.get('#factory').click();
    cy.contains('Danzig').click();
    // RU
    cy.get('#production1').click();
    // AH
    cy.get('#maneuver2').click();
    cy.contains('Vienna').next().click();
    cy.contains('West Balkan').click();
    cy.contains('Budapest').next().click();
    cy.contains('Lemberg').next().click();
    cy.contains('Fight').click();
    cy.contains('Vienna').next().click();
    cy.contains('West Balkan').click();
    cy.contains('Romania').next().click();
    cy.contains('Bulgaria').click();
    // IT
    cy.get('#maneuver2').click();
    cy.contains('Naples').next().click();
    cy.contains('Western Mediterranean Sea').click();
    cy.contains('Rome').next().click();
    cy.contains('Tunis').click();
    cy.contains('Spain').next().click();
    cy.contains('Algeria').click();
    // FR
    cy.get('#production2').click();
    // GB
    cy.get('#production1').click();
    // GE
    cy.get('#production1').click();
    // RU
    cy.get('#maneuver1').click();
    cy.contains('Odessa').next().click();
    cy.contains('Black Sea').click();
    cy.contains('Odessa').next().click();
    cy.contains('Black Sea').click();
    cy.contains('Moscow').next().click();
    cy.contains('Lemberg').next().click();
    cy.contains('Enter unfriendly').click();
    cy.contains('Kiev').next().click();
    cy.contains('Romania').click();
    // AH
    cy.get('#taxation').click();
    // IT
    cy.get('#taxation').click();
    // FR
    cy.get('#maneuver2').click();
    cy.contains('Bordeaux').next().click();
    cy.contains('Bay of Biscay').click();
    cy.contains('Portugal').next().click();
    cy.contains('Spain').click();
    cy.contains('Dijon').next().click();
    cy.contains('Morocco').click();
    cy.contains('Paris').next().click();
    cy.contains('Munich').next().click();
    cy.contains('Enter unfriendly').click();
    cy.contains('End maneuver').click();
    // GB
    cy.get('#maneuver1').click();
    cy.contains('Liverpool').next().click();
    cy.contains('North Atlantic').click();
    cy.contains('London').next().click();
    cy.contains('English Channel').click();
    cy.contains('English Channel').click();
    cy.contains('Bay of Biscay').click();
    cy.contains('Fight').click();
    cy.contains('North Atlantic').click();
    cy.contains('Bay of Biscay').click();
    cy.contains('Fight').click();
    // GE
    cy.get('#maneuver1').click();
    cy.contains('Hamburg').next().click();
    cy.contains('North Sea').click();
    cy.contains('Danzig').next().click();
    cy.contains('Baltic Sea').click();
    cy.contains('Berlin').next().click();
    cy.contains('Munich').next().click();
    cy.contains('Fight').click();
    cy.contains('Holland').click({ force: true });
    cy.contains('Belgium').click({ force: true });
    cy.contains('Fight').click();
    cy.contains('Denmark').click({ force: true });
    cy.contains('Sweden').click();
    // RU
    cy.get('#investor').click();
    cy.get('.bg-RU').contains('5:12').click();
    cy.get('.bg-GE').contains('2:4').click();
    // AH
    cy.get('#maneuver1').click();
    cy.contains('Bulgaria').click();
    cy.contains('Romania').click();
    cy.contains('Coexist').click();
    cy.contains('Fight').click();
  });
});

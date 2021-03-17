describe("Without Investor Card game", () => {
  it("works", () => {
    cy.factory("account", {email: "a@b.com", password: "password"})
    cy.login("a@b.com")

    cy.visit("/")
    cy.contains("Open a New Game").click()
    cy.contains("Start Game Without Investor Card").click()

    // AH
    cy.get(".bg-AH").contains("2:4").click()
    cy.get(".bg-AH").contains("3:6").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    // IT
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Undo").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    // FR
    cy.contains("Do not buy a bond").click()
    cy.get(".bg-FR").contains("2:4").click()
    cy.get(".bg-FR").contains("3:6").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    // GB
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.get(".bg-GB").contains("2:4").click()
    cy.get(".bg-GB").contains("3:6").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    // GE
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.get(".bg-GE").contains("2:4").click()
    cy.get(".bg-GE").contains("3:6").click()
    cy.contains("Do not buy a bond").click()
    // RU
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.get(".bg-RU").contains("2:4").click()
    cy.get(".bg-RU").contains("3:6").click()
    // Game starts
    // AH
    cy.get("#investor").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.get(".bg-AH").contains("1:2").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    // IT
    cy.get(".bg-IT").contains("3:6").click()
    cy.get(".bg-IT").contains("4:9").click()
    cy.get(".bg-IT").contains("2:4").click()
    cy.get(".bg-IT").contains("1:2").click()
    // FR
    cy.get("#production1").click()
    cy.get(".bg-FR").contains("4:9").click()
    cy.get(".bg-FR").contains("1:2").click()
    cy.get(".bg-GB").contains("1:2").click()
    // GB
    cy.get("#taxation").click()
    cy.contains("Do not buy a bond").click()
    // GE
    cy.get("#factory").click()
    cy.contains("Munich").next().click()
    cy.get(".bg-GE").contains("1:2").click()
    // RU
    cy.get("#investor").click()
    cy.get(".bg-RU").contains("1:2").click()
  })
})


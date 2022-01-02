describe("Swiss banks", () => {
  it("works", () => {
    cy.factory("account", {email: "a@b.com", password: "password"})
    cy.login("a@b.com")

    cy.visit("/")
    cy.contains("New Game").click()
    cy.get("#auction").check()
    cy.contains("New Game").click()
    cy.contains("Start Solo Game").click()

    // AH
    cy.get(".bg-AH").contains("2:4").click()
    cy.get(".bg-AH").contains("3:6").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    // IT
    cy.get(".bg-IT").contains("2:4").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.get(".bg-IT").contains("3:6").click()
    // FR
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.get(".bg-FR").contains("2:4").click()
    cy.contains("Do not buy a bond").click()
    // GB
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.get(".bg-GB").contains("2:4").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    // GE
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    // RU
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    // Game starts
    // AH
    cy.get("#investor").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.get(".bg-IT").contains("1:2").click()
  })
})

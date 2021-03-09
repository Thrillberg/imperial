describe("Game", () => {
  it("works", () => {
    cy.factory("account", {email: "a@b.com", password: "password"})
    cy.login("a@b.com")

    cy.visit("/")
    cy.contains("Open a New Game").click()
    cy.contains("Start Standard Game").click()
    // AH
    cy.get("#production1").click()
    // IT
    cy.get("#maneuver1").click()
    cy.contains("Undo").click()
    cy.get("#production1").click()
    // FR
    cy.get("#factory").click()
    cy.contains("Dijon").next().click()
    // GB
    cy.get("#investor").click()
    cy.get(".bg-AH").contains("2:4").click()
    // GE
    cy.get("#import").click()
    cy.contains("Danzig").next().click()
    cy.contains("Fleet").click()
    cy.contains("Berlin").next().click()
    cy.contains("Berlin").next().click()
    // RU
    cy.get("#production2").click()
    // AH
    cy.get("#maneuver1").click()
    cy.contains("Budapest").next().click()
    cy.contains("Romania").click()
    cy.contains("Vienna").next().click()
    cy.contains("Danzig").click()
  })
})

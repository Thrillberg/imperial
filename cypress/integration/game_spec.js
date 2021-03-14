describe("Standard game", () => {
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
    cy.contains("Fight").click()
    // IT
    cy.get("#maneuver1").click()
    cy.contains("Rome").next().click()
    cy.contains("Spain").click()
    cy.contains("Undo").click()
    cy.get("#maneuver1").click()
    cy.contains("Naples").next().click()
    cy.contains("Western Mediterranean Sea").click()
    cy.contains("Rome").next().click()
    cy.contains("Spain").click()
    // FR
    cy.get("#production1").click()
    // GB
    cy.get("#production2").click()
    // GR
    cy.get("#production1").click()
    cy.get("#maneuver2").click()
    cy.contains("Berlin").next().click()
    cy.contains("Holland").click()
    cy.contains("Berlin").next().click()
    cy.contains("Denmark").click()
    // RU
    cy.get("#maneuver2").click()
    cy.contains("Moscow").next().click()
    cy.contains("Lemberg").next().click()
    cy.contains("Enter unfriendly").click()
  })
})

describe("Auction game", () => {
  it("works", () => {
    cy.factory("account", {email: "a@b.com", password: "password"})
    cy.login("a@b.com")

    cy.visit("/")
    cy.contains("Open a New Game").click()
    cy.contains("Start Auction Variant Game").click()

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
    cy.get(".bg-IT").contains("2:4").click()
    cy.get(".bg-IT").contains("3:6").click()
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
    cy.get(".bg-AH").contains("1:2").click()
    cy.get(".bg-AH").contains("4:9").click()
    // GE
    cy.get("#import").click()
    cy.contains("Danzig").next().click()
    cy.contains("Fleet").click()
    cy.contains("Berlin").next().click()
    cy.contains("Berlin").next().click()
    // RU
    cy.get("#production2").click()
    // AH
    cy.get("#import").click()
    cy.contains("Force investor").click()
  })
})

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
    cy.get(".bg-GE").contains("1:2").click()
    cy.contains("Do not buy a bond").click()
    cy.get(".bg-IT").contains("1:2").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
    cy.contains("Do not buy a bond").click()
  })
})


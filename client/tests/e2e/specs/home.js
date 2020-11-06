describe("Home view", () => {
  it("has a Register button", () => {
    cy.visit("http://localhost:8081/");

    cy.contains("span", "Register");
  });
});

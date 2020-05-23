const imperial = require("./imperial");

describe("available actions", () => {
  test("empty state", () => {
    const log = [];
    const actions = imperial.getAvailableActions(log);
    const expected = [
      "factory",
      "production1",
      "maneuver1",
      "investor",
      "import",
      "production2",
      "maneuver2",
      "taxation",
    ].map((slot) => ({
      type: "rondel",
      payload: { nation: "AH", cost: 0, slot },
    }));
    expect(actions).toEqual(new Set(expected));
  });

  test("AH moved to the factory slot", () => {
    const log = [
      { type: "rondel", payload: { nation: "AH", cost: 0, slot: "factory" } },
    ];
    const actions = imperial.getAvailableActions(log);
    const expected = new Set(
      ["trieste", "prague", "lemburg"].map((province) => ({
        type: "buildFactory",
        payload: { province },
      }))
    );
    expect(actions).toEqual(expected);
  });

  test("AH built a factory in Trieste", () => {
    const log = [
      { type: "rondel", payload: { nation: "AH", cost: 0, slot: "factory" } },
      { type: "buildFactory", payload: { province: "trieste" } },
    ];
    const actions = imperial.getAvailableActions(log);
    const expected = [
      "factory",
      "production1",
      "maneuver1",
      "investor",
      "import",
      "production2",
      "maneuver2",
      "taxation",
    ].map((slot) => ({
      type: "rondel",
      payload: { nation: "IT", cost: 0, slot },
    }));
    expect(actions).toEqual(new Set(expected));
  });

  test("IT moved to the production1 slot", () => {
    const log = [
      { type: "rondel", payload: { nation: "AH", cost: 0, slot: "factory" } },
      { type: "buildFactory", payload: { province: "trieste" } },
      {
        type: "rondel",
        payload: { nation: "IT", cost: 0, slot: "production1" },
      },
    ];
    const actions = imperial.getAvailableActions(log);
    const expected = [
      "factory",
      "production1",
      "maneuver1",
      "investor",
      "import",
      "production2",
      "maneuver2",
      "taxation",
    ].map((slot) => ({
      type: "rondel",
      payload: { nation: "FR", cost: 0, slot },
    }));
    expect(actions).toEqual(new Set(expected));
  });

  xtest("FR moved to the maneuver1 slot", () => {
    const log = [
      { type: "rondel", payload: { nation: "AH", cost: 0, slot: "factory" } },
      { type: "buildFactory", payload: { province: "trieste" } },
      {
        type: "rondel",
        payload: { nation: "IT", cost: 0, slot: "production1" },
      },
      {
        type: "rondel",
        payload: { nation: "FR", cost: 0, slot: "maneuver1" },
      },
    ];
    const actions = imperial.getAvailableActions(log);
    const expected = [].map((slot) => ({
      type: "rondel",
      payload: { nation: "GB", cost: 0, slot },
    }));
    expect(actions).toEqual(new Set(expected));
  });
});

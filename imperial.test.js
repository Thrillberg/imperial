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

  test("FR moved to the maneuver1 slot", () => {
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
      payload: { nation: "GB", cost: 0, slot },
    }));
    expect(actions).toEqual(new Set(expected));
  });

  test("GB moved to the investor slot", () => {
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
      {
        type: "rondel",
        payload: { nation: "GB", cost: 0, slot: "investor" },
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
      payload: { nation: "GE", cost: 0, slot },
    }));
    expect(actions).toEqual(new Set(expected));
  });

  test("GE moved to the import slot", () => {
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
      {
        type: "rondel",
        payload: { nation: "GB", cost: 0, slot: "investor" },
      },
      {
        type: "rondel",
        payload: { nation: "GE", cost: 0, slot: "import" },
      },
    ];
    const actions = imperial.getAvailableActions(log);
    const expected = ["berlin", "hamburg"].map((province) => ({
      type: "import",
      payload: { province },
    }));
    expect(actions).toEqual(new Set(expected));
  });

  test("GE imported an army in Berlin", () => {
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
      {
        type: "rondel",
        payload: { nation: "GB", cost: 0, slot: "investor" },
      },
      {
        type: "rondel",
        payload: { nation: "GE", cost: 0, slot: "import" },
      },
      { type: "import", payload: { province: "berlin" } },
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
      payload: { nation: "RU", cost: 0, slot },
    }));
    expect(actions).toEqual(new Set(expected));
  });

  test("RU moved to the production2 slot", () => {
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
      {
        type: "rondel",
        payload: { nation: "GB", cost: 0, slot: "investor" },
      },
      {
        type: "rondel",
        payload: { nation: "GE", cost: 0, slot: "import" },
      },
      { type: "import", payload: { province: "berlin" } },
      {
        type: "rondel",
        payload: { nation: "RU", cost: 0, slot: "production2" },
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
      payload: { nation: "AH", cost: 0, slot },
    }));
    expect(actions).toEqual(new Set(expected));
  });
});

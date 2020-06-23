const { Nation } = require("./constants");
const Action = require("./action");
const Imperial = require("./imperial");
const rondelSlots = [
  "factory",
  "production1",
  "maneuver1",
  "investor",
  "import",
  "production2",
  "maneuver2",
  "taxation",
];

describe("available actions", () => {
  test("empty state", () => {
    const log = [
      Action.playerSeating({ order: ["Daniel", "Claudia", "Bert", "Anton"] }),
    ];
    const actions = Imperial.fromLog(log).state.availableActions;
    const expected = rondelSlots.map((slot) =>
      Action.rondel({ nation: Nation.AH, cost: 0, slot })
    );
    expect(actions).toEqual(new Set(expected));
  });

  describe("moving to the factory slot", () => {
    test("AH", () => {
      const log = [
        Action.playerSeating({ order: ["Daniel", "Claudia", "Bert", "Anton"] }),
        Action.rondel({ nation: Nation.AH, cost: 0, slot: "factory" }),
      ];
      const actions = Imperial.fromLog(log).state.availableActions;
      const expected = new Set(
        ["trieste", "prague", "lemburg"].map((province) =>
          Action.buildFactory({ province })
        )
      );
      expect(actions).toEqual(expected);
    });

    test("IT", () => {
      const log = [
        Action.playerSeating({ order: ["Daniel", "Claudia", "Bert", "Anton"] }),
        Action.rondel({ nation: Nation.IT, cost: 0, slot: "factory" }),
      ];
      const actions = Imperial.fromLog(log).state.availableActions;
      const expected = new Set(
        ["genoa", "venice", "florence"].map((province) =>
          Action.buildFactory({ province })
        )
      );
      expect(actions).toEqual(expected);
    });

    test("FR", () => {
      const log = [
        Action.playerSeating({ order: ["Daniel", "Claudia", "Bert", "Anton"] }),
        Action.rondel({ nation: Nation.FR, cost: 0, slot: "factory" }),
      ];
      const actions = Imperial.fromLog(log).state.availableActions;
      const expected = new Set(
        ["brest", "dijon", "marseille"].map((province) =>
          Action.buildFactory({ province })
        )
      );
      expect(actions).toEqual(expected);
    });

    test("GB", () => {
      const log = [
        Action.playerSeating({ order: ["Daniel", "Claudia", "Bert", "Anton"] }),
        Action.rondel({ nation: Nation.GB, cost: 0, slot: "factory" }),
      ];
      const actions = Imperial.fromLog(log).state.availableActions;
      const expected = new Set(
        ["dublin", "sheffield", "edinburgh"].map((province) =>
          Action.buildFactory({ province })
        )
      );
      expect(actions).toEqual(expected);
    });

    test("GE", () => {
      const log = [
        Action.playerSeating({ order: ["Daniel", "Claudia", "Bert", "Anton"] }),
        Action.rondel({ nation: Nation.GE, cost: 0, slot: "factory" }),
      ];
      const actions = Imperial.fromLog(log).state.availableActions;
      const expected = new Set(
        ["danzig", "munich", "cologne"].map((province) =>
          Action.buildFactory({ province })
        )
      );
      expect(actions).toEqual(expected);
    });

    test("RU", () => {
      const log = [
        Action.playerSeating({ order: ["Daniel", "Claudia", "Bert", "Anton"] }),
        Action.rondel({ nation: Nation.RU, cost: 0, slot: "factory" }),
      ];
      const actions = Imperial.fromLog(log).state.availableActions;
      const expected = new Set(
        ["kiev", "st. petersburg", "warsaw"].map((province) =>
          Action.buildFactory({ province })
        )
      );
      expect(actions).toEqual(expected);
    });
  });

  test("AH built a factory in Trieste", () => {
    const log = [
      Action.playerSeating({ order: ["Daniel", "Claudia", "Bert", "Anton"] }),
      Action.rondel({ nation: Nation.AH, cost: 0, slot: "factory" }),
      Action.buildFactory({ province: "trieste" }),
    ];
    const actions = Imperial.fromLog(log).state.availableActions;
    const expected = rondelSlots.map((slot) =>
      Action.rondel({ nation: Nation.IT, cost: 0, slot })
    );
    expect(actions).toEqual(new Set(expected));
  });

  test("IT moved to the production1 slot", () => {
    const log = [
      Action.playerSeating({ order: ["Daniel", "Claudia", "Bert", "Anton"] }),
      Action.rondel({ nation: Nation.IT, cost: 0, slot: "production1" }),
    ];
    const actions = Imperial.fromLog(log).state.availableActions;
    const expected = rondelSlots.map((slot) =>
      Action.rondel({ nation: Nation.FR, cost: 0, slot })
    );
    expect(actions).toEqual(new Set(expected));
  });

  describe("moving to the import slot", () => {
    test("AH moved to the import slot", () => {
      const log = [
        Action.playerSeating({ order: ["Daniel", "Claudia", "Bert", "Anton"] }),
        Action.rondel({ nation: Nation.AH, cost: 0, slot: "import" }),
      ];
      const actions = Imperial.fromLog(log).state.availableActions;
      const expected = [
        "vienna",
        "budapest",
        "prague",
        "lemberg",
        "trieste",
      ].map((province) => Action.import({ province }));
      expect(actions).toEqual(new Set(expected));
    });

    test("IT moved to the import slot", () => {
      const log = [
        Action.playerSeating({ order: ["Daniel", "Claudia", "Bert", "Anton"] }),
        Action.rondel({ nation: Nation.IT, cost: 0, slot: "import" }),
      ];
      const actions = Imperial.fromLog(log).state.availableActions;
      const expected = ["rome", "naples"].map((province) =>
        Action.import({ province })
      );
      expect(actions).toEqual(new Set(expected));
    });

    test("FR moved to the import slot", () => {
      const log = [
        Action.playerSeating({ order: ["Daniel", "Claudia", "Bert", "Anton"] }),
        Action.rondel({ nation: Nation.FR, cost: 0, slot: "import" }),
      ];
      const actions = Imperial.fromLog(log).state.availableActions;
      const expected = ["paris", "bordeaux"].map((province) =>
        Action.import({ province })
      );
      expect(actions).toEqual(new Set(expected));
    });

    test("GB moved to the import slot", () => {
      const log = [
        Action.playerSeating({ order: ["Daniel", "Claudia", "Bert", "Anton"] }),
        Action.rondel({ nation: Nation.GB, cost: 0, slot: "import" }),
      ];
      const actions = Imperial.fromLog(log).state.availableActions;
      const expected = ["london", "liverpool"].map((province) =>
        Action.import({ province })
      );
      expect(actions).toEqual(new Set(expected));
    });

    test("GE moved to the import slot", () => {
      const log = [
        Action.playerSeating({ order: ["Daniel", "Claudia", "Bert", "Anton"] }),
        Action.rondel({ nation: Nation.GE, cost: 0, slot: "import" }),
      ];
      const actions = Imperial.fromLog(log).state.availableActions;
      const expected = ["berlin", "hamburg"].map((province) =>
        Action.import({ province })
      );
      expect(actions).toEqual(new Set(expected));
    });

    test("RU moved to the import slot", () => {
      const log = [
        Action.playerSeating({ order: ["Daniel", "Claudia", "Bert", "Anton"] }),
        Action.rondel({ nation: Nation.RU, cost: 0, slot: "import" }),
      ];
      const actions = Imperial.fromLog(log).state.availableActions;
      const expected = [
        "moscow",
        "st. petersburg",
        "odessa",
        "kiev",
        "warsaw",
      ].map((province) => Action.import({ province }));
      expect(actions).toEqual(new Set(expected));
    });
  });

  test("GE imported an army in Berlin", () => {
    const log = [
      Action.playerSeating({ order: ["Daniel", "Claudia", "Bert", "Anton"] }),
      Action.rondel({ nation: Nation.GE, cost: 0, slot: "import" }),
      Action.import({ province: "berlin" }),
    ];
    const actions = Imperial.fromLog(log).state.availableActions;
    const expected = rondelSlots.map((slot) =>
      Action.rondel({ nation: Nation.RU, cost: 0, slot })
    );
    expect(actions).toEqual(new Set(expected));
  });

  test("RU moved to the production2 slot", () => {
    const log = [
      Action.playerSeating({ order: ["Daniel", "Claudia", "Bert", "Anton"] }),
      Action.rondel({ nation: Nation.RU, cost: 0, slot: "production2" }),
    ];
    const actions = Imperial.fromLog(log).state.availableActions;
    const expected = rondelSlots.map((slot) =>
      Action.rondel({ nation: Nation.AH, cost: 0, slot })
    );
    expect(actions).toEqual(new Set(expected));
  });

  test("IT moved to the taxation slot", () => {
    const log = [
      Action.playerSeating({ order: ["Daniel", "Claudia", "Bert", "Anton"] }),
      Action.rondel({ nation: Nation.IT, cost: 0, slot: "taxation" }),
    ];
    const actions = Imperial.fromLog(log).state.availableActions;
    const expected = rondelSlots.map((slot) =>
      Action.rondel({ nation: Nation.FR, cost: 0, slot })
    );
    expect(actions).toEqual(new Set(expected));
  });
});

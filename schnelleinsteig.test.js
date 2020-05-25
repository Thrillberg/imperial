const imperial = require("./imperial");
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

const setupLog = [
  {
    type: "bondPurchase",
    payload: { nation: "AH", player: "Claudia", cost: 2 },
  },
  {
    type: "bondPurchase",
    payload: { nation: "IT", player: "Anton", cost: 9 },
  },
  {
    type: "bondPurchase",
    payload: { nation: "FR", player: "Claudia", cost: 9 },
  },
  {
    type: "bondPurchase",
    payload: { nation: "FR", player: "Daniel", cost: 2 },
  },
  {
    type: "bondPurchase",
    payload: { nation: "GB", player: "Anton", cost: 2 },
  },
  {
    type: "bondPurchase",
    payload: { nation: "GB", player: "Bert", cost: 9 },
  },
  {
    type: "bondPurchase",
    payload: { nation: "RU", player: "Bert", cost: 2 },
  },
  {
    type: "bondPurchase",
    payload: { nation: "RU", player: "Daniel", cost: 9 },
  },
];

describe("Schnelleinsteig", () => {
  describe("setup for four players", () => {
    test("All players receive 11 million", () => {
      const log = [];
      ["Daniel", "Claudia", "Bert", "Anton"].forEach((player) => {
        expect(imperial.getCash(player, log)).toEqual(11);
      });
    });
    test("Claudia buys a 2 million AH bond", () => {
      const log = [
        {
          type: "bondPurchase",
          payload: { nation: "AH", player: "Claudia", cost: 2 },
        },
      ];
      expect(imperial.getCash("Claudia", log)).toEqual(9);
      expect(imperial.getTreasury("AH", log)).toEqual(2);
    });

    test("Anton buys a 9 million IT bond", () => {
      const log = [
        {
          type: "bondPurchase",
          payload: { nation: "IT", player: "Anton", cost: 9 },
        },
      ];
      expect(imperial.getCash("Anton", log)).toEqual(2);
      expect(imperial.getTreasury("IT", log)).toEqual(9);
    });

    test("Claudia buys a 9 million FR bond", () => {
      const log = [
        {
          type: "bondPurchase",
          payload: { nation: "AH", player: "Claudia", cost: 2 },
        },
        {
          type: "bondPurchase",
          payload: { nation: "FR", player: "Claudia", cost: 9 },
        },
      ];
      expect(imperial.getCash("Claudia", log)).toEqual(0);
      expect(imperial.getTreasury("FR", log)).toEqual(9);
    });

    test("Daniel buys a 2 million FR bond", () => {
      const log = [
        {
          type: "bondPurchase",
          payload: { nation: "FR", player: "Claudia", cost: 9 },
        },
        {
          type: "bondPurchase",
          payload: { nation: "FR", player: "Daniel", cost: 2 },
        },
      ];
      expect(imperial.getCash("Daniel", log)).toEqual(9);
      expect(imperial.getTreasury("FR", log)).toEqual(11);
    });

    test("Anton buys a 2 million GB bond", () => {
      const log = [
        {
          type: "bondPurchase",
          payload: { nation: "IT", player: "Anton", cost: 9 },
        },
        {
          type: "bondPurchase",
          payload: { nation: "GB", player: "Anton", cost: 2 },
        },
      ];
      expect(imperial.getCash("Anton", log)).toEqual(0);
      expect(imperial.getTreasury("GB", log)).toEqual(2);
    });

    test("Bert buys a 9 million GB bond", () => {
      const log = [
        {
          type: "bondPurchase",
          payload: { nation: "GB", player: "Anton", cost: 2 },
        },
        {
          type: "bondPurchase",
          payload: { nation: "GB", player: "Bert", cost: 9 },
        },
      ];
      expect(imperial.getCash("Bert", log)).toEqual(2);
      expect(imperial.getTreasury("GB", log)).toEqual(11);
    });

    test("GE receives 0", () => {
      const log = [];
      expect(imperial.getTreasury("GE", log)).toEqual(0);
    });

    test("Bert buys a 2 million RU bond", () => {
      const log = [
        {
          type: "bondPurchase",
          payload: { nation: "GB", player: "Bert", cost: 9 },
        },
        {
          type: "bondPurchase",
          payload: { nation: "RU", player: "Bert", cost: 2 },
        },
      ];
      expect(imperial.getCash("Bert", log)).toEqual(0);
      expect(imperial.getTreasury("RU", log)).toEqual(2);
    });

    test("Daniel buys a 9 million RU bond", () => {
      const log = [
        {
          type: "bondPurchase",
          payload: { nation: "FR", player: "Daniel", cost: 2 },
        },
        {
          type: "bondPurchase",
          payload: { nation: "RU", player: "Bert", cost: 2 },
        },
        {
          type: "bondPurchase",
          payload: { nation: "RU", player: "Daniel", cost: 9 },
        },
      ];
      expect(imperial.getCash("Daniel", log)).toEqual(0);
      expect(imperial.getTreasury("RU", log)).toEqual(11);
    });
  });

  describe("AH imports at Trieste and Lemberg", () => {
    test("AH moved to the import slot", () => {
      const log = [
        ...setupLog,
        {
          type: "rondel",
          payload: { nation: "AH", cost: 0, slot: "import" },
        },
      ];
      const actions = imperial.getAvailableActions(log);
      const expected = [
        "vienna",
        "budapest",
        "prague",
        "lemberg",
        "trieste",
      ].map((province) => ({
        type: "import",
        payload: { province },
      }));
      expect(actions).toEqual(new Set(expected));
    });

    describe("consequences", () => {
      test("AH's treasury is empty and Trieste & Lemberg have units", () => {
        const log = [
          ...setupLog,
          { type: "import", payload: { province: "trieste" } },
          { type: "import", payload: { province: "lemberg" } },
        ];
        expect(imperial.getTreasury("AH", log)).toEqual(0);

        expect(imperial.unitCount("trieste")).toEqual(1);
        expect(imperial.unitCount("lemberg")).toEqual(1);
      });
    });
  });

  describe("IT invests", () => {
    test("IT moved to investor slot", () => {
      const log = [
        ...setupLog,
        {
          type: "rondel",
          payload: { nation: "IT", cost: 0, slot: "investor" },
        },
      ];
      const actions = imperial.getAvailableActions(log);
      const expected = rondelSlots.map((slot) => ({
        type: "rondel",
        payload: { nation: "FR", cost: 0, slot },
      }));
      expect(actions).toEqual(new Set(expected));
    });

    describe("consequences", () => {
      test("IT has 5 million left in the treasury", () => {
        const log = [
          ...setupLog,
          {
            type: "rondel",
            payload: { nation: "IT", cost: 0, slot: "investor" },
          },
        ];
        expect(imperial.getTreasury("IT", log)).toEqual(5);
      });

      test("IT's controller (Anton) has 4 million in cash", () => {
        const log = [
          ...setupLog,
          {
            type: "rondel",
            payload: { nation: "IT", cost: 0, slot: "investor" },
          },
        ];
        const controller = imperial.getController("IT", log);
        expect(imperial.getCash(controller, log)).toEqual(4);
      });
      test("Investor-card holder has 4 million in cash", () => {});
      describe("Investor-card holder buys the 2 bond of GE", () => {
        test("Investor-card holder has no cash", () => {});
        test("GE treasury has 6 million", () => {});
        test("Investor-card moves to next player", () => {});
      });
    });
  });
});

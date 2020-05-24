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

describe("Schnelleinsteig", () => {
  let log = [];

  describe("AH imports at Trieste and Lemberg", () => {
    test("AH moved to the import slot", () => {
      log.push({
        type: "rondel",
        payload: { nation: "AH", cost: 0, slot: "import" },
      });
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
      log.push(
        { type: "import", payload: { province: "trieste" } },
        { type: "import", payload: { province: "lemberg" } }
      );

      test("AH's treasury is empty", () => {
        const treasury = imperial.getTreasury("AH", log);
        expect(treasury).toEqual(0);
      });

      test("Trieste has a fleet and Lemberg has an army", () => {
        expect(imperial.unitCount("trieste")).toEqual(1);
        expect(imperial.unitCount("lemberg")).toEqual(1);
      });
    });
  });

  describe("IT invests", () => {
    test("IT moved to investor slot", () => {
      const log = [
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
        expect(imperial.getTreasury("IT", log)).toEqual(5);
      });
      test("IT's controller has 4 million in cash", () => {});
      test("Investor-card holder has 4 million in cash", () => {});
      describe("Investor-card holder buys the 2 bond of GE", () => {
        test("Investor-card holder has no cash", () => {});
        test("GE treasury has 6 million", () => {});
        test("Investor-card moves to next player", () => {});
      });
    });
  });
});

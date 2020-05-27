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

const setupLog = [
  {
    type: "playerSeating",
    payload: { order: ["Daniel", "Claudia", "Bert", "Anton"] },
  },
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
    test("All players receive 13 million", () => {
      const log = [
        {
          type: "playerSeating",
          payload: { order: ["Daniel", "Claudia", "Bert", "Anton"] },
        },
      ];
      ["Daniel", "Claudia", "Bert", "Anton"].forEach((player) => {
        const cash = Imperial.fromLog(log).state.players[player].cash;
        expect(cash).toEqual(13);
      });
    });
    test("Claudia buys a 2 million AH bond", () => {
      const log = [
        {
          type: "playerSeating",
          payload: { order: ["Daniel", "Claudia", "Bert", "Anton"] },
        },
        {
          type: "bondPurchase",
          payload: { nation: "AH", player: "Claudia", cost: 2 },
        },
      ];
      const cash = Imperial.fromLog(log).state.players["Claudia"].cash;
      const treasury = Imperial.fromLog(log).state.nations["AH"].treasury;
      expect(cash).toEqual(11);
      expect(treasury).toEqual(2);
    });

    test("Anton buys a 9 million IT bond", () => {
      const log = [
        {
          type: "playerSeating",
          payload: { order: ["Daniel", "Claudia", "Bert", "Anton"] },
        },
        {
          type: "bondPurchase",
          payload: { nation: "IT", player: "Anton", cost: 9 },
        },
      ];
      const cash = Imperial.fromLog(log).state.players["Anton"].cash;
      const treasury = Imperial.fromLog(log).state.nations["IT"].treasury;
      expect(cash).toEqual(4);
      expect(treasury).toEqual(9);
    });

    test("Claudia buys a 9 million FR bond", () => {
      const log = [
        {
          type: "playerSeating",
          payload: { order: ["Daniel", "Claudia", "Bert", "Anton"] },
        },
        {
          type: "bondPurchase",
          payload: { nation: "AH", player: "Claudia", cost: 2 },
        },
        {
          type: "bondPurchase",
          payload: { nation: "FR", player: "Claudia", cost: 9 },
        },
      ];
      const cash = Imperial.fromLog(log).state.players["Claudia"].cash;
      const treasury = Imperial.fromLog(log).state.nations["FR"].treasury;
      expect(cash).toEqual(2);
      expect(treasury).toEqual(9);
    });

    test("Daniel buys a 2 million FR bond", () => {
      const log = [
        {
          type: "playerSeating",
          payload: { order: ["Daniel", "Claudia", "Bert", "Anton"] },
        },
        {
          type: "bondPurchase",
          payload: { nation: "FR", player: "Claudia", cost: 9 },
        },
        {
          type: "bondPurchase",
          payload: { nation: "FR", player: "Daniel", cost: 2 },
        },
      ];
      const cash = Imperial.fromLog(log).state.players["Daniel"].cash;
      const treasury = Imperial.fromLog(log).state.nations["FR"].treasury;
      expect(cash).toEqual(11);
      expect(treasury).toEqual(11);
    });

    test("Anton buys a 2 million GB bond", () => {
      const log = [
        {
          type: "playerSeating",
          payload: { order: ["Daniel", "Claudia", "Bert", "Anton"] },
        },
        {
          type: "bondPurchase",
          payload: { nation: "IT", player: "Anton", cost: 9 },
        },
        {
          type: "bondPurchase",
          payload: { nation: "GB", player: "Anton", cost: 2 },
        },
      ];
      const cash = Imperial.fromLog(log).state.players["Anton"].cash;
      const treasury = Imperial.fromLog(log).state.nations["GB"].treasury;
      expect(cash).toEqual(2);
      expect(treasury).toEqual(2);
    });

    test("Bert buys a 9 million GB bond", () => {
      const log = [
        {
          type: "playerSeating",
          payload: { order: ["Daniel", "Claudia", "Bert", "Anton"] },
        },
        {
          type: "bondPurchase",
          payload: { nation: "GB", player: "Anton", cost: 2 },
        },
        {
          type: "bondPurchase",
          payload: { nation: "GB", player: "Bert", cost: 9 },
        },
      ];
      const cash = Imperial.fromLog(log).state.players["Bert"].cash;
      const treasury = Imperial.fromLog(log).state.nations["GB"].treasury;
      expect(cash).toEqual(4);
      expect(treasury).toEqual(11);
    });

    test("GE receives 0", () => {
      const log = [
        {
          type: "playerSeating",
          payload: { order: ["Daniel", "Claudia", "Bert", "Anton"] },
        },
      ];
      const treasury = Imperial.fromLog(log).state.nations["GE"].treasury;
      expect(treasury).toEqual(0);
    });

    test("Bert buys a 2 million RU bond", () => {
      const log = [
        {
          type: "playerSeating",
          payload: { order: ["Daniel", "Claudia", "Bert", "Anton"] },
        },
        {
          type: "bondPurchase",
          payload: { nation: "GB", player: "Bert", cost: 9 },
        },
        {
          type: "bondPurchase",
          payload: { nation: "RU", player: "Bert", cost: 2 },
        },
      ];
      const cash = Imperial.fromLog(log).state.players["Bert"].cash;
      const treasury = Imperial.fromLog(log).state.nations["RU"].treasury;
      expect(cash).toEqual(2);
      expect(treasury).toEqual(2);
    });

    test("Daniel buys a 9 million RU bond", () => {
      const log = [
        {
          type: "playerSeating",
          payload: { order: ["Daniel", "Claudia", "Bert", "Anton"] },
        },
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
      const cash = Imperial.fromLog(log).state.players["Daniel"].cash;
      const treasury = Imperial.fromLog(log).state.nations["RU"].treasury;
      expect(cash).toEqual(2);
      expect(treasury).toEqual(11);
    });
  });

  describe("first round", () => {
    describe("1. AH imports", () => {
      test("AH moved to the import slot", () => {
        const log = [
          ...setupLog,
          {
            type: "rondel",
            payload: { nation: "AH", cost: 0, slot: "import" },
          },
        ];
        const actions = Imperial.fromLog(log).state.availableActions;
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
          const treasury = Imperial.fromLog(log).state.nations["AH"].treasury;
          const triesteUnitCount = Imperial.fromLog(log).state.provinces[
            "trieste"
          ].unitCount;
          const lembergUnitCount = Imperial.fromLog(log).state.provinces[
            "lemberg"
          ].unitCount;
          expect(treasury).toEqual(0);
          expect(triesteUnitCount).toEqual(1);
          expect(lembergUnitCount).toEqual(1);
        });
      });
    });

    describe("2. IT invests", () => {
      test("IT moved to investor slot", () => {
        const log = [
          ...setupLog,
          {
            type: "rondel",
            payload: { nation: "IT", cost: 0, slot: "investor" },
          },
        ];
        const actions = Imperial.fromLog(log).state.availableActions;
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
          const treasury = Imperial.fromLog(log).state.nations["IT"].treasury;
          expect(treasury).toEqual(5);
        });

        test("IT's controller (Anton) has 6 million in cash", () => {
          const log = [
            ...setupLog,
            {
              type: "rondel",
              payload: { nation: "IT", cost: 0, slot: "investor" },
            },
          ];
          const controller = Imperial.fromLog(log).state.nations["IT"]
            .controller;
          const cash = Imperial.fromLog(log).state.players[controller].cash;
          expect(cash).toEqual(6);
        });

        test("Investor-card holder has 4 million in cash", () => {
          const log = [
            ...setupLog,
            {
              type: "rondel",
              payload: { nation: "IT", cost: 0, slot: "investor" },
            },
          ];
          const investorCardHolder = Imperial.fromLog(log).state
            .investorCardHolder;
          const cash = Imperial.fromLog(log).state.players[investorCardHolder]
            .cash;
          expect(cash).toEqual(4);
        });

        describe("Investor-card holder (Daniel) buys the 4 million bond of GE", () => {
          test("Investor-card holder has no cash", () => {
            const log = [
              ...setupLog,
              {
                type: "rondel",
                payload: { nation: "IT", cost: 0, slot: "investor" },
              },
              {
                type: "bondPurchase",
                payload: { nation: "GE", player: "Daniel", cost: 4 },
              },
            ];
            const cash = Imperial.fromLog(log).state.players["Daniel"].cash;
            expect(cash).toEqual(0);
          });
          test("GE treasury has 4 million", () => {
            const log = [
              ...setupLog,
              {
                type: "rondel",
                payload: { nation: "IT", cost: 0, slot: "investor" },
              },
              {
                type: "bondPurchase",
                payload: { nation: "GE", player: "Daniel", cost: 4 },
              },
            ];
            const treasury = Imperial.fromLog(log).state.nations["GE"].treasury;
            expect(treasury).toEqual(4);
          });
        });
      });
    });

    describe("3. FR builds a factory", () => {
      test("Marseille has a factory", () => {
        const log = [
          ...setupLog,
          {
            type: "buildFactory",
            payload: { province: "marseille" },
          },
        ];
        const hasFactory = Imperial.fromLog(log).state.provinces["marseille"]
          .hasFactory;
        expect(hasFactory).toEqual(true);
      });

      test("FR has 6 million in its treasury", () => {
        const log = [
          ...setupLog,
          {
            type: "buildFactory",
            payload: { province: "marseille" },
          },
        ];
        const treasury = Imperial.fromLog(log).state.nations["FR"].treasury;
        expect(treasury).toEqual(6);
      });

      test("Paris has a factory", () => {
        const log = [...setupLog];
        const hasFactory = Imperial.fromLog(log).state.provinces["paris"]
          .hasFactory;
        expect(hasFactory).toEqual(true);
      });

      test("Bordeaux has a factory", () => {
        const log = [...setupLog];
        const hasFactory = Imperial.fromLog(log).state.provinces["bordeaux"]
          .hasFactory;
        expect(hasFactory).toEqual(true);
      });
    });

    describe("4. GB does production1", () => {
      test("London and Liverpool have units", () => {
        const log = [
          ...setupLog,
          {
            type: "production",
            payload: { province: "london" },
          },
          {
            type: "production",
            payload: { province: "liverpool" },
          },
        ];
        const londonUnitCount = Imperial.fromLog(log).state.provinces["london"]
          .unitCount;
        const liverpoolUnitCount = Imperial.fromLog(log).state.provinces[
          "liverpool"
        ].unitCount;
        expect(londonUnitCount).toEqual(1);
        expect(liverpoolUnitCount).toEqual(1);
      });
    });

    describe("5. GE does production2", () => {
      test("Berlin and Hamburg have units", () => {
        const log = [
          ...setupLog,
          {
            type: "production",
            payload: { province: "berlin" },
          },
          {
            type: "production",
            payload: { province: "hamburg" },
          },
        ];
        const berlinUnitCount = Imperial.fromLog(log).state.provinces["berlin"]
          .unitCount;
        const hamburgUnitCount = Imperial.fromLog(log).state.provinces[
          "hamburg"
        ].unitCount;
        expect(berlinUnitCount).toEqual(1);
        expect(hamburgUnitCount).toEqual(1);
      });
    });

    describe("6. RU invests", () => {
      test("RU moved to investor slot", () => {
        const log = [
          ...setupLog,
          {
            type: "rondel",
            payload: { nation: "RU", cost: 0, slot: "investor" },
          },
        ];
        const actions = Imperial.fromLog(log).state.availableActions;
        const expected = rondelSlots.map((slot) => ({
          type: "rondel",
          payload: { nation: "AH", cost: 0, slot },
        }));
        expect(actions).toEqual(new Set(expected));
      });

      describe("consequences", () => {
        test("Anton has the investor card now", () => {
          const log = [
            ...setupLog,
            {
              type: "rondel",
              payload: { nation: "IT", cost: 0, slot: "investor" },
            },
            {
              type: "bondPurchase",
              payload: { nation: "GE", player: "Daniel", cost: 4 },
            },
            {
              type: "rondel",
              payload: { nation: "RU", cost: 0, slot: "investor" },
            },
          ];
          const investorCardHolder = Imperial.fromLog(log).state
            .investorCardHolder;
          expect(investorCardHolder).toEqual("Anton");
        });
        test("RU has 6 million left in the treasury", () => {
          const log = [
            ...setupLog,
            {
              type: "rondel",
              payload: { nation: "RU", cost: 0, slot: "investor" },
            },
          ];
          const treasury = Imperial.fromLog(log).state.nations["RU"].treasury;
          expect(treasury).toEqual(6);
        });

        test("Daniel has 4 million in cash", () => {
          const log = [
            ...setupLog,
            {
              type: "rondel",
              payload: { nation: "IT", cost: 0, slot: "investor" },
            },
            {
              type: "bondPurchase",
              payload: { nation: "GE", player: "Daniel", cost: 4 },
            },
            {
              type: "rondel",
              payload: { nation: "RU", cost: 0, slot: "investor" },
            },
          ];
          const cash = Imperial.fromLog(log).state.players["Daniel"].cash;
          expect(cash).toEqual(4);
        });

        xtest("Bert has 1 million in cash", () => {
          const log = [
            ...setupLog,
            {
              type: "rondel",
              payload: { nation: "IT", cost: 0, slot: "investor" },
            },
            {
              type: "bondPurchase",
              payload: { nation: "GE", player: "Daniel", cost: 4 },
            },
            {
              type: "rondel",
              payload: { nation: "RU", cost: 0, slot: "investor" },
            },
          ];
          const cash = Imperial.fromLog(log).state.players["Bert"].cash;
          expect(cash).toEqual(1);
        });

        xtest("IT's controller (Anton) has 4 million in cash", () => {
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

        xtest("Investor-card holder has 4 million in cash", () => {
          const log = [
            ...setupLog,
            {
              type: "rondel",
              payload: { nation: "IT", cost: 0, slot: "investor" },
            },
          ];
          const investorCardHolder = imperial.getInvestorCardHolder(log);
          expect(imperial.getCash(investorCardHolder, log)).toEqual(4);
        });

        xdescribe("Investor-card holder buys the 4 million bond of GE", () => {
          test("Investor-card holder has no cash", () => {
            const log = [
              ...setupLog,
              {
                type: "rondel",
                payload: { nation: "IT", cost: 0, slot: "investor" },
              },
              {
                type: "bondPurchase",
                payload: { nation: "GE", player: "Daniel", cost: 4 },
              },
            ];
            expect(imperial.getCash("Daniel", log)).toEqual(0);
          });
          test("GE treasury has 4 million", () => {
            const log = [
              ...setupLog,
              {
                type: "rondel",
                payload: { nation: "IT", cost: 0, slot: "investor" },
              },
              {
                type: "bondPurchase",
                payload: { nation: "GE", player: "Daniel", cost: 4 },
              },
            ];
            expect(imperial.getTreasury("GE", log)).toEqual(4);
          });
          test("Investor-card moves to next player", () => {
            const log = [
              ...setupLog,
              {
                type: "rondel",
                payload: { nation: "IT", cost: 0, slot: "investor" },
              },
            ];
            expect(imperial.getInvestorCardHolder(log)).toEqual("Anton");
          });
        });
      });
    });
  });
});

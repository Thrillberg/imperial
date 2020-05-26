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
    test("All players receive 11 million", () => {
      const log = [
        {
          type: "playerSeating",
          payload: { order: ["Daniel", "Claudia", "Bert", "Anton"] },
        },
      ];
      ["Daniel", "Claudia", "Bert", "Anton"].forEach((player) => {
        expect(imperial.getCash(player, log)).toEqual(11);
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
      expect(imperial.getCash("Claudia", log)).toEqual(9);
      expect(imperial.getTreasury("AH", log)).toEqual(2);
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
      expect(imperial.getCash("Anton", log)).toEqual(2);
      expect(imperial.getTreasury("IT", log)).toEqual(9);
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
      expect(imperial.getCash("Claudia", log)).toEqual(0);
      expect(imperial.getTreasury("FR", log)).toEqual(9);
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
      expect(imperial.getCash("Daniel", log)).toEqual(9);
      expect(imperial.getTreasury("FR", log)).toEqual(11);
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
      expect(imperial.getCash("Anton", log)).toEqual(0);
      expect(imperial.getTreasury("GB", log)).toEqual(2);
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
      expect(imperial.getCash("Bert", log)).toEqual(0);
      expect(imperial.getTreasury("RU", log)).toEqual(2);
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
      expect(imperial.getCash("Daniel", log)).toEqual(0);
      expect(imperial.getTreasury("RU", log)).toEqual(11);
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

    describe("2. IT invests", () => {
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

        test("Investor-card holder has 4 million in cash", () => {
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

    describe("3. FR builds a factory", () => {
      test("Marseille has a factory", () => {
        const log = [
          ...setupLog,
          {
            type: "buildFactory",
            payload: { province: "marseille" },
          },
        ];
        expect(imperial.hasFactory("marseille", log)).toEqual(true);
      });

      test("FR has 6 million in its treasury", () => {
        const log = [
          ...setupLog,
          {
            type: "buildFactory",
            payload: { province: "marseille" },
          },
        ];
        expect(imperial.getTreasury("FR", log)).toEqual(6);
      });

      test("Paris has a factory", () => {
        const log = [...setupLog];
        expect(imperial.hasFactory("paris", log));
      });

      test("Bordeaux has a factory", () => {
        const log = [...setupLog];
        expect(imperial.hasFactory("bordeaux", log));
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
        expect(imperial.unitCount("london")).toEqual(1);
        expect(imperial.unitCount("liverpool")).toEqual(1);
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
        expect(imperial.unitCount("berlin")).toEqual(1);
        expect(imperial.unitCount("hamburg")).toEqual(1);
      });
    });

    xdescribe("6. RU invests", () => {
      test("RU moved to investor slot", () => {
        const log = [
          ...setupLog,
          {
            type: "rondel",
            payload: { nation: "RU", cost: 0, slot: "investor" },
          },
        ];
        const actions = imperial.getAvailableActions(log);
        const expected = rondelSlots.map((slot) => ({
          type: "rondel",
          payload: { nation: "AH", cost: 0, slot },
        }));
        expect(actions).toEqual(new Set(expected));
      });

      describe("consequences", () => {
        test("RU has 6 million left in the treasury", () => {
          const log = [
            ...setupLog,
            {
              type: "rondel",
              payload: { nation: "RU", cost: 0, slot: "investor" },
            },
          ];
          expect(imperial.getTreasury("RU", log)).toEqual(6);
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
          expect(imperial.getCash("Daniel", log)).toEqual(4);
        });

        test("Bert has 1 million in cash", () => {});

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

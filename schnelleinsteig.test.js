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

const firstRoundLog = [
  ...setupLog,
  {
    type: "rondel",
    payload: { nation: "AH", cost: 0, slot: "import" },
  },
  { type: "import", payload: { province: "trieste" } },
  { type: "import", payload: { province: "lemberg" } },
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
    payload: { nation: "FR", cost: 0, slot: "factory" },
  },
  {
    type: "buildFactory",
    payload: { province: "marseille" },
  },
  {
    type: "rondel",
    payload: { nation: "GB", cost: 0, slot: "production1" },
  },
  {
    type: "production",
    payload: { province: "london" },
  },
  {
    type: "production",
    payload: { province: "liverpool" },
  },
  {
    type: "rondel",
    payload: { nation: "GE", cost: 0, slot: "production2" },
  },
  {
    type: "production",
    payload: { province: "berlin" },
  },
  {
    type: "production",
    payload: { province: "hamburg" },
  },
  {
    type: "rondel",
    payload: { nation: "RU", cost: 0, slot: "investor" },
  },
  {
    type: "bondPurchase",
    payload: { nation: "GE", player: "Anton", cost: 6 },
  },
];

const secondRoundLog = [
  ...firstRoundLog,
  {
    type: "rondel",
    payload: { nation: "AH", cost: 0, slot: "production2" },
  },
  {
    type: "rondel",
    payload: { nation: "IT", cost: 0, slot: "production2" },
  },
  {
    type: "rondel",
    payload: { nation: "FR", cost: 0, slot: "production1" },
  },
  {
    type: "rondel",
    payload: { nation: "GB", cost: 0, slot: "maneuver1" },
  },
  {
    type: "maneuver",
    payload: { origin: "liverpool", destination: "north atlantic" },
  },
  {
    type: "maneuver",
    payload: { origin: "london", destination: "english channel" },
  },
  {
    type: "rondel",
    payload: { nation: "GE", cost: 0, slot: "maneuver2" },
  },
  {
    type: "maneuver",
    payload: { origin: "hamburg", destination: "north sea" },
  },
  {
    type: "maneuver",
    payload: { origin: "berlin", destination: "norway" },
  },
  {
    type: "rondel",
    payload: { nation: "RU", cost: 0, slot: "import" },
  },
  { type: "import", payload: { province: "st. petersburg" } },
  { type: "import", payload: { province: "moscow" } },
  { type: "import", payload: { province: "moscow" } },
];

const thirdRoundLog = [
  ...secondRoundLog,
  {
    type: "rondel",
    payload: { nation: "AH", cost: 0, slot: "maneuver2" },
  },
  {
    type: "maneuver",
    payload: { origin: "trieste", destination: "ionian sea" },
  },
  {
    type: "maneuver",
    payload: { origin: "lemberg", destination: "romania" },
  },
  {
    type: "maneuver",
    payload: { origin: "budapest", destination: "west balkan" },
  },
  {
    type: "maneuver",
    payload: { origin: "vienna", destination: "tunis" },
  },
  {
    type: "rondel",
    payload: { nation: "IT", cost: 0, slot: "maneuver2" },
  },
  {
    type: "maneuver",
    payload: {
      origin: "naples",
      destination: "western mediterranean sea",
    },
  },
  {
    type: "maneuver",
    payload: { origin: "rome", destination: "spain" },
  },
  {
    type: "rondel",
    payload: { nation: "FR", cost: 0, slot: "maneuver1" },
  },
  {
    type: "maneuver",
    payload: {
      origin: "marseille",
      destination: "western mediterranean sea",
    },
  },
  {
    type: "maneuver",
    payload: {
      origin: "bordeaux",
      destination: "bay of biscay",
    },
  },
  {
    type: "maneuver",
    payload: {
      origin: "paris",
      destination: "morocco",
    },
  },
  {
    type: "rondel",
    payload: { nation: "GB", cost: 0, slot: "investor" },
  },
  {
    type: "bondPurchase",
    payload: { nation: "RU", player: "Bert", cost: 6 },
  },
  {
    type: "rondel",
    payload: { nation: "GE", cost: 0, slot: "taxation" },
  },
  {
    type: "rondel",
    payload: { nation: "RU", cost: 0, slot: "production2" },
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
            type: "rondel",
            payload: { nation: "FR", cost: 0, slot: "factory" },
          },
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
            type: "rondel",
            payload: { nation: "GB", cost: 0, slot: "production1" },
          },
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
            payload: { province: "london" },
          },
          {
            type: "production",
            payload: { province: "liverpool" },
          },
          {
            type: "rondel",
            payload: { nation: "GE", cost: 0, slot: "production2" },
          },
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

        test("Bert has 3 million in cash", () => {
          const log = [
            ...setupLog,
            {
              type: "rondel",
              payload: { nation: "IT", cost: 0, slot: "investor" },
            },
            {
              type: "rondel",
              payload: { nation: "RU", cost: 0, slot: "investor" },
            },
          ];
          const cash = Imperial.fromLog(log).state.players["Bert"].cash;
          expect(cash).toEqual(3);
        });

        test("IT's controller (Anton) has 8 million in cash", () => {
          const log = [
            ...setupLog,
            {
              type: "rondel",
              payload: { nation: "IT", cost: 0, slot: "investor" },
            },
            {
              type: "rondel",
              payload: { nation: "RU", cost: 0, slot: "investor" },
            },
          ];
          const cash = Imperial.fromLog(log).state.players["Anton"].cash;
          expect(cash).toEqual(8);
        });

        test("Investor-card holder has 8 million in cash", () => {
          const log = [
            ...setupLog,
            {
              type: "rondel",
              payload: { nation: "IT", cost: 0, slot: "investor" },
            },
            {
              type: "rondel",
              payload: { nation: "RU", cost: 0, slot: "investor" },
            },
          ];
          const investorCardHolder = Imperial.fromLog(log).state
            .investorCardHolder;
          const cash = Imperial.fromLog(log).state.players[investorCardHolder]
            .cash;
          expect(cash).toEqual(8);
        });

        describe("Investor-card holder (Anton) buys the 6 million bond of GE", () => {
          test("Investor-card holder (Anton) 2 million in cash", () => {
            const log = [
              ...setupLog,
              {
                type: "rondel",
                payload: { nation: "IT", cost: 0, slot: "investor" },
              },
              {
                type: "rondel",
                payload: { nation: "RU", cost: 0, slot: "investor" },
              },
              {
                type: "bondPurchase",
                payload: { nation: "GE", player: "Anton", cost: 6 },
              },
            ];
            const cash = Imperial.fromLog(log).state.players["Anton"].cash;
            expect(cash).toEqual(2);
          });
          test("GE treasury has 10 million", () => {
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
              {
                type: "bondPurchase",
                payload: { nation: "GE", player: "Anton", cost: 6 },
              },
            ];
            const treasury = Imperial.fromLog(log).state.nations["GE"].treasury;
            expect(treasury).toEqual(10);
          });

          test("Anton controls GE", () => {
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
              {
                type: "bondPurchase",
                payload: { nation: "GE", player: "Anton", cost: 6 },
              },
            ];
            const controller = Imperial.fromLog(log).state.nations["GE"]
              .controller;
            expect(controller).toEqual("Anton");
          });
        });
      });
    });
  });

  describe("second round", () => {
    describe("1. AH does production2", () => {
      test("vienna and budapest have 1 unit each", () => {
        const log = [
          ...firstRoundLog,
          {
            type: "rondel",
            payload: { nation: "AH", cost: 0, slot: "production2" },
          },
        ];
        const viennaUnitCount = Imperial.fromLog(log).state.provinces["vienna"]
          .unitCount;
        const budapestUnitCount = Imperial.fromLog(log).state.provinces[
          "budapest"
        ].unitCount;
        expect(viennaUnitCount).toEqual(1);
        expect(budapestUnitCount).toEqual(1);
      });

      test("AH treasury remains empty", () => {
        const log = [
          ...firstRoundLog,
          {
            type: "rondel",
            payload: { nation: "AH", cost: 0, slot: "production2" },
          },
        ];
        const AHTreasury = Imperial.fromLog(log).state.nations["AH"].treasury;
        expect(AHTreasury).toEqual(0);
      });
    });

    describe("2. IT does production2", () => {
      test("rome and naples have 1 unit each", () => {
        const log = [
          ...firstRoundLog,
          {
            type: "rondel",
            payload: { nation: "AH", cost: 0, slot: "production2" },
          },
          {
            type: "rondel",
            payload: { nation: "IT", cost: 0, slot: "production2" },
          },
        ];
        const romeUnitCount = Imperial.fromLog(log).state.provinces["rome"]
          .unitCount;
        const naplesUnitCount = Imperial.fromLog(log).state.provinces["naples"]
          .unitCount;
        expect(romeUnitCount).toEqual(1);
        expect(naplesUnitCount).toEqual(1);
      });
    });

    describe("3. FR does production1", () => {
      test("bordeaux, marseille, and paris have 1 unit each", () => {
        const log = [
          ...firstRoundLog,
          {
            type: "rondel",
            payload: { nation: "AH", cost: 0, slot: "production2" },
          },
          {
            type: "rondel",
            payload: { nation: "IT", cost: 0, slot: "production2" },
          },
          {
            type: "rondel",
            payload: { nation: "FR", cost: 0, slot: "production1" },
          },
        ];
        const bordeauxUnitCount = Imperial.fromLog(log).state.provinces[
          "bordeaux"
        ].unitCount;
        const marseilleUnitCount = Imperial.fromLog(log).state.provinces[
          "marseille"
        ].unitCount;
        const parisUnitCount = Imperial.fromLog(log).state.provinces["paris"]
          .unitCount;
        expect(bordeauxUnitCount).toEqual(1);
        expect(marseilleUnitCount).toEqual(1);
        expect(parisUnitCount).toEqual(1);
      });
    });

    describe("4. GB does maneuver1", () => {
      test("GB's available actions are to move liverpool and london units", () => {
        const log = [
          ...firstRoundLog,
          {
            type: "rondel",
            payload: { nation: "AH", cost: 0, slot: "production2" },
          },
          {
            type: "rondel",
            payload: { nation: "IT", cost: 0, slot: "production2" },
          },
          {
            type: "rondel",
            payload: { nation: "FR", cost: 0, slot: "production1" },
          },
          {
            type: "rondel",
            payload: { nation: "GB", cost: 0, slot: "maneuver1" },
          },
        ];
        const availableActions = [
          {
            type: "maneuver",
            payload: { origin: "liverpool", destination: "north atlantic" },
          },
          {
            type: "maneuver",
            payload: { origin: "london", destination: "english channel" },
          },
        ];
        expect(Imperial.fromLog(log).state.availableActions).toEqual(
          availableActions
        );
      });

      test("north atlantic and english channel have GB flags", () => {
        const log = [
          ...firstRoundLog,
          {
            type: "rondel",
            payload: { nation: "AH", cost: 0, slot: "production2" },
          },
          {
            type: "rondel",
            payload: { nation: "IT", cost: 0, slot: "production2" },
          },
          {
            type: "rondel",
            payload: { nation: "FR", cost: 0, slot: "production1" },
          },
          {
            type: "rondel",
            payload: { nation: "GB", cost: 0, slot: "maneuver1" },
          },
          {
            type: "maneuver",
            payload: { origin: "liverpool", destination: "north atlantic" },
          },
          {
            type: "maneuver",
            payload: { origin: "london", destination: "english channel" },
          },
        ];
        const northAtlanticFlag = Imperial.fromLog(log).state.provinces[
          "north atlantic"
        ].flag;
        const englishChannelFlag = Imperial.fromLog(log).state.provinces[
          "english channel"
        ].flag;
        expect(northAtlanticFlag).toEqual("GB");
        expect(englishChannelFlag).toEqual("GB");
      });
    });

    describe("5. GE does maneuver2", () => {
      test("GE's available actions are to move hamburg and berlin units", () => {
        const log = [
          ...firstRoundLog,
          {
            type: "rondel",
            payload: { nation: "AH", cost: 0, slot: "production2" },
          },
          {
            type: "rondel",
            payload: { nation: "IT", cost: 0, slot: "production2" },
          },
          {
            type: "rondel",
            payload: { nation: "FR", cost: 0, slot: "production1" },
          },
          {
            type: "rondel",
            payload: { nation: "GB", cost: 0, slot: "maneuver1" },
          },
          {
            type: "maneuver",
            payload: { origin: "liverpool", destination: "north atlantic" },
          },
          {
            type: "maneuver",
            payload: { origin: "london", destination: "english channel" },
          },
          {
            type: "rondel",
            payload: { nation: "GE", cost: 0, slot: "maneuver2" },
          },
        ];
        const availableActions = [
          {
            type: "maneuver",
            payload: { origin: "hamburg", destination: "north sea" },
          },
          {
            type: "maneuver",
            payload: { origin: "berlin", destination: "danzig" },
          },
          {
            type: "maneuver",
            payload: { origin: "berlin", destination: "prague" },
          },
          {
            type: "maneuver",
            payload: { origin: "berlin", destination: "munich" },
          },
          {
            type: "maneuver",
            payload: { origin: "berlin", destination: "cologne" },
          },
          {
            type: "maneuver",
            payload: { origin: "berlin", destination: "hamburg" },
          },
          {
            type: "maneuver",
            payload: { origin: "berlin", destination: "dijon" },
          },
          {
            type: "maneuver",
            payload: { origin: "berlin", destination: "belgium" },
          },
          {
            type: "maneuver",
            payload: { origin: "berlin", destination: "holland" },
          },
          {
            type: "maneuver",
            payload: { origin: "berlin", destination: "denmark" },
          },
          {
            type: "maneuver",
            payload: { origin: "berlin", destination: "london" },
          },
          {
            type: "maneuver",
            payload: { origin: "berlin", destination: "sheffield" },
          },
          {
            type: "maneuver",
            payload: { origin: "berlin", destination: "edinburgh" },
          },
          {
            type: "maneuver",
            payload: { origin: "berlin", destination: "norway" },
          },
        ];
        expect(Imperial.fromLog(log).state.availableActions).toEqual(
          availableActions
        );
      });

      test("north sea and norway have GE flags", () => {
        const log = [
          ...firstRoundLog,
          {
            type: "rondel",
            payload: { nation: "AH", cost: 0, slot: "production2" },
          },
          {
            type: "rondel",
            payload: { nation: "IT", cost: 0, slot: "production2" },
          },
          {
            type: "rondel",
            payload: { nation: "FR", cost: 0, slot: "production1" },
          },
          {
            type: "rondel",
            payload: { nation: "GB", cost: 0, slot: "maneuver1" },
          },
          {
            type: "maneuver",
            payload: { origin: "liverpool", destination: "north atlantic" },
          },
          {
            type: "maneuver",
            payload: { origin: "london", destination: "english channel" },
          },
          {
            type: "rondel",
            payload: { nation: "GE", cost: 0, slot: "maneuver2" },
          },
          {
            type: "maneuver",
            payload: { origin: "hamburg", destination: "north sea" },
          },
          {
            type: "maneuver",
            payload: { origin: "berlin", destination: "norway" },
          },
        ];
        const northSeaFlag = Imperial.fromLog(log).state.provinces["north sea"]
          .flag;
        const norwayFlag = Imperial.fromLog(log).state.provinces["norway"].flag;
        expect(northSeaFlag).toEqual("GE");
        expect(norwayFlag).toEqual("GE");
      });
    });

    describe("6. Russia imports", () => {
      test("RU moves to the import slot", () => {
        const log = [
          ...firstRoundLog,
          {
            type: "rondel",
            payload: { nation: "AH", cost: 0, slot: "production2" },
          },
          {
            type: "rondel",
            payload: { nation: "IT", cost: 0, slot: "production2" },
          },
          {
            type: "rondel",
            payload: { nation: "FR", cost: 0, slot: "production1" },
          },
          {
            type: "rondel",
            payload: { nation: "GB", cost: 0, slot: "maneuver1" },
          },
          {
            type: "maneuver",
            payload: { origin: "liverpool", destination: "north atlantic" },
          },
          {
            type: "maneuver",
            payload: { origin: "london", destination: "english channel" },
          },
          {
            type: "rondel",
            payload: { nation: "GE", cost: 0, slot: "maneuver2" },
          },
          {
            type: "maneuver",
            payload: { origin: "hamburg", destination: "north sea" },
          },
          {
            type: "maneuver",
            payload: { origin: "berlin", destination: "norway" },
          },
          {
            type: "rondel",
            payload: { nation: "RU", cost: 0, slot: "import" },
          },
        ];
        const actions = Imperial.fromLog(log).state.availableActions;
        const expected = [
          "moscow",
          "st. petersburg",
          "odessa",
          "kiev",
          "warsaw",
        ].map((province) => ({
          type: "import",
          payload: { province },
        }));
        expect(actions).toEqual(new Set(expected));
      });

      describe("consequences", () => {
        test("RU has 1 unit in st. petersburg and 2 units in moscow", () => {
          const log = [
            ...firstRoundLog,
            {
              type: "rondel",
              payload: { nation: "AH", cost: 0, slot: "production2" },
            },
            {
              type: "rondel",
              payload: { nation: "IT", cost: 0, slot: "production2" },
            },
            {
              type: "rondel",
              payload: { nation: "FR", cost: 0, slot: "production1" },
            },
            {
              type: "rondel",
              payload: { nation: "GB", cost: 0, slot: "maneuver1" },
            },
            {
              type: "maneuver",
              payload: { origin: "liverpool", destination: "north atlantic" },
            },
            {
              type: "maneuver",
              payload: { origin: "london", destination: "english channel" },
            },
            {
              type: "rondel",
              payload: { nation: "GE", cost: 0, slot: "maneuver2" },
            },
            {
              type: "maneuver",
              payload: { origin: "hamburg", destination: "north sea" },
            },
            {
              type: "maneuver",
              payload: { origin: "berlin", destination: "norway" },
            },
            {
              type: "rondel",
              payload: { nation: "RU", cost: 0, slot: "import" },
            },
            { type: "import", payload: { province: "st. petersburg" } },
            { type: "import", payload: { province: "moscow" } },
            { type: "import", payload: { province: "moscow" } },
          ];
          const stPetersburgUnits = Imperial.fromLog(log).state.provinces[
            "st. petersburg"
          ].unitCount;
          const moscowUnits = Imperial.fromLog(log).state.provinces["moscow"]
            .unitCount;
          expect(stPetersburgUnits).toEqual(1);
          expect(moscowUnits).toEqual(2);
        });

        test("RU has 3 million in treasury", () => {
          const log = [
            ...firstRoundLog,
            {
              type: "rondel",
              payload: { nation: "RU", cost: 0, slot: "import" },
            },
            { type: "import", payload: { province: "st. petersburg" } },
            { type: "import", payload: { province: "moscow" } },
            { type: "import", payload: { province: "moscow" } },
          ];
          const treasury = Imperial.fromLog(log).state.nations["RU"].treasury;
          expect(treasury).toEqual(3);
        });
      });
    });
  });

  describe("third round", () => {
    describe("1. AH does maneuver2", () => {
      test("AH's available actions are to move trieste, lemberg, budapest, and vienna", () => {
        const log = [
          ...secondRoundLog,
          {
            type: "rondel",
            payload: { nation: "AH", cost: 0, slot: "maneuver2" },
          },
        ];
        const landDestinations = [
          "warsaw",
          "kiev",
          "budapest",
          "prague",
          "romania",
          "danzig",
          "munich",
          "genoa",
          "venice",
          "berlin",
          "vienna",
          "trieste",
          "west balkan",
          "rome",
          "naples",
          "greece",
          "tunis",
        ];
        let lembergActions = [];
        let budapestActions = [];
        let viennaActions = [];
        landDestinations.map((province) => {
          lembergActions.push({
            type: "maneuver",
            payload: { origin: "trieste", destination: province },
          });
          budapestActions.push({
            type: "maneuver",
            payload: { origin: "budapest", destination: province },
          });
          viennaActions.push({
            type: "maneuver",
            payload: { origin: "vienna", destination: province },
          });
        });

        const availableActions = [
          {
            type: "maneuver",
            payload: { origin: "trieste", destination: "ionian sea" },
          },
          ...lembergActions,
          ...budapestActions,
          ...viennaActions,
        ];
        expect(Imperial.fromLog(log).state.availableActions).toEqual(
          availableActions
        );
      });

      test("ionian sea, romania, west balkan, and tunis have AH flags", () => {
        const log = [
          ...secondRoundLog,
          {
            type: "rondel",
            payload: { nation: "AH", cost: 0, slot: "maneuver2" },
          },
          {
            type: "maneuver",
            payload: { origin: "trieste", destination: "ionian sea" },
          },
          {
            type: "maneuver",
            payload: { origin: "lemberg", destination: "romania" },
          },
          {
            type: "maneuver",
            payload: { origin: "budapest", destination: "west balkan" },
          },
          {
            type: "maneuver",
            payload: { origin: "vienna", destination: "tunis" },
          },
        ];
        const ionianSeaFlag = Imperial.fromLog(log).state.provinces[
          "ionian sea"
        ].flag;
        const romaniaFlag = Imperial.fromLog(log).state.provinces["romania"]
          .flag;
        const westBalkanFlag = Imperial.fromLog(log).state.provinces[
          "west balkan"
        ].flag;
        const tunisFlag = Imperial.fromLog(log).state.provinces["tunis"].flag;

        expect(ionianSeaFlag).toEqual("AH");
        expect(romaniaFlag).toEqual("AH");
        expect(westBalkanFlag).toEqual("AH");
        expect(tunisFlag).toEqual("AH");
      });
    });

    describe("2. IT does maneuver2", () => {
      test("IT's available actions are to move naples and rome", () => {
        const log = [
          ...secondRoundLog,
          {
            type: "rondel",
            payload: { nation: "AH", cost: 0, slot: "maneuver2" },
          },
          {
            type: "maneuver",
            payload: { origin: "trieste", destination: "ionian sea" },
          },
          {
            type: "maneuver",
            payload: { origin: "lemberg", destination: "romania" },
          },
          {
            type: "maneuver",
            payload: { origin: "budapest", destination: "west balkan" },
          },
          {
            type: "maneuver",
            payload: { origin: "vienna", destination: "tunis" },
          },
          {
            type: "rondel",
            payload: { nation: "IT", cost: 0, slot: "maneuver2" },
          },
        ];
        const landDestinations = [
          "naples",
          "tunis",
          "algeria",
          "spain",
          "marseille",
          "genoa",
          "florence",
          "venice",
          "vienna",
          "trieste",
        ];
        let romeActions = [];
        landDestinations.map((province) => {
          romeActions.push({
            type: "maneuver",
            payload: { origin: "rome", destination: province },
          });
        });

        const availableActions = [
          {
            type: "maneuver",
            payload: {
              origin: "naples",
              destination: "western mediterranean sea",
            },
          },
          ...romeActions,
        ];
        expect(Imperial.fromLog(log).state.availableActions).toEqual(
          availableActions
        );
      });

      test("spain and western mediterranean sea have IT flags", () => {
        const log = [
          ...secondRoundLog,
          {
            type: "rondel",
            payload: { nation: "AH", cost: 0, slot: "maneuver2" },
          },
          {
            type: "maneuver",
            payload: { origin: "trieste", destination: "ionian sea" },
          },
          {
            type: "maneuver",
            payload: { origin: "lemberg", destination: "romania" },
          },
          {
            type: "maneuver",
            payload: { origin: "budapest", destination: "west balkan" },
          },
          {
            type: "maneuver",
            payload: { origin: "vienna", destination: "tunis" },
          },
          {
            type: "rondel",
            payload: { nation: "IT", cost: 0, slot: "maneuver2" },
          },
          {
            type: "maneuver",
            payload: {
              origin: "naples",
              destination: "western mediterranean sea",
            },
          },
          {
            type: "maneuver",
            payload: { origin: "rome", destination: "spain" },
          },
        ];
        const westernMediterraneanSeaFlag = Imperial.fromLog(log).state
          .provinces["western mediterranean sea"].flag;
        const spainFlag = Imperial.fromLog(log).state.provinces["spain"].flag;

        expect(westernMediterraneanSeaFlag).toEqual("IT");
        expect(spainFlag).toEqual("IT");
      });
    });

    describe("3. FR does maneuver1", () => {
      test("FR's available actions are to move bordeaux, marseille, and paris", () => {
        const log = [
          ...secondRoundLog,
          {
            type: "rondel",
            payload: { nation: "AH", cost: 0, slot: "maneuver2" },
          },
          {
            type: "maneuver",
            payload: { origin: "trieste", destination: "ionian sea" },
          },
          {
            type: "maneuver",
            payload: { origin: "lemberg", destination: "romania" },
          },
          {
            type: "maneuver",
            payload: { origin: "budapest", destination: "west balkan" },
          },
          {
            type: "maneuver",
            payload: { origin: "vienna", destination: "tunis" },
          },
          {
            type: "rondel",
            payload: { nation: "IT", cost: 0, slot: "maneuver2" },
          },
          {
            type: "maneuver",
            payload: {
              origin: "naples",
              destination: "western mediterranean sea",
            },
          },
          {
            type: "maneuver",
            payload: { origin: "rome", destination: "spain" },
          },
          {
            type: "rondel",
            payload: { nation: "FR", cost: 0, slot: "maneuver1" },
          },
        ];
        const landDestinations = [
          "brest",
          "dijon",
          "bordeaux",
          "marseille",
          "belgium",
          "genoa",
          "munich",
          "spain",
        ];
        let parisActions = [];
        landDestinations.map((province) => {
          parisActions.push({
            type: "maneuver",
            payload: { origin: "paris", destination: province },
          });
        });

        const availableActions = [
          {
            type: "maneuver",
            payload: {
              origin: "bordeaux",
              destination: "bay of biscay",
            },
          },
          {
            type: "maneuver",
            payload: {
              origin: "marseille",
              destination: "western mediterranean sea",
            },
          },
          ...parisActions,
        ];
        expect(Imperial.fromLog(log).state.availableActions).toEqual(
          availableActions
        );
      });

      test("IT controller (Anton) can choose whether to fight or allow FR fleet to coexist in western mediterranean sea", () => {
        const log = [
          ...secondRoundLog,
          {
            type: "rondel",
            payload: { nation: "AH", cost: 0, slot: "maneuver2" },
          },
          {
            type: "maneuver",
            payload: { origin: "trieste", destination: "ionian sea" },
          },
          {
            type: "maneuver",
            payload: { origin: "lemberg", destination: "romania" },
          },
          {
            type: "maneuver",
            payload: { origin: "budapest", destination: "west balkan" },
          },
          {
            type: "maneuver",
            payload: { origin: "vienna", destination: "tunis" },
          },
          {
            type: "rondel",
            payload: { nation: "IT", cost: 0, slot: "maneuver2" },
          },
          {
            type: "maneuver",
            payload: {
              origin: "naples",
              destination: "western mediterranean sea",
            },
          },
          {
            type: "maneuver",
            payload: { origin: "rome", destination: "spain" },
          },
          {
            type: "rondel",
            payload: { nation: "IT", cost: 0, slot: "maneuver2" },
          },
          {
            type: "maneuver",
            payload: {
              origin: "naples",
              destination: "western mediterranean sea",
            },
          },
          {
            type: "rondel",
            payload: { nation: "FR", cost: 0, slot: "maneuver1" },
          },
          {
            type: "maneuver",
            payload: {
              origin: "marseille",
              destination: "western mediterranean sea",
            },
          },
        ];
        const expectedActions = [
          {
            type: "coexist",
            payload: {
              province: "western mediterranean sea",
              incumbent: "IT",
              challenger: "FR",
            },
          },
          {
            type: "fight",
            payload: {
              province: "western mediterranean sea",
              incumbent: "IT",
              challenger: "FR",
            },
          },
          ,
        ];
        expect(Imperial.fromLog(log).state.availableActions).toEqual(
          expectedActions
        );
      });

      test("IT chooses to fight so both fleets get removed", () => {
        const log = [
          ...secondRoundLog,
          {
            type: "rondel",
            payload: { nation: "AH", cost: 0, slot: "maneuver2" },
          },
          {
            type: "maneuver",
            payload: { origin: "trieste", destination: "ionian sea" },
          },
          {
            type: "maneuver",
            payload: { origin: "lemberg", destination: "romania" },
          },
          {
            type: "maneuver",
            payload: { origin: "budapest", destination: "west balkan" },
          },
          {
            type: "maneuver",
            payload: { origin: "vienna", destination: "tunis" },
          },
          {
            type: "rondel",
            payload: { nation: "IT", cost: 0, slot: "maneuver2" },
          },
          {
            type: "maneuver",
            payload: {
              origin: "naples",
              destination: "western mediterranean sea",
            },
          },
          {
            type: "maneuver",
            payload: { origin: "rome", destination: "spain" },
          },
          {
            type: "rondel",
            payload: { nation: "FR", cost: 0, slot: "maneuver1" },
          },
          {
            type: "maneuver",
            payload: {
              origin: "marseille",
              destination: "western mediterranean sea",
            },
          },
          {
            type: "fight",
            payload: {
              province: "western mediterranean sea",
              incumbent: "IT",
              challenger: "FR",
            },
          },
        ];

        expect(
          Imperial.fromLog(log).state.provinces["western mediterranean sea"]
            .unitCount
        ).toEqual(0);
        expect(
          Imperial.fromLog(log).state.provinces["western mediterranean sea"]
            .flag
        ).toEqual("IT");
      });

      test("Morocco and bay of biscay have FR flags", () => {
        const log = [
          ...secondRoundLog,
          {
            type: "rondel",
            payload: { nation: "AH", cost: 0, slot: "maneuver2" },
          },
          {
            type: "maneuver",
            payload: { origin: "trieste", destination: "ionian sea" },
          },
          {
            type: "maneuver",
            payload: { origin: "lemberg", destination: "romania" },
          },
          {
            type: "maneuver",
            payload: { origin: "budapest", destination: "west balkan" },
          },
          {
            type: "maneuver",
            payload: { origin: "vienna", destination: "tunis" },
          },
          {
            type: "rondel",
            payload: { nation: "IT", cost: 0, slot: "maneuver2" },
          },
          {
            type: "maneuver",
            payload: {
              origin: "naples",
              destination: "western mediterranean sea",
            },
          },
          {
            type: "manuver",
            payload: { origin: "rome", destination: "spain" },
          },
          {
            type: "rondel",
            payload: { nation: "FR", cost: 0, slot: "maneuver1" },
          },
          {
            type: "maneuver",
            payload: {
              origin: "bordeaux",
              destination: "bay of biscay",
            },
          },
          {
            type: "maneuver",
            payload: {
              origin: "paris",
              destination: "morocco",
            },
          },
        ];
        expect(
          Imperial.fromLog(log).state.provinces["bay of biscay"].unitCount
        ).toEqual(1);
        expect(
          Imperial.fromLog(log).state.provinces["bay of biscay"].flag
        ).toEqual("FR");
        expect(
          Imperial.fromLog(log).state.provinces["morocco"].unitCount
        ).toEqual(1);
        expect(Imperial.fromLog(log).state.provinces["morocco"].flag).toEqual(
          "FR"
        );
      });
    });

    describe("4. GB invests", () => {
      test("GB moves to the investor slot", () => {
        const log = [
          ...secondRoundLog,
          {
            type: "rondel",
            payload: { nation: "AH", cost: 0, slot: "maneuver2" },
          },
          {
            type: "maneuver",
            payload: { origin: "trieste", destination: "ionian sea" },
          },
          {
            type: "maneuver",
            payload: { origin: "lemberg", destination: "romania" },
          },
          {
            type: "maneuver",
            payload: { origin: "budapest", destination: "west balkan" },
          },
          {
            type: "maneuver",
            payload: { origin: "vienna", destination: "tunis" },
          },
          {
            type: "rondel",
            payload: { nation: "IT", cost: 0, slot: "maneuver2" },
          },
          {
            type: "maneuver",
            payload: {
              origin: "naples",
              destination: "western mediterranean sea",
            },
          },
          {
            type: "maneuver",
            payload: { origin: "rome", destination: "spain" },
          },
          {
            type: "rondel",
            payload: { nation: "FR", cost: 0, slot: "maneuver1" },
          },
          {
            type: "maneuver",
            payload: {
              origin: "bordeaux",
              destination: "bay of biscay",
            },
          },
          {
            type: "maneuver",
            payload: {
              origin: "paris",
              destination: "morocco",
            },
          },
          {
            type: "rondel",
            payload: { nation: "GB", cost: 0, slot: "investor" },
          },
        ];
        const actions = Imperial.fromLog(log).state.availableActions;
        const expected = rondelSlots.map((slot) => ({
          type: "rondel",
          payload: { nation: "GE", cost: 0, slot },
        }));
        expect(actions).toEqual(new Set(expected));
      });

      describe("consequences", () => {
        test("GB has 6 million left in the treasury", () => {
          const log = [
            ...secondRoundLog,
            {
              type: "rondel",
              payload: { nation: "AH", cost: 0, slot: "maneuver2" },
            },
            {
              type: "maneuver",
              payload: { origin: "trieste", destination: "ionian sea" },
            },
            {
              type: "maneuver",
              payload: { origin: "lemberg", destination: "romania" },
            },
            {
              type: "maneuver",
              payload: { origin: "budapest", destination: "west balkan" },
            },
            {
              type: "maneuver",
              payload: { origin: "vienna", destination: "tunis" },
            },
            {
              type: "rondel",
              payload: { nation: "IT", cost: 0, slot: "maneuver2" },
            },
            {
              type: "maneuver",
              payload: {
                origin: "naples",
                destination: "western mediterranean sea",
              },
            },
            {
              type: "maneuver",
              payload: { origin: "rome", destination: "spain" },
            },
            {
              type: "rondel",
              payload: { nation: "FR", cost: 0, slot: "maneuver1" },
            },
            {
              type: "maneuver",
              payload: {
                origin: "bordeaux",
                destination: "bay of biscay",
              },
            },
            {
              type: "maneuver",
              payload: {
                origin: "paris",
                destination: "morocco",
              },
            },
            {
              type: "rondel",
              payload: { nation: "GB", cost: 0, slot: "investor" },
            },
          ];
          const treasury = Imperial.fromLog(log).state.nations["GB"].treasury;
          expect(treasury).toEqual(6);
        });

        test("Bert (GB's controller and investor-card holder) has 9 million in cash", () => {
          const log = [
            ...secondRoundLog,
            {
              type: "rondel",
              payload: { nation: "AH", cost: 0, slot: "maneuver2" },
            },
            {
              type: "maneuver",
              payload: { origin: "trieste", destination: "ionian sea" },
            },
            {
              type: "maneuver",
              payload: { origin: "lemberg", destination: "romania" },
            },
            {
              type: "maneuver",
              payload: { origin: "budapest", destination: "west balkan" },
            },
            {
              type: "maneuver",
              payload: { origin: "vienna", destination: "tunis" },
            },
            {
              type: "rondel",
              payload: { nation: "IT", cost: 0, slot: "maneuver2" },
            },
            {
              type: "maneuver",
              payload: {
                origin: "naples",
                destination: "western mediterranean sea",
              },
            },
            {
              type: "maneuver",
              payload: { origin: "rome", destination: "spain" },
            },
            {
              type: "rondel",
              payload: { nation: "FR", cost: 0, slot: "maneuver1" },
            },
            {
              type: "maneuver",
              payload: {
                origin: "bordeaux",
                destination: "bay of biscay",
              },
            },
            {
              type: "maneuver",
              payload: {
                origin: "paris",
                destination: "morocco",
              },
            },
            {
              type: "rondel",
              payload: { nation: "GB", cost: 0, slot: "investor" },
            },
          ];
          const controller = Imperial.fromLog(log).state.nations["GB"]
            .controller;
          const cash = Imperial.fromLog(log).state.players[controller].cash;
          expect(cash).toEqual(9);
        });

        describe("Investor-card holder (Bert) buys the 6 million bond of RU", () => {
          test("Investor-card holder has 3 million", () => {
            const log = [
              ...secondRoundLog,
              {
                type: "rondel",
                payload: { nation: "AH", cost: 0, slot: "maneuver2" },
              },
              {
                type: "maneuver",
                payload: { origin: "trieste", destination: "ionian sea" },
              },
              {
                type: "maneuver",
                payload: { origin: "lemberg", destination: "romania" },
              },
              {
                type: "maneuver",
                payload: { origin: "budapest", destination: "west balkan" },
              },
              {
                type: "maneuver",
                payload: { origin: "vienna", destination: "tunis" },
              },
              {
                type: "rondel",
                payload: { nation: "IT", cost: 0, slot: "maneuver2" },
              },
              {
                type: "maneuver",
                payload: {
                  origin: "naples",
                  destination: "western mediterranean sea",
                },
              },
              {
                type: "maneuver",
                payload: { origin: "rome", destination: "spain" },
              },
              {
                type: "rondel",
                payload: { nation: "FR", cost: 0, slot: "maneuver1" },
              },
              {
                type: "maneuver",
                payload: {
                  origin: "bordeaux",
                  destination: "bay of biscay",
                },
              },
              {
                type: "maneuver",
                payload: {
                  origin: "paris",
                  destination: "morocco",
                },
              },
              {
                type: "rondel",
                payload: { nation: "GB", cost: 0, slot: "investor" },
              },
              {
                type: "bondPurchase",
                payload: { nation: "RU", player: "Bert", cost: 6 },
              },
            ];
            const cash = Imperial.fromLog(log).state.players["Bert"].cash;
            expect(cash).toEqual(3);
          });

          test("RU treasury has 6 million", () => {
            const log = [
              ...secondRoundLog,
              {
                type: "rondel",
                payload: { nation: "AH", cost: 0, slot: "maneuver2" },
              },
              {
                type: "maneuver",
                payload: { origin: "trieste", destination: "ionian sea" },
              },
              {
                type: "maneuver",
                payload: { origin: "lemberg", destination: "romania" },
              },
              {
                type: "maneuver",
                payload: { origin: "budapest", destination: "west balkan" },
              },
              {
                type: "maneuver",
                payload: { origin: "vienna", destination: "tunis" },
              },
              {
                type: "rondel",
                payload: { nation: "IT", cost: 0, slot: "maneuver2" },
              },
              {
                type: "maneuver",
                payload: {
                  origin: "naples",
                  destination: "western mediterranean sea",
                },
              },
              {
                type: "maneuver",
                payload: { origin: "rome", destination: "spain" },
              },
              {
                type: "rondel",
                payload: { nation: "FR", cost: 0, slot: "maneuver1" },
              },
              {
                type: "maneuver",
                payload: {
                  origin: "bordeaux",
                  destination: "bay of biscay",
                },
              },
              {
                type: "maneuver",
                payload: {
                  origin: "paris",
                  destination: "morocco",
                },
              },
              {
                type: "rondel",
                payload: { nation: "GB", cost: 0, slot: "investor" },
              },
              {
                type: "bondPurchase",
                payload: { nation: "RU", player: "Bert", cost: 6 },
              },
            ];
            const treasury = Imperial.fromLog(log).state.nations["RU"].treasury;
            expect(treasury).toEqual(6);
          });
        });
      });
    });

    describe("5. GE does taxation", () => {
      test("GE moves to the taxation slot", () => {
        const log = [
          ...secondRoundLog,
          {
            type: "rondel",
            payload: { nation: "AH", cost: 0, slot: "maneuver2" },
          },
          {
            type: "maneuver",
            payload: { origin: "trieste", destination: "ionian sea" },
          },
          {
            type: "maneuver",
            payload: { origin: "lemberg", destination: "romania" },
          },
          {
            type: "maneuver",
            payload: { origin: "budapest", destination: "west balkan" },
          },
          {
            type: "maneuver",
            payload: { origin: "vienna", destination: "tunis" },
          },
          {
            type: "rondel",
            payload: { nation: "IT", cost: 0, slot: "maneuver2" },
          },
          {
            type: "maneuver",
            payload: {
              origin: "naples",
              destination: "western mediterranean sea",
            },
          },
          {
            type: "maneuver",
            payload: { origin: "rome", destination: "spain" },
          },
          {
            type: "rondel",
            payload: { nation: "FR", cost: 0, slot: "maneuver1" },
          },
          {
            type: "maneuver",
            payload: {
              origin: "bordeaux",
              destination: "bay of biscay",
            },
          },
          {
            type: "maneuver",
            payload: {
              origin: "paris",
              destination: "morocco",
            },
          },
          {
            type: "rondel",
            payload: { nation: "GB", cost: 0, slot: "investor" },
          },
          {
            type: "bondPurchase",
            payload: { nation: "RU", player: "Bert", cost: 6 },
          },
          {
            type: "rondel",
            payload: { nation: "GE", cost: 0, slot: "taxation" },
          },
        ];
        const actions = Imperial.fromLog(log).state.availableActions;
        const expected = rondelSlots.map((slot) => ({
          type: "rondel",
          payload: { nation: "RU", cost: 0, slot },
        }));
        expect(actions).toEqual(new Set(expected));
      });

      describe("consequences", () => {
        test("GE has 14 million in its treasury", () => {
          const log = [
            ...secondRoundLog,
            {
              type: "rondel",
              payload: { nation: "AH", cost: 0, slot: "maneuver2" },
            },
            {
              type: "maneuver",
              payload: { origin: "trieste", destination: "ionian sea" },
            },
            {
              type: "maneuver",
              payload: { origin: "lemberg", destination: "romania" },
            },
            {
              type: "maneuver",
              payload: { origin: "budapest", destination: "west balkan" },
            },
            {
              type: "maneuver",
              payload: { origin: "vienna", destination: "tunis" },
            },
            {
              type: "rondel",
              payload: { nation: "IT", cost: 0, slot: "maneuver2" },
            },
            {
              type: "maneuver",
              payload: {
                origin: "naples",
                destination: "western mediterranean sea",
              },
            },
            {
              type: "maneuver",
              payload: { origin: "rome", destination: "spain" },
            },
            {
              type: "rondel",
              payload: { nation: "FR", cost: 0, slot: "maneuver1" },
            },
            {
              type: "maneuver",
              payload: {
                origin: "bordeaux",
                destination: "bay of biscay",
              },
            },
            {
              type: "maneuver",
              payload: {
                origin: "paris",
                destination: "morocco",
              },
            },
            {
              type: "rondel",
              payload: { nation: "GB", cost: 0, slot: "investor" },
            },
            {
              type: "bondPurchase",
              payload: { nation: "RU", player: "Bert", cost: 6 },
            },
            {
              type: "rondel",
              payload: { nation: "GE", cost: 0, slot: "taxation" },
            },
          ];
          const treasury = Imperial.fromLog(log).state.nations["GE"].treasury;
          expect(treasury).toEqual(14);
        });

        test("GE moves up one field on tax chart", () => {
          const log = [
            ...secondRoundLog,
            {
              type: "rondel",
              payload: { nation: "AH", cost: 0, slot: "maneuver2" },
            },
            {
              type: "maneuver",
              payload: { origin: "trieste", destination: "ionian sea" },
            },
            {
              type: "maneuver",
              payload: { origin: "lemberg", destination: "romania" },
            },
            {
              type: "maneuver",
              payload: { origin: "budapest", destination: "west balkan" },
            },
            {
              type: "maneuver",
              payload: { origin: "vienna", destination: "tunis" },
            },
            {
              type: "rondel",
              payload: { nation: "IT", cost: 0, slot: "maneuver2" },
            },
            {
              type: "maneuver",
              payload: {
                origin: "naples",
                destination: "western mediterranean sea",
              },
            },
            {
              type: "maneuver",
              payload: { origin: "rome", destination: "spain" },
            },
            {
              type: "rondel",
              payload: { nation: "FR", cost: 0, slot: "maneuver1" },
            },
            {
              type: "maneuver",
              payload: {
                origin: "bordeaux",
                destination: "bay of biscay",
              },
            },
            {
              type: "maneuver",
              payload: {
                origin: "paris",
                destination: "morocco",
              },
            },
            {
              type: "rondel",
              payload: { nation: "GB", cost: 0, slot: "investor" },
            },
            {
              type: "bondPurchase",
              payload: { nation: "RU", player: "Bert", cost: 6 },
            },
            {
              type: "rondel",
              payload: { nation: "GE", cost: 0, slot: "taxation" },
            },
          ];
          const taxChartPosition = Imperial.fromLog(log).state.nations["GE"]
            .taxChartPosition;
          expect(taxChartPosition).toEqual("6");
        });

        test("GE receives 1 power point", () => {
          const log = [
            ...secondRoundLog,
            {
              type: "rondel",
              payload: { nation: "AH", cost: 0, slot: "maneuver2" },
            },
            {
              type: "maneuver",
              payload: { origin: "trieste", destination: "ionian sea" },
            },
            {
              type: "maneuver",
              payload: { origin: "lemberg", destination: "romania" },
            },
            {
              type: "maneuver",
              payload: { origin: "budapest", destination: "west balkan" },
            },
            {
              type: "maneuver",
              payload: { origin: "vienna", destination: "tunis" },
            },
            {
              type: "rondel",
              payload: { nation: "IT", cost: 0, slot: "maneuver2" },
            },
            {
              type: "maneuver",
              payload: {
                origin: "naples",
                destination: "western mediterranean sea",
              },
            },
            {
              type: "maneuver",
              payload: { origin: "rome", destination: "spain" },
            },
            {
              type: "rondel",
              payload: { nation: "FR", cost: 0, slot: "maneuver1" },
            },
            {
              type: "maneuver",
              payload: {
                origin: "bordeaux",
                destination: "bay of biscay",
              },
            },
            {
              type: "maneuver",
              payload: {
                origin: "paris",
                destination: "morocco",
              },
            },
            {
              type: "rondel",
              payload: { nation: "GB", cost: 0, slot: "investor" },
            },
            {
              type: "bondPurchase",
              payload: { nation: "RU", player: "Bert", cost: 6 },
            },
            {
              type: "rondel",
              payload: { nation: "GE", cost: 0, slot: "taxation" },
            },
          ];
          const powerPoints = Imperial.fromLog(log).state.nations["GE"]
            .powerPoints;
          expect(powerPoints).toEqual(1);
        });

        test("Anton has 4 million cash", () => {
          const log = [
            ...secondRoundLog,
            {
              type: "rondel",
              payload: { nation: "AH", cost: 0, slot: "maneuver2" },
            },
            {
              type: "maneuver",
              payload: { origin: "trieste", destination: "ionian sea" },
            },
            {
              type: "maneuver",
              payload: { origin: "lemberg", destination: "romania" },
            },
            {
              type: "maneuver",
              payload: { origin: "budapest", destination: "west balkan" },
            },
            {
              type: "maneuver",
              payload: { origin: "vienna", destination: "tunis" },
            },
            {
              type: "rondel",
              payload: { nation: "IT", cost: 0, slot: "maneuver2" },
            },
            {
              type: "maneuver",
              payload: {
                origin: "naples",
                destination: "western mediterranean sea",
              },
            },
            {
              type: "maneuver",
              payload: { origin: "rome", destination: "spain" },
            },
            {
              type: "rondel",
              payload: { nation: "FR", cost: 0, slot: "maneuver1" },
            },
            {
              type: "maneuver",
              payload: {
                origin: "bordeaux",
                destination: "bay of biscay",
              },
            },
            {
              type: "maneuver",
              payload: {
                origin: "paris",
                destination: "morocco",
              },
            },
            {
              type: "rondel",
              payload: { nation: "GB", cost: 0, slot: "investor" },
            },
            {
              type: "bondPurchase",
              payload: { nation: "RU", player: "Bert", cost: 6 },
            },
            {
              type: "rondel",
              payload: { nation: "GE", cost: 0, slot: "taxation" },
            },
          ];
          const cash = Imperial.fromLog(log).state.players["Anton"].cash;
          expect(cash).toEqual(4);
        });
      });
    });

    describe("6. RU does production2", () => {
      test("Odessa and Moscow have units", () => {
        const log = [
          ...secondRoundLog,
          {
            type: "rondel",
            payload: { nation: "AH", cost: 0, slot: "maneuver2" },
          },
          {
            type: "maneuver",
            payload: { origin: "trieste", destination: "ionian sea" },
          },
          {
            type: "maneuver",
            payload: { origin: "lemberg", destination: "romania" },
          },
          {
            type: "maneuver",
            payload: { origin: "budapest", destination: "west balkan" },
          },
          {
            type: "maneuver",
            payload: { origin: "vienna", destination: "tunis" },
          },
          {
            type: "rondel",
            payload: { nation: "IT", cost: 0, slot: "maneuver2" },
          },
          {
            type: "maneuver",
            payload: {
              origin: "naples",
              destination: "western mediterranean sea",
            },
          },
          {
            type: "maneuver",
            payload: { origin: "rome", destination: "spain" },
          },
          {
            type: "rondel",
            payload: { nation: "FR", cost: 0, slot: "maneuver1" },
          },
          {
            type: "maneuver",
            payload: {
              origin: "bordeaux",
              destination: "bay of biscay",
            },
          },
          {
            type: "maneuver",
            payload: {
              origin: "paris",
              destination: "morocco",
            },
          },
          {
            type: "rondel",
            payload: { nation: "GB", cost: 0, slot: "investor" },
          },
          {
            type: "bondPurchase",
            payload: { nation: "RU", player: "Bert", cost: 6 },
          },
          {
            type: "rondel",
            payload: { nation: "GE", cost: 0, slot: "taxation" },
          },
          {
            type: "rondel",
            payload: { nation: "RU", cost: 0, slot: "production2" },
          },
        ];
        const odessaUnitCount = Imperial.fromLog(log).state.provinces["odessa"]
          .unitCount;
        const moscowUnitCount = Imperial.fromLog(log).state.provinces["moscow"]
          .unitCount;
        expect(odessaUnitCount).toEqual(1);
        expect(moscowUnitCount).toEqual(3);
      });
    });
  });

  describe("fourth round", () => {
    describe("1. AH does taxation", () => {
      test("AH moves to the taxation slot", () => {
        const log = [
          ...thirdRoundLog,
          {
            type: "rondel",
            payload: { nation: "AH", cost: 0, slot: "taxation" },
          },
        ];
        const actions = Imperial.fromLog(log).state.availableActions;
        const expected = rondelSlots.map((slot) => ({
          type: "rondel",
          payload: { nation: "IT", cost: 0, slot },
        }));
        expect(actions).toEqual(new Set(expected));
      });

      describe("consequences", () => {
        test("AH has 4 million in its treasury", () => {
          const log = [
            ...thirdRoundLog,
            {
              type: "rondel",
              payload: { nation: "AH", cost: 0, slot: "taxation" },
            },
          ];
          const treasury = Imperial.fromLog(log).state.nations["AH"].treasury;
          expect(treasury).toEqual(4);
        });

        test("AH moves up three field on tax chart", () => {
          const log = [
            ...thirdRoundLog,
            {
              type: "rondel",
              payload: { nation: "AH", cost: 0, slot: "taxation" },
            },
          ];
          const taxChartPosition = Imperial.fromLog(log).state.nations["AH"]
            .taxChartPosition;
          expect(taxChartPosition).toEqual("8");
        });

        test("AH receives 3 power points", () => {
          const log = [
            ...thirdRoundLog,
            {
              type: "rondel",
              payload: { nation: "AH", cost: 0, slot: "taxation" },
            },
          ];
          const powerPoints = Imperial.fromLog(log).state.nations["AH"]
            .powerPoints;
          expect(powerPoints).toEqual(3);
        });

        test("Claudia has 5 million cash", () => {
          const log = [
            ...thirdRoundLog,
            {
              type: "rondel",
              payload: { nation: "AH", cost: 0, slot: "taxation" },
            },
          ];
          const cash = Imperial.fromLog(log).state.players["Claudia"].cash;
          expect(cash).toEqual(5);
        });
      });
    });

    describe("2. IT does production1", () => {
      test("Rome and Naples have units", () => {
        const log = [
          ...thirdRoundLog,
          {
            type: "rondel",
            payload: { nation: "AH", cost: 0, slot: "taxation" },
          },
          {
            type: "rondel",
            payload: { nation: "IT", cost: 0, slot: "production1" },
          },
        ];

        const romeUnitCount = Imperial.fromLog(log).state.provinces["rome"]
          .unitCount;
        const naplesUnitCount = Imperial.fromLog(log).state.provinces["naples"]
          .unitCount;
        expect(romeUnitCount).toEqual(1);
        expect(naplesUnitCount).toEqual(1);
      });
    });

    describe("3. FR does production2", () => {
      test("Bordeaux, Marseille and Paris have units", () => {
        const log = [
          ...thirdRoundLog,
          {
            type: "rondel",
            payload: { nation: "AH", cost: 0, slot: "taxation" },
          },
          {
            type: "rondel",
            payload: { nation: "IT", cost: 0, slot: "production1" },
          },
          {
            type: "rondel",
            payload: { nation: "FR", cost: 0, slot: "production2" },
          },
        ];

        const bordeauxUnitCount = Imperial.fromLog(log).state.provinces[
          "bordeaux"
        ].unitCount;
        const marseilleUnitCount = Imperial.fromLog(log).state.provinces[
          "marseille"
        ].unitCount;
        const parisUnitCount = Imperial.fromLog(log).state.provinces["paris"]
          .unitCount;
        expect(bordeauxUnitCount).toEqual(1);
        expect(marseilleUnitCount).toEqual(1);
        expect(parisUnitCount).toEqual(1);
      });

      describe("investor card is activated", () => {
        test("Claudia (investor card owner) has 7 million", () => {
          const log = [
            ...thirdRoundLog,
            {
              type: "rondel",
              payload: { nation: "AH", cost: 0, slot: "taxation" },
            },
            {
              type: "rondel",
              payload: { nation: "IT", cost: 0, slot: "production1" },
            },
            {
              type: "rondel",
              payload: { nation: "FR", cost: 0, slot: "production2" },
            },
          ];
          const cash = Imperial.fromLog(log).state.players["Claudia"].cash;
          expect(cash).toEqual(7);
        });

        test("Claudia can buy a bond", () => {
          const log = [
            ...thirdRoundLog,
            {
              type: "rondel",
              payload: { nation: "AH", cost: 0, slot: "taxation" },
            },
            {
              type: "rondel",
              payload: { nation: "IT", cost: 0, slot: "production1" },
            },
            {
              type: "rondel",
              payload: { nation: "FR", cost: 0, slot: "production2" },
            },
          ];
          const expectedActions = [
            {
              type: "bondPurchase",
              payload: { nation: "AH", player: "Claudia", cost: 4 },
            },
            {
              type: "bondPurchase",
              payload: { nation: "AH", player: "Claudia", cost: 6 },
            },
            {
              type: "bondPurchase",
              payload: { nation: "IT", player: "Claudia", cost: 2 },
            },
            {
              type: "bondPurchase",
              payload: { nation: "IT", player: "Claudia", cost: 4 },
            },
            {
              type: "bondPurchase",
              payload: { nation: "IT", player: "Claudia", cost: 6 },
            },
            {
              type: "bondPurchase",
              payload: { nation: "FR", player: "Claudia", cost: 4 },
            },
            {
              type: "bondPurchase",
              payload: { nation: "FR", player: "Claudia", cost: 6 },
            },
            {
              type: "bondPurchase",
              payload: { nation: "GB", player: "Claudia", cost: 4 },
            },
            {
              type: "bondPurchase",
              payload: { nation: "GB", player: "Claudia", cost: 6 },
            },
            {
              type: "bondPurchase",
              payload: { nation: "GE", player: "Claudia", cost: 2 },
            },
            {
              type: "bondPurchase",
              payload: { nation: "RU", player: "Claudia", cost: 4 },
            },
          ];
          expect(Imperial.fromLog(log).availableActions()).toEqual(
            expectedActions
          );
        });

        describe("Claudia buys a 6 million AH bond", () => {
          test("Claudia has 1 million in cash", () => {
            const log = [
              ...thirdRoundLog,
              {
                type: "rondel",
                payload: { nation: "AH", cost: 0, slot: "taxation" },
              },
              {
                type: "rondel",
                payload: { nation: "IT", cost: 0, slot: "production1" },
              },
              {
                type: "rondel",
                payload: { nation: "FR", cost: 0, slot: "production2" },
              },
              {
                type: "bondPurchase",
                payload: { nation: "AH", player: "Claudia", cost: 6 },
              },
            ];
            const cash = Imperial.fromLog(log).state.players["Claudia"].cash;
            expect(cash).toEqual(1);
          });

          test("Claudia has the #3 AH bond", () => {
            const log = [
              ...thirdRoundLog,
              {
                type: "rondel",
                payload: { nation: "AH", cost: 0, slot: "taxation" },
              },
              {
                type: "rondel",
                payload: { nation: "IT", cost: 0, slot: "production1" },
              },
              {
                type: "rondel",
                payload: { nation: "FR", cost: 0, slot: "production2" },
              },
              {
                type: "bondPurchase",
                payload: { nation: "AH", player: "Claudia", cost: 6 },
              },
            ];
            const bonds = Imperial.fromLog(log).state.players["Claudia"].bonds;
            expect(bonds).toEqual([
              { nation: "AH", cost: 2 },
              { nation: "FR", cost: 9 },
              { nation: "AH", cost: 6 },
            ]);
          });
        });

        test("Daniel is the investor card owner", () => {
          const log = [
            ...thirdRoundLog,
            {
              type: "rondel",
              payload: { nation: "AH", cost: 0, slot: "taxation" },
            },
            {
              type: "rondel",
              payload: { nation: "IT", cost: 0, slot: "production1" },
            },
            {
              type: "rondel",
              payload: { nation: "FR", cost: 0, slot: "production2" },
            },
            {
              type: "bondPurchase",
              payload: { nation: "AH", player: "Claudia", cost: 6 },
            },
          ];
          const investorCardHolder = Imperial.fromLog(log).state
            .investorCardHolder;
          expect(investorCardHolder).toEqual("Daniel");
        });
      });
    });
  });
});

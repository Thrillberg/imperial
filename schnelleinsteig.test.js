import { Nation, Bond } from "./constants";
import Action from "./action";
import Imperial from "./imperial";
import mainLog from "./schnelleinsteigLog";

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
  describe("setup for four players", () => {
    const game = Imperial.fromLog(mainLog.slice(0, 1));

    test("players", () => {
      expect(game.players).toEqual({
        Daniel: {
          name: "Daniel",
          bonds: new Set([Bond(Nation.RU, 4), Bond(Nation.FR, 1)]),
          cash: 2,
        },
        Claudia: {
          name: "Claudia",
          bonds: new Set([Bond(Nation.FR, 4), Bond(Nation.AH, 1)]),
          cash: 2,
        },
        Bert: {
          name: "Bert",
          bonds: new Set([Bond(Nation.GB, 4), Bond(Nation.RU, 1)]),
          cash: 2,
        },
        Anton: {
          name: "Anton",
          bonds: new Set([Bond(Nation.IT, 4), Bond(Nation.GB, 1)]),
          cash: 2,
        },
      });
    });

    test("order", () => {
      expect(game.order).toEqual(["Daniel", "Claudia", "Bert", "Anton"]);
    });

    test("nations", () => {
      expect(game.nations).toEqual(
        new Map([
          [
            Nation.AH,
            {
              flagCount: 0,
              powerPoints: 0,
              taxChartPosition: 5,
              controller: "Claudia",
              rondelPosition: null,
              treasury: 2,
            },
          ],
          [
            Nation.FR,
            {
              flagCount: 0,
              powerPoints: 0,
              taxChartPosition: 5,
              controller: "Claudia",
              rondelPosition: null,
              treasury: 11,
            },
          ],
          [
            Nation.GB,
            {
              flagCount: 0,
              powerPoints: 0,
              taxChartPosition: 5,
              controller: "Bert",
              rondelPosition: null,
              treasury: 11,
            },
          ],
          [
            Nation.GE,
            {
              flagCount: 0,
              powerPoints: 0,
              taxChartPosition: 5,
              controller: null,
              rondelPosition: null,
              treasury: 0,
            },
          ],
          [
            Nation.IT,
            {
              flagCount: 0,
              powerPoints: 0,
              taxChartPosition: 5,
              controller: "Anton",
              rondelPosition: null,
              treasury: 9,
            },
          ],
          [
            Nation.RU,
            {
              flagCount: 0,
              powerPoints: 0,
              taxChartPosition: 5,
              controller: "Daniel",
              rondelPosition: null,
              treasury: 11,
            },
          ],
        ])
      );
    });
  });

  describe("first round", () => {
    describe("1. AH imports", () => {
      xtest("AH moved to the import slot", () => {
        const log = mainLog.slice(0, 14);
        log.push(Action.rondel({ nation: Nation.AH, cost: 0, slot: "import" }));
        const game = Imperial.fromLog(log);
        const expectedActions = [
          "vienna",
          "budapest",
          "prague",
          "lemberg",
          "trieste",
        ].map((province) =>
          Action.import({ placements: [{ province, unit: "army" }] })
        );
        expectedActions.push(
          Action.import({
            placements: [{ province: "trieste", unit: "fleet" }],
          })
        );

        expect(game.availableActions).toEqual(new Set(expectedActions));
      });

      test("AH's treasury is empty and Trieste & Lemberg have AH armies", () => {
        const log = mainLog.slice(0, 15);
        log.push(
          Action.import({
            placements: [
              { province: "trieste", type: "fleet" },
              { province: "lemberg", type: "army" },
            ],
          })
        );
        const game = Imperial.fromLog(log);
        const treasury = game.nations.get(Nation.AH).treasury;
        const triesteFleetCount = game.units.get(Nation.AH).get("trieste")
          .fleets;
        const lembergArmyCount = game.units.get(Nation.AH).get("lemberg")
          .armies;

        expect(treasury).toEqual(0);
        expect(triesteFleetCount).toEqual(1);
        expect(lembergArmyCount).toEqual(1);
      });

      xtest("it is now IT's turn", () => {
        const log = mainLog.slice(0, 15);
        log.push(
          Action.import({
            placements: [
              { province: "trieste", type: "fleet" },
              { province: "lemberg", type: "army" },
            ],
          })
        );
        const game = Imperial.fromLog(log);
        const currentPlayerName = game.nations.get(Nation.IT).controller;

        expect(game.currentPlayerName).toEqual(currentPlayerName);
      });
    });

    describe("2. IT invests", () => {
      test("IT has 5 million left in the treasury", () => {
        const log = mainLog.slice(0, 17);
        log.push(
          Action.rondel({ nation: Nation.IT, cost: 0, slot: "investor" })
        );
        const game = Imperial.fromLog(log);
        const treasury = game.nations.get(Nation.IT).treasury;

        expect(treasury).toEqual(5);
      });

      test("IT's controller (Anton) has 6 million in cash", () => {
        const log = mainLog.slice(0, 17);
        log.push(
          Action.rondel({ nation: Nation.IT, cost: 0, slot: "investor" })
        );
        const game = Imperial.fromLog(log);
        const controller = game.nations.get(Nation.IT).controller;
        const cash = game.players[controller].cash;

        expect(cash).toEqual(6);
      });

      test("Investor-card holder (Daniel) has 4 million in cash", () => {
        const log = mainLog.slice(0, 17);
        log.push(
          Action.rondel({ nation: Nation.IT, cost: 0, slot: "investor" })
        );
        const game = Imperial.fromLog(log);
        const investorCardHolder = game.investorCardHolder;
        const cash = game.players[investorCardHolder].cash;

        expect(cash).toEqual(4);
      });

      test("Daniel can buy a bond", () => {
        const log = mainLog.slice(0, 17);
        log.push(
          Action.rondel({ nation: Nation.IT, cost: 0, slot: "investor" })
        );
        const game = Imperial.fromLog(log);
        const expectedActions = new Set([
          Action.bondPurchase({ nation: Nation.AH, player: "Daniel", cost: 4 }),
          Action.bondPurchase({ nation: Nation.IT, player: "Daniel", cost: 2 }),
          Action.bondPurchase({ nation: Nation.IT, player: "Daniel", cost: 4 }),
          Action.bondPurchase({ nation: Nation.FR, player: "Daniel", cost: 4 }),
          Action.bondPurchase({ nation: Nation.FR, player: "Daniel", cost: 6 }),
          Action.bondPurchase({ nation: Nation.GB, player: "Daniel", cost: 4 }),
          Action.bondPurchase({ nation: Nation.GE, player: "Daniel", cost: 2 }),
          Action.bondPurchase({ nation: Nation.GE, player: "Daniel", cost: 4 }),
          Action.bondPurchase({ nation: Nation.RU, player: "Daniel", cost: 4 }),
          Action.bondPurchase({ nation: Nation.RU, player: "Daniel", cost: 6 }),
          Action.bondPurchase({
            nation: Nation.RU,
            player: "Daniel",
            cost: 12,
          }),
        ]);

        expect(game.availableActions).toEqual(expectedActions);
      });

      xtest("it is still IT's turn", () => {
        const log = mainLog.slice(0, 17);
        log.push(
          Action.rondel({ nation: Nation.IT, cost: 0, slot: "investor" })
        );
        const game = Imperial.fromLog(log);
        const currentPlayerName = game.nations.get(Nation.IT).controller;

        expect(game.currentPlayerName).toEqual(currentPlayerName);
      });

      describe("Investor-card holder (Daniel) buys the 4 million bond of GE", () => {
        test("Investor-card holder has no cash", () => {
          const log = mainLog.slice(0, 18);
          log.push(
            Action.bondPurchase({
              nation: Nation.GE,
              player: "Daniel",
              cost: 4,
            })
          );
          const game = Imperial.fromLog(log);
          const cash = game.players["Daniel"].cash;

          expect(cash).toEqual(0);
        });

        test("GE treasury has 4 million", () => {
          const log = mainLog.slice(0, 18);
          log.push(
            Action.bondPurchase({
              nation: Nation.GE,
              player: "Daniel",
              cost: 4,
            })
          );
          const game = Imperial.fromLog(log);
          const treasury = game.nations.get(Nation.GE).treasury;

          expect(treasury).toEqual(4);
        });
      });

      test("it is now FR's turn", () => {
        const log = mainLog.slice(0, 18);
        log.push(
          Action.bondPurchase({
            nation: Nation.GE,
            player: "Daniel",
            cost: 4,
          })
        );
        const game = Imperial.fromLog(log);
        const currentPlayerName = game.nations.get(Nation.FR).controller;

        expect(game.currentPlayerName).toEqual(currentPlayerName);
      });
    });

    describe("3. FR builds a factory", () => {
      test("Claudia can choose where to put the factory", () => {
        const log = mainLog.slice(0, 19);
        log.push(
          Action.rondel({ nation: Nation.FR, cost: 0, slot: "factory" })
        );
        const game = Imperial.fromLog(log);
        const expectedActions = [
          Action.buildFactory({ province: "brest" }),
          Action.buildFactory({ province: "dijon" }),
          Action.buildFactory({ province: "marseille" }),
        ];

        expect(game.availableActions).toEqual(new Set(expectedActions));
      });

      test("Marseille has a factory", () => {
        const log = mainLog.slice(0, 20);
        log.push(Action.buildFactory({ province: "marseille" }));
        const game = Imperial.fromLog(log);
        const factory = game.provinces.get("marseille").factory;

        expect(factory).toEqual("shipyard");
      });

      test("FR has 6 million in its treasury", () => {
        const log = mainLog.slice(0, 20);
        log.push(Action.buildFactory({ province: "marseille" }));
        const game = Imperial.fromLog(log);
        const treasury = game.nations.get(Nation.FR).treasury;

        expect(treasury).toEqual(6);
      });

      test("Paris and Bordeaux have factories", () => {
        const log = mainLog.slice(0, 20);
        log.push(Action.buildFactory({ province: "marseille" }));
        const game = Imperial.fromLog(log);
        const parisFactory = game.provinces.get("paris").factory;
        const bordeauxFactory = game.provinces.get("bordeaux").factory;

        expect(parisFactory).toEqual("armaments");
        expect(bordeauxFactory).toEqual("shipyard");
      });

      test("it is now GB's turn", () => {
        const log = mainLog.slice(0, 20);
        log.push(Action.buildFactory({ province: "marseille" }));
        const game = Imperial.fromLog(log);
        const currentPlayerName = game.nations.get(Nation.GB).controller;

        expect(game.currentPlayerName).toEqual(currentPlayerName);
      });
    });

    describe("4. GB does production1", () => {
      test("London and Liverpool have units", () => {
        const log = mainLog.slice(0, 21);
        log.push(
          Action.rondel({ nation: Nation.GB, cost: 0, slot: "production1" })
        );
        const game = Imperial.fromLog(log);
        const londonFleetCount = game.units.get(Nation.GB).get("london").fleets;
        const liverpoolFleetCount = game.units.get(Nation.GB).get("liverpool")
          .fleets;

        expect(londonFleetCount).toEqual(1);
        expect(liverpoolFleetCount).toEqual(1);
      });

      test("it is now GE's turn", () => {
        const log = mainLog.slice(0, 21);
        log.push(
          Action.rondel({ nation: Nation.GB, cost: 0, slot: "production1" })
        );
        const game = Imperial.fromLog(log);
        const currentPlayerName = game.nations.get(Nation.GE).controller;

        expect(game.currentPlayerName).toEqual(currentPlayerName);
      });
    });

    describe("5. GE does production2", () => {
      test("Berlin and Hamburg have units", () => {
        const log = mainLog.slice(0, 22);
        log.push(
          Action.rondel({ nation: Nation.GE, cost: 0, slot: "production2" })
        );
        const game = Imperial.fromLog(log);
        const berlinArmyCount = game.units.get(Nation.GE).get("berlin").armies;
        const hamburgFleetCount = game.units.get(Nation.GE).get("hamburg")
          .fleets;

        expect(berlinArmyCount).toEqual(1);
        expect(hamburgFleetCount).toEqual(1);
      });

      test("it is now RU's turn", () => {
        const log = mainLog.slice(0, 22);
        log.push(
          Action.rondel({ nation: Nation.GE, cost: 0, slot: "production2" })
        );
        const game = Imperial.fromLog(log);
        const currentPlayerName = game.nations.get(Nation.RU).controller;

        expect(game.currentPlayerName).toEqual(currentPlayerName);
      });
    });

    describe("6. RU invests", () => {
      test("Turn begins with Anton holding the investor card", () => {
        const log = mainLog.slice(0, 23);
        const game = Imperial.fromLog(log);
        const investorCardHolder = game.investorCardHolder;

        expect(investorCardHolder).toEqual("Anton");
      });

      test("RU has 6 million left in the treasury", () => {
        const log = mainLog.slice(0, 23);
        log.push(
          Action.rondel({ nation: Nation.RU, cost: 0, slot: "investor" })
        );
        const game = Imperial.fromLog(log);
        const treasury = game.nations.get(Nation.RU).treasury;

        expect(treasury).toEqual(6);
      });

      test("Daniel has 4 million in cash", () => {
        const log = mainLog.slice(0, 23);
        log.push(
          Action.rondel({ nation: Nation.RU, cost: 0, slot: "investor" })
        );
        const game = Imperial.fromLog(log);
        const cash = game.players["Daniel"].cash;

        expect(cash).toEqual(4);
      });

      test("Bert has 3 million in cash", () => {
        const log = mainLog.slice(0, 23);
        log.push(
          Action.rondel({ nation: Nation.RU, cost: 0, slot: "investor" })
        );
        const game = Imperial.fromLog(log);
        const cash = game.players["Bert"].cash;

        expect(cash).toEqual(3);
      });

      test("IT's controller (Anton) has 8 million in cash", () => {
        const log = mainLog.slice(0, 23);
        log.push(
          Action.rondel({ nation: Nation.RU, cost: 0, slot: "investor" })
        );
        const game = Imperial.fromLog(log);
        const cash = game.players["Anton"].cash;

        expect(cash).toEqual(8);
      });

      test("Anton can buy a bond", () => {
        const log = mainLog.slice(0, 23);
        log.push(
          Action.rondel({ nation: Nation.RU, cost: 0, slot: "investor" })
        );
        const game = Imperial.fromLog(log);
        const expectedActions = new Set([
          Action.bondPurchase({ nation: Nation.AH, player: "Anton", cost: 4 }),
          Action.bondPurchase({ nation: Nation.AH, player: "Anton", cost: 6 }),
          Action.bondPurchase({ nation: Nation.IT, player: "Anton", cost: 2 }),
          Action.bondPurchase({ nation: Nation.IT, player: "Anton", cost: 4 }),
          Action.bondPurchase({ nation: Nation.IT, player: "Anton", cost: 6 }),
          Action.bondPurchase({ nation: Nation.IT, player: "Anton", cost: 12 }),
          Action.bondPurchase({ nation: Nation.IT, player: "Anton", cost: 16 }),
          Action.bondPurchase({ nation: Nation.FR, player: "Anton", cost: 4 }),
          Action.bondPurchase({ nation: Nation.FR, player: "Anton", cost: 6 }),
          Action.bondPurchase({ nation: Nation.GB, player: "Anton", cost: 4 }),
          Action.bondPurchase({ nation: Nation.GB, player: "Anton", cost: 6 }),
          Action.bondPurchase({ nation: Nation.GE, player: "Anton", cost: 2 }),
          Action.bondPurchase({ nation: Nation.GE, player: "Anton", cost: 6 }),
          Action.bondPurchase({ nation: Nation.RU, player: "Anton", cost: 4 }),
          Action.bondPurchase({ nation: Nation.RU, player: "Anton", cost: 6 }),
        ]);

        expect(game.availableActions).toEqual(expectedActions);
      });

      describe("Investor-card holder (Anton) buys the 6 million bond of GE", () => {
        test("Investor-card holder (Anton) 2 million in cash", () => {
          const log = mainLog.slice(0, 24);
          log.push(
            Action.bondPurchase({
              nation: Nation.GE,
              player: "Anton",
              cost: 6,
            })
          );
          const game = Imperial.fromLog(log);
          const cash = game.players["Anton"].cash;

          expect(cash).toEqual(2);
        });

        test("GE treasury has 10 million", () => {
          const log = mainLog.slice(0, 24);
          log.push(
            Action.bondPurchase({
              nation: Nation.GE,
              player: "Anton",
              cost: 6,
            })
          );
          const game = Imperial.fromLog(log);
          const treasury = game.nations.get(Nation.GE).treasury;

          expect(treasury).toEqual(10);
        });

        test("Anton controls GE", () => {
          const log = mainLog.slice(0, 24);
          log.push(
            Action.bondPurchase({
              nation: Nation.GE,
              player: "Anton",
              cost: 6,
            })
          );
          const game = Imperial.fromLog(log);
          const controller = game.nations.get(Nation.GE).controller;

          expect(controller).toEqual("Anton");
        });
      });
    });

    test("it is now AH's turn", () => {
      const log = mainLog.slice(0, 24);
      log.push(
        Action.bondPurchase({
          nation: Nation.GE,
          player: "Anton",
          cost: 6,
        })
      );
      const game = Imperial.fromLog(log);
      const currentPlayerName = game.nations.get(Nation.AH).controller;

      expect(game.currentPlayerName).toEqual(currentPlayerName);
    });
  });

  describe("second round", () => {
    describe("1. AH does production2", () => {
      const log = mainLog.slice(0, 25);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.AH, cost: 0, slot: "production2" })
      );

      test("vienna and budapest have 1 unit each", () => {
        const viennaArmyCount = game.units.get(Nation.AH).get("vienna").armies;
        const budapestArmyCount = game.units.get(Nation.AH).get("budapest")
          .armies;

        expect(viennaArmyCount).toEqual(1);
        expect(budapestArmyCount).toEqual(1);
      });

      test("AH treasury remains empty", () => {
        const AHTreasury = game.nations.get(Nation.AH).treasury;

        expect(AHTreasury).toEqual(0);
      });
    });

    describe("2. IT does production2", () => {
      const log = mainLog.slice(0, 26);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.IT, cost: 0, slot: "production2" })
      );

      test("rome and naples have 1 unit each", () => {
        const romeArmyCount = game.units.get(Nation.IT).get("rome").armies;
        const naplesFleetCount = game.units.get(Nation.IT).get("naples").fleets;

        expect(romeArmyCount).toEqual(1);
        expect(naplesFleetCount).toEqual(1);
      });
    });

    describe("3. FR does production1", () => {
      const log = mainLog.slice(0, 27);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.FR, cost: 0, slot: "production1" })
      );

      test("bordeaux, marseille, and paris have 1 unit each", () => {
        const bordeauxFleetCount = game.units.get(Nation.FR).get("bordeaux")
          .fleets;
        const marseilleFleetCount = game.units.get(Nation.FR).get("marseille")
          .fleets;
        const parisArmyCount = game.units.get(Nation.FR).get("paris").armies;

        expect(bordeauxFleetCount).toEqual(1);
        expect(marseilleFleetCount).toEqual(1);
        expect(parisArmyCount).toEqual(1);
      });
    });

    describe("4. GB does maneuver1", () => {
      const log = mainLog.slice(0, 28);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.GB, cost: 0, slot: "maneuver1" })
      );

      test("GB's available actions are to move liverpool and london fleets", () => {
        const availableActions = new Set([
          Action.endManeuver(),
          Action.maneuver({
            origin: "liverpool",
            destination: "north atlantic",
          }),
          Action.maneuver({ origin: "london", destination: "english channel" }),
          Action.maneuver({ origin: "london", destination: "north sea" }),
          Action.maneuver({ origin: "london", destination: "north atlantic" }),
        ]);

        expect(game.availableActions).toEqual(availableActions);
      });

      test("north atlantic and english channel have GB flags", () => {
        game.tick(
          Action.maneuver({
            origin: "liverpool",
            destination: "north atlantic",
          })
        );
        game.tick(
          Action.maneuver({ origin: "london", destination: "english channel" })
        );
        const northAtlanticFlag = game.provinces.get("north atlantic").flag;
        const englishChannelFlag = game.provinces.get("english channel").flag;

        expect(northAtlanticFlag).toEqual(Nation.GB);
        expect(englishChannelFlag).toEqual(Nation.GB);
      });
    });

    describe("5. GE does maneuver2", () => {
      const log = mainLog.slice(0, 31);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.GE, cost: 0, slot: "maneuver2" })
      );

      test("GE's available fleet maneuver is hamburg", () => {
        expect(game.availableActions).toEqual(
          new Set([
            Action.endManeuver(),
            Action.maneuver({ origin: "hamburg", destination: "north sea" }),
            Action.maneuver({ origin: "hamburg", destination: "baltic sea" }),
            Action.maneuver({ origin: "berlin", destination: "danzig" }),
            Action.maneuver({ origin: "berlin", destination: "prague" }),
            Action.maneuver({ origin: "berlin", destination: "munich" }),
            Action.maneuver({ origin: "berlin", destination: "cologne" }),
            Action.maneuver({ origin: "berlin", destination: "hamburg" }),
            Action.maneuver({ origin: "berlin", destination: "dijon" }),
            Action.maneuver({ origin: "berlin", destination: "belgium" }),
            Action.maneuver({ origin: "berlin", destination: "holland" }),
            Action.maneuver({ origin: "berlin", destination: "denmark" }),
            Action.maneuver({ origin: "berlin", destination: "vienna" }),
            Action.maneuver({ origin: "berlin", destination: "warsaw" }),
            Action.maneuver({
              origin: "berlin",
              destination: "st. petersburg",
            }),
          ])
        );
      });

      test("GE's available army maneuver is berlin", () => {
        game.tick(
          Action.maneuver({ origin: "hamburg", destination: "north sea" })
        );

        const availableActions = new Set([
          Action.endManeuver(),
          Action.maneuver({ origin: "berlin", destination: "danzig" }),
          Action.maneuver({ origin: "berlin", destination: "prague" }),
          Action.maneuver({ origin: "berlin", destination: "munich" }),
          Action.maneuver({ origin: "berlin", destination: "cologne" }),
          Action.maneuver({ origin: "berlin", destination: "hamburg" }),
          Action.maneuver({ origin: "berlin", destination: "dijon" }),
          Action.maneuver({ origin: "berlin", destination: "belgium" }),
          Action.maneuver({ origin: "berlin", destination: "holland" }),
          Action.maneuver({ origin: "berlin", destination: "denmark" }),
          Action.maneuver({ origin: "berlin", destination: "sheffield" }),
          Action.maneuver({ origin: "berlin", destination: "edinburgh" }),
          Action.maneuver({ origin: "berlin", destination: "norway" }),
          Action.maneuver({ origin: "berlin", destination: "london" }),
          Action.maneuver({ origin: "berlin", destination: "st. petersburg" }),
          Action.maneuver({ origin: "berlin", destination: "warsaw" }),
          Action.maneuver({ origin: "berlin", destination: "vienna" }),
        ]);

        expect(game.availableActions).toEqual(availableActions);
      });

      test("north sea and norway have GE flags", () => {
        game.tick(Action.maneuver({ origin: "berlin", destination: "norway" }));
        const northSeaFlag = game.provinces.get("north sea").flag;
        const norwayFlag = game.provinces.get("norway").flag;

        expect(northSeaFlag).toEqual(Nation.GE);
        expect(norwayFlag).toEqual(Nation.GE);
      });
    });

    describe("6. Russia imports", () => {
      const log = mainLog.slice(0, 34);
      const game = Imperial.fromLog(log);
      game.tick(Action.rondel({ nation: Nation.RU, cost: 0, slot: "import" }));

      xtest("RU can choose where to import", () => {
        const actions = game.availableActions;
        const expected = [
          "moscow",
          "st. petersburg",
          "odessa",
          "kiev",
          "warsaw",
        ].map((province) =>
          Action.import({ placements: [{ province, unit: "army" }] })
        );
        expected.push(
          Action.import({
            placements: [{ province: "st. petersburg", unit: "fleet" }],
          })
        );
        expected.push(
          Action.import({ placements: [{ province: "odessa", unit: "fleet" }] })
        );

        expect(actions).toEqual(new Set(expected));
      });

      describe("Russia imports 1 in St. Petersburg and 2 in Moscow", () => {
        game.tick(
          Action.import({
            placements: [
              { province: "st. petersburg", type: "fleet" },
              { province: "moscow", type: "army" },
              { province: "moscow", type: "army" },
            ],
          })
        );

        test("RU has 1 fleet in st. petersburg and 2 armies in moscow", () => {
          const stPetersburgFleets = game.units
            .get(Nation.RU)
            .get("st. petersburg").fleets;
          const moscowArmies = game.units.get(Nation.RU).get("moscow").armies;

          expect(stPetersburgFleets).toEqual(1);
          expect(moscowArmies).toEqual(2);
        });

        test("RU has 3 million in treasury", () => {
          const treasury = game.nations.get(Nation.RU).treasury;

          expect(treasury).toEqual(3);
        });
      });
    });
  });

  describe("third round", () => {
    describe("1. AH does maneuver2", () => {
      const log = mainLog.slice(0, 37);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver2" })
      );

      test("AH's available fleet maneuver is trieste", () => {
        const availableActions = new Set([
          Action.endManeuver(),
          Action.maneuver({ origin: "trieste", destination: "ionian sea" }),
        ]);
        const landDestinations = [
          "warsaw",
          "kiev",
          "prague",
          "romania",
          "danzig",
          "munich",
          "genoa",
          "venice",
          "berlin",
          "trieste",
          "west balkan",
        ];
        landDestinations.map((province) => {
          availableActions.add(
            Action.maneuver({ origin: "lemberg", destination: province })
          );
          availableActions.add(
            Action.maneuver({ origin: "budapest", destination: province })
          );
          availableActions.add(
            Action.maneuver({ origin: "vienna", destination: province })
          );
        });
        availableActions.add(
          Action.maneuver({ origin: "lemberg", destination: "budapest" })
        );
        availableActions.add(
          Action.maneuver({ origin: "lemberg", destination: "vienna" })
        );
        availableActions.add(
          Action.maneuver({ origin: "budapest", destination: "lemberg" })
        );
        availableActions.add(
          Action.maneuver({ origin: "budapest", destination: "vienna" })
        );
        availableActions.add(
          Action.maneuver({ origin: "vienna", destination: "budapest" })
        );
        availableActions.add(
          Action.maneuver({ origin: "vienna", destination: "lemberg" })
        );

        expect(game.availableActions).toEqual(availableActions);
      });

      test("AH's available army maneuvers are lemberg, budapest, and vienna", () => {
        game.tick(
          Action.maneuver({ origin: "trieste", destination: "ionian sea" })
        );
        const availableActions = new Set([Action.endManeuver()]);
        const landDestinations = [
          "warsaw",
          "kiev",
          "prague",
          "romania",
          "danzig",
          "munich",
          "genoa",
          "venice",
          "berlin",
          "trieste",
          "west balkan",
          "rome",
          "naples",
          "greece",
          "tunis",
        ];
        landDestinations.map((province) => {
          availableActions.add(
            Action.maneuver({ origin: "lemberg", destination: province })
          );
          availableActions.add(
            Action.maneuver({ origin: "budapest", destination: province })
          );
          availableActions.add(
            Action.maneuver({ origin: "vienna", destination: province })
          );
        });
        availableActions.add(
          Action.maneuver({ origin: "lemberg", destination: "budapest" })
        );
        availableActions.add(
          Action.maneuver({ origin: "lemberg", destination: "vienna" })
        );
        availableActions.add(
          Action.maneuver({ origin: "budapest", destination: "lemberg" })
        );
        availableActions.add(
          Action.maneuver({ origin: "budapest", destination: "vienna" })
        );
        availableActions.add(
          Action.maneuver({ origin: "vienna", destination: "lemberg" })
        );
        availableActions.add(
          Action.maneuver({ origin: "vienna", destination: "budapest" })
        );

        expect(game.availableActions).toEqual(availableActions);
      });

      test("ionian sea, romania, west balkan, and tunis have AH flags", () => {
        game.tick(
          Action.maneuver({ origin: "lemberg", destination: "romania" })
        );
        game.tick(
          Action.maneuver({ origin: "budapest", destination: "west balkan" })
        );
        game.tick(Action.maneuver({ origin: "vienna", destination: "tunis" }));

        const ionianSeaFlag = game.provinces.get("ionian sea").flag;
        const romaniaFlag = game.provinces.get("romania").flag;
        const westBalkanFlag = game.provinces.get("west balkan").flag;
        const tunisFlag = game.provinces.get("tunis").flag;

        expect(ionianSeaFlag).toEqual(Nation.AH);
        expect(romaniaFlag).toEqual(Nation.AH);
        expect(westBalkanFlag).toEqual(Nation.AH);
        expect(tunisFlag).toEqual(Nation.AH);
      });
    });

    describe("2. IT does maneuver2", () => {
      const log = mainLog.slice(0, 42);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.IT, cost: 0, slot: "maneuver2" })
      );

      test("IT's available fleet maneuver is naples", () => {
        const availableActions = new Set([
          Action.endManeuver(),
          Action.maneuver({
            origin: "naples",
            destination: "western mediterranean sea",
          }),
          Action.maneuver({
            origin: "naples",
            destination: "ionian sea",
          }),
        ]);
        const landDestinations = [
          "naples",
          "genoa",
          "florence",
          "venice",
          "marseille",
          "vienna",
          "trieste",
        ];
        landDestinations.map((province) => {
          availableActions.add(
            Action.maneuver({ origin: "rome", destination: province })
          );
        });

        expect(game.currentNation).toEqual(Nation.IT);
        expect(game.availableActions).toEqual(availableActions);
      });

      test("IT's available army maneuver is rome", () => {
        game.tick(
          Action.maneuver({
            origin: "naples",
            destination: "western mediterranean sea",
          })
        );
        const availableActions = new Set([Action.endManeuver()]);
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
        landDestinations.map((province) => {
          availableActions.add(
            Action.maneuver({ origin: "rome", destination: province })
          );
        });

        expect(game.availableActions).toEqual(availableActions);
      });

      test("spain and western mediterranean sea have IT flags", () => {
        game.tick(Action.maneuver({ origin: "rome", destination: "spain" }));
        const westernMediterraneanSeaFlag = game.provinces.get(
          "western mediterranean sea"
        ).flag;
        const spainFlag = game.provinces.get("spain").flag;

        expect(westernMediterraneanSeaFlag).toEqual(Nation.IT);
        expect(spainFlag).toEqual(Nation.IT);
      });
    });

    describe("3. FR does maneuver1", () => {
      const log = mainLog.slice(0, 45);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.FR, cost: 0, slot: "maneuver1" })
      );

      test("FR's available fleet maneuvers are bordeaux and marseille", () => {
        const availableActions = new Set([
          Action.endManeuver(),
          Action.maneuver({
            origin: "bordeaux",
            destination: "bay of biscay",
          }),
          Action.maneuver({
            origin: "marseille",
            destination: "western mediterranean sea",
          }),
        ]);
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
        landDestinations.map((province) => {
          availableActions.add(
            Action.maneuver({ origin: "paris", destination: province })
          );
        });

        expect(game.availableActions).toEqual(availableActions);
      });

      test("IT controller (Anton) can choose whether to fight or allow FR fleet to coexist in western mediterranean sea", () => {
        game.tick(
          Action.maneuver({
            origin: "marseille",
            destination: "western mediterranean sea",
          })
        );
        const expectedActions = [
          Action.coexist({
            province: "western mediterranean sea",
            incumbent: Nation.IT,
            challenger: Nation.FR,
          }),
          Action.fight({
            province: "western mediterranean sea",
            incumbent: Nation.IT,
            challenger: Nation.FR,
          }),
        ];

        expect(game.availableActions).toEqual(new Set(expectedActions));
      });

      test("IT chooses to fight so both fleets get removed", () => {
        game.tick(
          Action.fight({
            province: "western mediterranean sea",
            incumbent: Nation.IT,
            challenger: Nation.FR,
          })
        );
        const westernMed = game.provinces.get("western mediterranean sea");

        expect(
          game.units.get(Nation.IT).get("western mediterranean sea").fleets
        ).toEqual(0);
        expect(
          game.units.get(Nation.FR).get("western mediterranean sea").fleets
        ).toEqual(0);
        expect(westernMed.flag).toEqual(Nation.IT);
      });

      test("FR's available army maneuver is paris", () => {
        game.tick(
          Action.maneuver({
            origin: "bordeaux",
            destination: "bay of biscay",
          })
        );
        const landDestinations = [
          "brest",
          "dijon",
          "belgium",
          "munich",
          "bordeaux",
          "marseille",
          "genoa",
          "spain",
          "portugal",
          "morocco",
        ];
        const availableActions = new Set([Action.endManeuver()]);
        landDestinations.map((province) => {
          availableActions.add(
            Action.maneuver({ origin: "paris", destination: province })
          );
        });

        expect(game.availableActions).toEqual(availableActions);
      });

      test("Morocco and bay of biscay have FR flags", () => {
        game.tick(
          Action.maneuver({
            origin: "paris",
            destination: "morocco",
          })
        );

        expect(game.units.get(Nation.FR).get("bay of biscay").fleets).toEqual(
          1
        );
        expect(game.provinces.get("bay of biscay").flag).toEqual(Nation.FR);
        expect(game.units.get(Nation.FR).get("morocco").armies).toEqual(1);
        expect(game.provinces.get("morocco").flag).toEqual(Nation.FR);
      });
    });

    describe("4. GB invests", () => {
      const log = mainLog.slice(0, 50);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.GB, cost: 0, slot: "investor" })
      );

      test("GB has 6 million left in the treasury", () => {
        const treasury = game.nations.get(Nation.GB).treasury;

        expect(treasury).toEqual(6);
      });

      test("Bert (GB's controller and investor-card holder) has 9 million in cash", () => {
        const controller = game.nations.get(Nation.GB).controller;
        const cash = game.players[controller].cash;

        expect(cash).toEqual(9);
      });

      test("Bert can buy a bond", () => {
        const expectedActions = [
          Action.bondPurchase({ nation: Nation.AH, player: "Bert", cost: 4 }),
          Action.bondPurchase({ nation: Nation.AH, player: "Bert", cost: 6 }),
          Action.bondPurchase({ nation: Nation.AH, player: "Bert", cost: 9 }),
          Action.bondPurchase({ nation: Nation.IT, player: "Bert", cost: 2 }),
          Action.bondPurchase({ nation: Nation.IT, player: "Bert", cost: 4 }),
          Action.bondPurchase({ nation: Nation.IT, player: "Bert", cost: 6 }),
          Action.bondPurchase({ nation: Nation.FR, player: "Bert", cost: 4 }),
          Action.bondPurchase({ nation: Nation.FR, player: "Bert", cost: 6 }),
          Action.bondPurchase({ nation: Nation.GB, player: "Bert", cost: 4 }),
          Action.bondPurchase({ nation: Nation.GB, player: "Bert", cost: 6 }),
          Action.bondPurchase({ nation: Nation.GB, player: "Bert", cost: 12 }),
          Action.bondPurchase({ nation: Nation.GB, player: "Bert", cost: 16 }),
          Action.bondPurchase({ nation: Nation.GE, player: "Bert", cost: 2 }),
          Action.bondPurchase({ nation: Nation.GE, player: "Bert", cost: 9 }),
          Action.bondPurchase({ nation: Nation.RU, player: "Bert", cost: 4 }),
          Action.bondPurchase({ nation: Nation.RU, player: "Bert", cost: 6 }),
        ];

        expect(game.availableActions).toEqual(new Set(expectedActions));
      });

      describe("Investor-card holder (Bert) buys the 6 million bond of RU", () => {
        test("Bert has 3 million", () => {
          game.tick(
            Action.bondPurchase({ nation: Nation.RU, player: "Bert", cost: 6 })
          );
          const cash = game.players["Bert"].cash;

          expect(cash).toEqual(3);
        });

        test("RU treasury has 9 million", () => {
          const treasury = game.nations.get(Nation.RU).treasury;

          expect(treasury).toEqual(9);
        });
      });
    });

    describe("5. GE does taxation", () => {
      const log = mainLog.slice(0, 52);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.GE, cost: 0, slot: "taxation" })
      );

      xtest("GE moves to the taxation slot", () => {
        const expected = rondelSlots.map((slot) =>
          Action.rondel({ nation: Nation.RU, cost: 0, slot })
        );

        expect(game.availableActions).toEqual(new Set(expected));
      });

      describe("consequences", () => {
        test("GE has 14 million in its treasury", () => {
          const treasury = game.nations.get(Nation.GE).treasury;

          expect(treasury).toEqual(14);
        });

        test("GE moves up one field on tax chart", () => {
          const taxChartPosition = game.nations.get(Nation.GE).taxChartPosition;

          expect(taxChartPosition).toEqual(6);
        });

        test("GE receives 1 power point", () => {
          const powerPoints = game.nations.get(Nation.GE).powerPoints;

          expect(powerPoints).toEqual(1);
        });

        test("Anton has 4 million cash", () => {
          const cash = game.players["Anton"].cash;

          expect(cash).toEqual(4);
        });
      });
    });

    describe("6. RU does production2", () => {
      const log = mainLog.slice(0, 53);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.RU, cost: 0, slot: "production2" })
      );

      test("Odessa and Moscow have units", () => {
        const odessaFleetCount = game.units.get(Nation.RU).get("odessa").fleets;
        const moscowArmyCount = game.units.get(Nation.RU).get("moscow").armies;

        expect(odessaFleetCount).toEqual(1);
        expect(moscowArmyCount).toEqual(3);
      });
    });
  });

  describe("fourth round", () => {
    describe("1. AH does taxation", () => {
      const log = mainLog.slice(0, 53);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.AH, cost: 0, slot: "taxation" })
      );

      xtest("AH moves to the taxation slot", () => {
        const expected = rondelSlots.map((slot) =>
          Action.rondel({ nation: Nation.IT, cost: 0, slot })
        );

        expect(game.availableActions).toEqual(new Set(expected));
      });

      describe("consequences", () => {
        test("AH has 4 million in its treasury", () => {
          const treasury = game.nations.get(Nation.AH).treasury;

          expect(treasury).toEqual(4);
        });

        test("AH moves up to position 8 on the tax chart", () => {
          const taxChartPosition = game.nations.get(Nation.AH).taxChartPosition;

          expect(taxChartPosition).toEqual(8);
        });

        test("AH receives 3 power points", () => {
          const powerPoints = game.nations.get(Nation.AH).powerPoints;

          expect(powerPoints).toEqual(3);
        });

        test("Claudia has 5 million cash", () => {
          const cash = game.players["Claudia"].cash;

          expect(cash).toEqual(5);
        });
      });
    });

    describe("2. IT does production1", () => {
      const log = mainLog.slice(0, 54);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.IT, cost: 0, slot: "production1" })
      );

      test("Rome and Naples have units", () => {
        const romeArmyCount = game.units.get(Nation.IT).get("rome").armies;
        const naplesFleetCount = game.units.get(Nation.IT).get("naples").fleets;

        expect(romeArmyCount).toEqual(1);
        expect(naplesFleetCount).toEqual(1);
      });
    });

    describe("3. FR does production2", () => {
      const log = mainLog.slice(0, 56);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.FR, cost: 0, slot: "production2" })
      );

      test("Bordeaux, Marseille and Paris have units", () => {
        const bordeauxFleetCount = game.units.get(Nation.FR).get("bordeaux")
          .fleets;
        const marseilleFleetCount = game.units.get(Nation.FR).get("marseille")
          .fleets;
        const parisArmyCount = game.units.get(Nation.FR).get("paris").armies;

        expect(bordeauxFleetCount).toEqual(1);
        expect(marseilleFleetCount).toEqual(1);
        expect(parisArmyCount).toEqual(1);
      });

      describe("investor card is activated", () => {
        test("Claudia (investor card owner) starts the turn with 7 million", () => {
          const cash = game.players["Claudia"].cash;

          expect(cash).toEqual(7);
        });

        test("Claudia can buy a bond", () => {
          const expectedActions = new Set([
            Action.bondPurchase({
              nation: Nation.AH,
              player: "Claudia",
              cost: 4,
            }),
            Action.bondPurchase({
              nation: Nation.AH,
              player: "Claudia",
              cost: 6,
            }),
            Action.bondPurchase({
              nation: Nation.IT,
              player: "Claudia",
              cost: 2,
            }),
            Action.bondPurchase({
              nation: Nation.IT,
              player: "Claudia",
              cost: 4,
            }),
            Action.bondPurchase({
              nation: Nation.IT,
              player: "Claudia",
              cost: 6,
            }),
            Action.bondPurchase({
              nation: Nation.FR,
              player: "Claudia",
              cost: 4,
            }),
            Action.bondPurchase({
              nation: Nation.FR,
              player: "Claudia",
              cost: 6,
            }),
            Action.bondPurchase({
              nation: Nation.GB,
              player: "Claudia",
              cost: 4,
            }),
            Action.bondPurchase({
              nation: Nation.GB,
              player: "Claudia",
              cost: 6,
            }),
            Action.bondPurchase({
              nation: Nation.GE,
              player: "Claudia",
              cost: 2,
            }),
            Action.bondPurchase({
              nation: Nation.RU,
              player: "Claudia",
              cost: 4,
            }),
          ]);
          expect(game.availableActions).toEqual(expectedActions);
        });

        describe("Claudia buys a 6 million AH bond", () => {
          test("Claudia has 1 million in cash", () => {
            game.tick(
              Action.bondPurchase({
                nation: Nation.AH,
                player: "Claudia",
                cost: 6,
              })
            );
            const cash = game.players["Claudia"].cash;

            expect(cash).toEqual(1);
          });

          test("Claudia has the #3 AH bond", () => {
            const bonds = game.players["Claudia"].bonds;

            expect(bonds).toEqual(
              new Set([
                Bond(Nation.AH, 1),
                Bond(Nation.FR, 4),
                Bond(Nation.AH, 3),
              ])
            );
          });
        });

        test("Daniel is the investor card owner", () => {
          expect(game.investorCardHolder).toEqual("Daniel");
        });
      });
    });

    describe("4. GB does production2", () => {
      const log = mainLog.slice(0, 56);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.GB, cost: 0, slot: "production2" })
      );

      test("London and Liverpool have GB fleets", () => {
        const londonFleetCount = game.units.get(Nation.GB).get("london").fleets;
        const liverpoolFleetCount = game.units.get(Nation.GB).get("liverpool")
          .fleets;

        expect(londonFleetCount).toEqual(1);
        expect(liverpoolFleetCount).toEqual(1);
      });
    });

    describe("5. GE builds a factory", () => {
      const log = mainLog.slice(0, 57);
      const game = Imperial.fromLog(log);
      game.tick(Action.rondel({ nation: Nation.GE, cost: 0, slot: "factory" }));

      test("GE can choose where to build the factory", () => {
        const expected = new Set(
          ["danzig", "munich", "cologne"].map((province) =>
            Action.buildFactory({ province })
          )
        );
        expect(game.availableActions).toEqual(expected);
      });

      describe("GE builds a factory in Cologne", () => {
        game.tick(Action.buildFactory({ province: "cologne" }));

        test("Cologne has a factory", () => {
          const factory = game.provinces.get("cologne").factory;

          expect(factory).toEqual("armaments");
        });

        test("GE has 9 treasury", () => {
          const treasury = game.nations.get(Nation.GE).treasury;

          expect(treasury).toEqual(9);
        });
      });
    });

    describe("6. RU does maneuver2", () => {
      const log = mainLog.slice(0, 59);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.RU, cost: 0, slot: "maneuver2" })
      );

      test("RU's available fleet maneuvers are st. petersburg and odessa", () => {
        const availableActions = new Set([
          Action.endManeuver(),
          Action.maneuver({
            origin: "st. petersburg",
            destination: "baltic sea",
          }),
          Action.maneuver({
            origin: "odessa",
            destination: "black sea",
          }),
        ]);
        const landDestinations = [
          "warsaw",
          "odessa",
          "kiev",
          "st. petersburg",
          "danzig",
          "prague",
          "lemberg",
          "romania",
        ];
        landDestinations.map((province) => {
          availableActions.add(
            Action.maneuver({ origin: "moscow", destination: province })
          );
        });

        expect(game.availableActions).toEqual(availableActions);
      });

      test("RU's available army maneuver is moscow (x3)", () => {
        game.tick(
          Action.maneuver({
            origin: "st. petersburg",
            destination: "baltic sea",
          })
        );
        game.tick(
          Action.maneuver({
            origin: "odessa",
            destination: "black sea",
          })
        );
        const availableActions = new Set([Action.endManeuver()]);
        const landDestinations = [
          "warsaw",
          "odessa",
          "kiev",
          "st. petersburg",
          "danzig",
          "prague",
          "lemberg",
          "romania",
          "bulgaria",
          "turkey",
          "sweden",
          "berlin",
          "hamburg",
          "denmark",
          "norway",
        ];
        landDestinations.map((province) => {
          availableActions.add(
            Action.maneuver({ origin: "moscow", destination: province })
          );
        });

        expect(game.availableActions).toEqual(availableActions);
      });

      test("Sweden, Baltic Sea, Black Sea, and Turkey have RU flags", () => {
        game.tick(
          Action.maneuver({
            origin: "moscow",
            destination: "sweden",
          })
        );
        game.tick(
          Action.maneuver({
            origin: "moscow",
            destination: "turkey",
          })
        );
        game.tick(
          Action.maneuver({
            origin: "moscow",
            destination: "lemberg",
          })
        );
        const balticSeaFlag = game.provinces.get("baltic sea").flag;
        const swedenFlag = game.provinces.get("sweden").flag;
        const blackSeaFlag = game.provinces.get("black sea").flag;
        const turkeyFlag = game.provinces.get("turkey").flag;

        expect(balticSeaFlag).toEqual(Nation.RU);
        expect(swedenFlag).toEqual(Nation.RU);
        expect(blackSeaFlag).toEqual(Nation.RU);
        expect(turkeyFlag).toEqual(Nation.RU);
      });
    });
  });

  describe("fifth round", () => {
    describe("1. AH does maneuver1", () => {
      const log = mainLog.slice(0, 65);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver1" })
      );

      test("AH's available fleet maneuver is ionian sea", () => {
        const availableActions = new Set([
          Action.endManeuver(),
          Action.maneuver({
            origin: "ionian sea",
            destination: "western mediterranean sea",
          }),
          Action.maneuver({
            origin: "ionian sea",
            destination: "eastern mediterranean sea",
          }),
        ]);
        const romaniaDestinations = [
          "odessa",
          "kiev",
          "lemberg",
          "budapest",
          "bulgaria",
          "west balkan",
        ];
        romaniaDestinations.map((province) => {
          availableActions.add(
            Action.maneuver({ origin: "romania", destination: province })
          );
        });
        const westBalkanDestinations = [
          "greece",
          "bulgaria",
          "romania",
          "trieste",
          "budapest",
        ];
        westBalkanDestinations.map((province) => {
          availableActions.add(
            Action.maneuver({ origin: "west balkan", destination: province })
          );
        });
        availableActions.add(
          Action.maneuver({ origin: "tunis", destination: "algeria" })
        );

        expect(game.currentNation).toEqual(Nation.AH);
        expect(game.availableActions).toEqual(availableActions);
      });

      test("AH's available army maneuvers are Tunis, West Balkan, and Romania", () => {
        game.tick(
          Action.maneuver({
            origin: "ionian sea",
            destination: "western mediterranean sea",
          })
        );
        const availableActions = new Set([Action.endManeuver()]);
        const romaniaDestinations = [
          "odessa",
          "bulgaria",
          "west balkan",
          "budapest",
          "lemberg",
          "kiev",
        ];
        romaniaDestinations.map((province) => {
          availableActions.add(
            Action.maneuver({ origin: "romania", destination: province })
          );
        });
        const westBalkanDestinations = [
          "greece",
          "bulgaria",
          "romania",
          "trieste",
          "budapest",
        ];
        westBalkanDestinations.map((province) => {
          availableActions.add(
            Action.maneuver({ origin: "west balkan", destination: province })
          );
        });
        const tunisDestinations = [
          "algeria",
          "florence",
          "rome",
          "naples",
          "genoa",
          "marseille",
          "spain",
        ];
        tunisDestinations.map((province) => {
          availableActions.add(
            Action.maneuver({ origin: "tunis", destination: province })
          );
        });

        expect(game.availableActions).toEqual(availableActions);
      });

      test("Algeria, Bulgaria, and Western Mediterranean have AH flags", () => {
        game.tick(Action.maneuver({ origin: "tunis", destination: "algeria" }));
        game.tick(
          Action.maneuver({ origin: "west balkan", destination: "bulgaria" })
        );
        game.tick(
          Action.maneuver({ origin: "romania", destination: "odessa" })
        );
        const westernMediterraneanSeaFlag = game.provinces.get(
          "western mediterranean sea"
        ).flag;
        const algeriaFlag = game.provinces.get("algeria").flag;
        const bulgariaFlag = game.provinces.get("bulgaria").flag;

        expect(westernMediterraneanSeaFlag).toEqual(Nation.AH);
        expect(algeriaFlag).toEqual(Nation.AH);
        expect(bulgariaFlag).toEqual(Nation.AH);
      });
    });

    describe("2. IT invests", () => {
      const log = mainLog.slice(0, 69);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.IT, cost: 0, slot: "investor" })
      );

      test("IT has 1 left in the treasury", () => {
        const treasury = game.nations.get(Nation.IT).treasury;

        expect(treasury).toEqual(1);
      });

      test("Anton (IT's controller) has 8 million in cash", () => {
        const controller = game.nations.get(Nation.IT).controller;
        const cash = game.players[controller].cash;

        expect(cash).toEqual(8);
      });

      describe("investor card is activated", () => {
        test("Daniel (investor card holder) has 6 million in cash", () => {
          const cash = game.players[game.investorCardHolder].cash;

          expect(cash).toEqual(6);
        });

        test("Daniel can buy a bond", () => {
          const expectedActions = new Set([
            Action.bondPurchase({
              nation: Nation.AH,
              player: "Daniel",
              cost: 4,
            }),
            Action.bondPurchase({
              nation: Nation.IT,
              player: "Daniel",
              cost: 2,
            }),
            Action.bondPurchase({
              nation: Nation.IT,
              player: "Daniel",
              cost: 4,
            }),
            Action.bondPurchase({
              nation: Nation.IT,
              player: "Daniel",
              cost: 6,
            }),
            Action.bondPurchase({
              nation: Nation.FR,
              player: "Daniel",
              cost: 4,
            }),
            Action.bondPurchase({
              nation: Nation.FR,
              player: "Daniel",
              cost: 6,
            }),
            Action.bondPurchase({
              nation: Nation.GB,
              player: "Daniel",
              cost: 4,
            }),
            Action.bondPurchase({
              nation: Nation.GB,
              player: "Daniel",
              cost: 6,
            }),
            Action.bondPurchase({
              nation: Nation.GE,
              player: "Daniel",
              cost: 2,
            }),
            Action.bondPurchase({
              nation: Nation.GE,
              player: "Daniel",
              cost: 9,
            }),
            Action.bondPurchase({
              nation: Nation.RU,
              player: "Daniel",
              cost: 4,
            }),
            Action.bondPurchase({
              nation: Nation.RU,
              player: "Daniel",
              cost: 12,
            }),
          ]);

          expect(game.availableActions).toEqual(expectedActions);
        });

        test("Daniel has a 9 million GE bond and does not have a 4 million GE bond", () => {
          game.tick(
            Action.bondPurchase({
              nation: Nation.GE,
              player: "Daniel",
              cost: 9,
            })
          );
          const expectedBonds = new Set([
            Bond(Nation.FR, 1),
            Bond(Nation.RU, 4),
            Bond(Nation.GE, 4),
          ]);

          expect(game.players["Daniel"].bonds).toEqual(expectedBonds);
        });

        test("Daniel has 1 million in cash", () => {
          const cash = game.players["Daniel"].cash;

          expect(cash).toEqual(1);
        });

        test("GE has 14 million in treasury", () => {
          const treasury = game.nations.get(Nation.GE).treasury;

          expect(treasury).toEqual(14);
        });

        test("Daniel controls GE", () => {
          const controller = game.nations.get(Nation.GE).controller;

          expect(controller).toEqual("Daniel");
        });

        test("Anton holds the investor card", () => {
          expect(game.investorCardHolder).toEqual("Anton");
        });
      });
    });
  });
});

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
              unitCount: 0,
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
              unitCount: 0,
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
              unitCount: 0,
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
              unitCount: 0,
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
              unitCount: 0,
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
              unitCount: 0,
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
      test("AH moved to the import slot", () => {
        const log = mainLog.slice(0, 14);
        log.push(Action.rondel({ nation: Nation.AH, cost: 0, slot: "import" }));
        const game = Imperial.fromLog(log);
        const expectedActions = [
          "vienna",
          "budapest",
          "prague",
          "lemberg",
          "trieste",
        ].map((province) => Action.import({ province }));

        expect(game.availableActions).toEqual(new Set(expectedActions));
      });

      test("AH's treasury is empty and Trieste & Lemberg have units", () => {
        const log = mainLog.slice(0, 15);
        log.push(
          Action.import({ province: "trieste" }),
          Action.import({ province: "lemberg" })
        );
        const game = Imperial.fromLog(log);
        const treasury = game.nations.get(Nation.AH).treasury;
        const triesteUnitCount = game.provinces.get("trieste").unitCount;
        const lembergUnitCount = game.provinces.get("lemberg").unitCount;

        expect(treasury).toEqual(0);
        expect(triesteUnitCount).toEqual(1);
        expect(lembergUnitCount).toEqual(1);
      });

      test("it is now IT's turn", () => {
        const log = mainLog.slice(0, 15);
        log.push(
          Action.import({ province: "trieste" }),
          Action.import({ province: "lemberg" })
        );
        const game = Imperial.fromLog(log);
        const currentPlayerName = game.getController(Nation.IT);

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

      test("it is still IT's turn", () => {
        const log = mainLog.slice(0, 17);
        log.push(
          Action.rondel({ nation: Nation.IT, cost: 0, slot: "investor" })
        );
        const game = Imperial.fromLog(log);
        const currentPlayerName = game.getController(Nation.IT);

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
        const currentPlayerName = game.getController(Nation.FR);

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
        const hasFactory = game.provinces.get("marseille").hasFactory;

        expect(hasFactory).toEqual(true);
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
        const parisFactory = game.provinces.get("paris").hasFactory;
        const bordeauxFactory = game.provinces.get("bordeaux").hasFactory;

        expect(parisFactory).toEqual(true);
        expect(bordeauxFactory).toEqual(true);
      });

      test("it is now GB's turn", () => {
        const log = mainLog.slice(0, 20);
        log.push(Action.buildFactory({ province: "marseille" }));
        const game = Imperial.fromLog(log);
        const currentPlayerName = game.getController(Nation.GB);

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
        const londonUnitCount = game.provinces.get("london").unitCount;
        const liverpoolUnitCount = game.provinces.get("liverpool").unitCount;

        expect(londonUnitCount).toEqual(1);
        expect(liverpoolUnitCount).toEqual(1);
      });

      test("it is now GE's turn", () => {
        const log = mainLog.slice(0, 21);
        log.push(
          Action.rondel({ nation: Nation.GB, cost: 0, slot: "production1" })
        );
        const game = Imperial.fromLog(log);
        const currentPlayerName = game.getController(Nation.GE);

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
        const berlinUnitCount = game.provinces.get("berlin").unitCount;
        const hamburgUnitCount = game.provinces.get("hamburg").unitCount;

        expect(berlinUnitCount).toEqual(1);
        expect(hamburgUnitCount).toEqual(1);
      });

      test("it is now RU's turn", () => {
        const log = mainLog.slice(0, 22);
        log.push(
          Action.rondel({ nation: Nation.GE, cost: 0, slot: "production2" })
        );
        const game = Imperial.fromLog(log);
        const currentPlayerName = game.getController(Nation.RU);

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
      const currentPlayerName = game.getController(Nation.AH);

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
        const viennaUnitCount = game.provinces.get("vienna").unitCount;
        const budapestUnitCount = game.provinces.get("budapest").unitCount;

        expect(viennaUnitCount).toEqual(1);
        expect(budapestUnitCount).toEqual(1);
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
        const romeUnitCount = game.provinces.get("rome").unitCount;
        const naplesUnitCount = game.provinces.get("naples").unitCount;

        expect(romeUnitCount).toEqual(1);
        expect(naplesUnitCount).toEqual(1);
      });
    });

    describe("3. FR does production1", () => {
      const log = mainLog.slice(0, 27);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.FR, cost: 0, slot: "production1" })
      );

      test("bordeaux, marseille, and paris have 1 unit each", () => {
        const bordeauxUnitCount = game.provinces.get("bordeaux").unitCount;
        const marseilleUnitCount = game.provinces.get("marseille").unitCount;
        const parisUnitCount = game.provinces.get("paris").unitCount;

        expect(bordeauxUnitCount).toEqual(1);
        expect(marseilleUnitCount).toEqual(1);
        expect(parisUnitCount).toEqual(1);
      });
    });

    describe("4. GB does maneuver1", () => {
      const log = mainLog.slice(0, 28);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.GB, cost: 0, slot: "maneuver1" })
      );

      test("GB's available actions are to move liverpool and london units", () => {
        const availableActions = new Set([
          Action.maneuver({
            origin: "liverpool",
            destination: "north atlantic",
          }),
          Action.maneuver({ origin: "london", destination: "english channel" }),
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

      test("GE's available actions are to move hamburg and berlin units", () => {
        const availableActions = new Set([
          Action.maneuver({ origin: "hamburg", destination: "north sea" }),
          Action.maneuver({ origin: "berlin", destination: "danzig" }),
          Action.maneuver({ origin: "berlin", destination: "prague" }),
          Action.maneuver({ origin: "berlin", destination: "munich" }),
          Action.maneuver({ origin: "berlin", destination: "cologne" }),
          Action.maneuver({ origin: "berlin", destination: "hamburg" }),
          Action.maneuver({ origin: "berlin", destination: "dijon" }),
          Action.maneuver({ origin: "berlin", destination: "belgium" }),
          Action.maneuver({ origin: "berlin", destination: "holland" }),
          Action.maneuver({ origin: "berlin", destination: "denmark" }),
          Action.maneuver({ origin: "berlin", destination: "london" }),
          Action.maneuver({ origin: "berlin", destination: "sheffield" }),
          Action.maneuver({ origin: "berlin", destination: "edinburgh" }),
          Action.maneuver({ origin: "berlin", destination: "norway" }),
        ]);

        expect(game.availableActions).toEqual(availableActions);
      });

      test("north sea and norway have GE flags", () => {
        game.tick(
          Action.maneuver({ origin: "hamburg", destination: "north sea" })
        );
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

      test("RU can choose where to import", () => {
        const actions = game.availableActions;
        const expected = [
          "moscow",
          "st. petersburg",
          "odessa",
          "kiev",
          "warsaw",
        ].map((province) => Action.import({ province }));

        expect(actions).toEqual(new Set(expected));
      });

      describe("Russia imports 1 in St. Petersburg and 2 in Moscow", () => {
        game.tick(Action.import({ province: "st. petersburg" }));
        game.tick(Action.import({ province: "moscow" }));
        game.tick(Action.import({ province: "moscow" }));

        test("RU has 1 unit in st. petersburg and 2 units in moscow", () => {
          const stPetersburgUnits = game.provinces.get("st. petersburg")
            .unitCount;
          const moscowUnits = game.provinces.get("moscow").unitCount;

          expect(stPetersburgUnits).toEqual(1);
          expect(moscowUnits).toEqual(2);
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

      test("AH's available actions are to move trieste, lemberg, budapest, and vienna", () => {
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
          lembergActions.push(
            Action.maneuver({ origin: "lemberg", destination: province })
          );
          budapestActions.push(
            Action.maneuver({ origin: "budapest", destination: province })
          );
          viennaActions.push(
            Action.maneuver({ origin: "vienna", destination: province })
          );
        });

        const availableActions = new Set([
          ...lembergActions,
          Action.maneuver({ origin: "trieste", destination: "ionian sea" }),
          ...viennaActions,
          ...budapestActions,
        ]);
        expect(game.availableActions).toEqual(availableActions);
      });

      test("ionian sea, romania, west balkan, and tunis have AH flags", () => {
        game.tick(
          Action.maneuver({ origin: "trieste", destination: "ionian sea" })
        );
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

      test("IT's available actions are to move naples and rome", () => {
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
          romeActions.push(
            Action.maneuver({ origin: "rome", destination: province })
          );
        });

        const availableActions = new Set([
          Action.maneuver({
            origin: "naples",
            destination: "western mediterranean sea",
          }),
          ...romeActions,
        ]);
        expect(game.availableActions).toEqual(availableActions);
      });

      test("spain and western mediterranean sea have IT flags", () => {
        game.tick(
          Action.maneuver({
            origin: "naples",
            destination: "western mediterranean sea",
          })
        );
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

      test("FR's available actions are to move bordeaux, marseille, and paris", () => {
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
          parisActions.push(
            Action.maneuver({ origin: "paris", destination: province })
          );
        });
        const availableActions = new Set([
          Action.maneuver({
            origin: "bordeaux",
            destination: "bay of biscay",
          }),
          Action.maneuver({
            origin: "marseille",
            destination: "western mediterranean sea",
          }),
          ...parisActions,
        ]);

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
          ,
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

        expect(westernMed.unitCount).toEqual(0);
        expect(westernMed.flag).toEqual(Nation.IT);
      });

      test("Morocco and bay of biscay have FR flags", () => {
        game.tick(
          Action.maneuver({
            origin: "marseille",
            destination: "western mediterranean sea",
          })
        );
        game.tick(
          Action.fight({
            province: "western mediterranean sea",
            incumbent: Nation.IT,
            challenger: Nation.FR,
          })
        );
        game.tick(
          Action.maneuver({
            origin: "bordeaux",
            destination: "bay of biscay",
          })
        );
        game.tick(
          Action.maneuver({
            origin: "paris",
            destination: "morocco",
          })
        );

        expect(game.provinces.get("bay of biscay").unitCount).toEqual(1);
        expect(game.provinces.get("bay of biscay").flag).toEqual(Nation.FR);
        expect(game.provinces.get("morocco").unitCount).toEqual(1);
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

      test("GE moves to the taxation slot", () => {
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
      const log = mainLog.slice(0, 52);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.RU, cost: 0, slot: "production2" })
      );

      test("Odessa and Moscow have units", () => {
        const odessaUnitCount = game.provinces.get("odessa").unitCount;
        const moscowUnitCount = game.provinces.get("moscow").unitCount;

        expect(odessaUnitCount).toEqual(1);
        expect(moscowUnitCount).toEqual(3);
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

      test("AH moves to the taxation slot", () => {
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
        const romeUnitCount = game.provinces.get("rome").unitCount;
        const naplesUnitCount = game.provinces.get("naples").unitCount;

        expect(romeUnitCount).toEqual(1);
        expect(naplesUnitCount).toEqual(1);
      });
    });

    describe("3. FR does production2", () => {
      const log = mainLog.slice(0, 56);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.FR, cost: 0, slot: "production2" })
      );

      test("Bordeaux, Marseille and Paris have units", () => {
        const bordeauxUnitCount = game.provinces.get("bordeaux").unitCount;
        const marseilleUnitCount = game.provinces.get("marseille").unitCount;
        const parisUnitCount = game.provinces.get("paris").unitCount;

        expect(bordeauxUnitCount).toEqual(1);
        expect(marseilleUnitCount).toEqual(1);
        expect(parisUnitCount).toEqual(1);
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

      test("London and Liverpool have units", () => {
        const londonUnitCount = game.provinces.get("london").unitCount;
        const liverpoolUnitCount = game.provinces.get("liverpool").unitCount;

        expect(londonUnitCount).toEqual(1);
        expect(liverpoolUnitCount).toEqual(1);
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
          const hasFactory = game.provinces.get("cologne").hasFactory;

          expect(hasFactory).toEqual(true);
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

      test("RU's available actions are to move st. petersburg, odessa, and moscow (x3)", () => {
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
        ];
        let moscowActions = [];
        landDestinations.map((province) => {
          moscowActions.push(
            Action.maneuver({ origin: "moscow", destination: province })
          );
        });

        const availableActions = new Set([
          Action.maneuver({
            origin: "st. petersburg",
            destination: "baltic sea",
          }),
          Action.maneuver({
            origin: "odessa",
            destination: "black sea",
          }),
          ...moscowActions,
        ]);
        expect(game.availableActions).toEqual(availableActions);
      });

      test("Sweden, Baltic Sea, Black Sea, and Turkey have RU flags", () => {
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

      test("AH's available actions are to move Tunis, Ionian Sea, West Balkan, and Romania", () => {
        const sharedLandDestinations = [
          "trieste",
          "vienna",
          "budapest",
          "lemberg",
          "prague",
        ];
        const romaniaDestinations = [
          ...sharedLandDestinations,
          "odessa",
          "bulgaria",
          "west balkan",
        ];
        const romaniaActions = [];
        romaniaDestinations.map((province) => {
          romaniaActions.push(
            Action.maneuver({ origin: "romania", destination: province })
          );
        });
        const westBalkanDestinations = [
          ...sharedLandDestinations,
          "greece",
          "bulgaria",
          "romania",
          "tunis",
          "naples",
          "rome",
          "venice",
        ];
        const westBalkanActions = [];
        westBalkanDestinations.map((province) => {
          westBalkanActions.push(
            Action.maneuver({ origin: "west balkan", destination: province })
          );
        });
        const tunisDestinations = [
          ...sharedLandDestinations,
          "algeria",
          "greece",
          "west balkan",
          "venice",
          "rome",
          "naples",
        ];
        const tunisActions = [];
        tunisDestinations.map((province) => {
          tunisActions.push(
            Action.maneuver({ origin: "tunis", destination: province })
          );
        });
        const availableActions = new Set([
          Action.maneuver({
            origin: "ionian sea",
            destination: "western mediterranean sea",
          }),
          Action.maneuver({
            origin: "ionian sea",
            destination: "eastern mediterranean sea",
          }),
          ...romaniaActions,
          ...westBalkanActions,
          ...tunisActions,
        ]);

        expect(game.availableActions).toEqual(availableActions);
      });

      test("Algeria, Bulgaria, and Western Mediterranean have AH flags", () => {
        game.tick(
          Action.maneuver({
            origin: "ionian sea",
            destination: "western mediterranean sea",
          })
        );
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

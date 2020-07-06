import { Nation } from "./constants";
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
    test("All players receive 13 million", () => {
      const log = [
        Action.playerSeating({ order: ["Daniel", "Claudia", "Bert", "Anton"] }),
      ];
      ["Daniel", "Claudia", "Bert", "Anton"].forEach((player) => {
        const cash = Imperial.fromLog(log).state.players[player].cash;
        expect(cash).toEqual(13);
      });
    });

    test("players are assigned their starting nations", () => {
      const log = mainLog.slice(0, 1);
      log.push(
        Action.assignStartingNation({ nation: Nation.RU, player: "Daniel" }),
        Action.assignStartingNation({ nation: Nation.FR, player: "Claudia" }),
        Action.assignStartingNation({ nation: Nation.GB, player: "Bert" }),
        Action.assignStartingNation({ nation: Nation.IT, player: "Anton" })
      );
      const game = Imperial.fromLog(log);
      const russiaController = game.nations.get(Nation.RU).controller;
      const franceController = game.nations.get(Nation.FR).controller;
      const englandController = game.nations.get(Nation.GB).controller;
      const italyController = game.nations.get(Nation.IT).controller;

      expect(russiaController).toEqual("Daniel");
      expect(franceController).toEqual("Claudia");
      expect(englandController).toEqual("Bert");
      expect(italyController).toEqual("Anton");
    });

    test("Claudia buys a 2 million AH bond", () => {
      const log = mainLog.slice(0, 5);
      log.push(
        Action.bondPurchase({ nation: Nation.AH, player: "Claudia", cost: 2 })
      );
      const game = Imperial.fromLog(log);
      const cash = game.players["Claudia"].cash;
      const treasury = game.nations.get(Nation.AH).treasury;

      expect(cash).toEqual(11);
      expect(treasury).toEqual(2);
    });

    test("Anton buys a 9 million IT bond", () => {
      const log = mainLog.slice(0, 6);
      log.push(
        Action.bondPurchase({ nation: Nation.IT, player: "Anton", cost: 9 })
      );
      const game = Imperial.fromLog(log);
      const cash = game.players["Anton"].cash;
      const treasury = game.nations.get(Nation.IT).treasury;

      expect(cash).toEqual(4);
      expect(treasury).toEqual(9);
    });

    test("Claudia buys a 9 million FR bond", () => {
      const log = mainLog.slice(0, 7);
      log.push(
        Action.bondPurchase({ nation: Nation.FR, player: "Claudia", cost: 9 })
      );
      const game = Imperial.fromLog(log);
      const cash = game.players["Claudia"].cash;
      const treasury = game.nations.get(Nation.FR).treasury;

      expect(cash).toEqual(2);
      expect(treasury).toEqual(9);
    });

    test("Daniel buys a 2 million FR bond", () => {
      const log = mainLog.slice(0, 8);
      log.push(
        Action.bondPurchase({ nation: Nation.FR, player: "Daniel", cost: 2 })
      );
      const game = Imperial.fromLog(log);
      const cash = game.players["Daniel"].cash;
      const treasury = game.nations.get(Nation.FR).treasury;

      expect(cash).toEqual(11);
      expect(treasury).toEqual(11);
    });

    test("Anton buys a 2 million GB bond", () => {
      const log = mainLog.slice(0, 9);
      log.push(
        Action.bondPurchase({ nation: Nation.GB, player: "Anton", cost: 2 })
      );
      const game = Imperial.fromLog(log);
      const cash = game.players["Anton"].cash;
      const treasury = game.nations.get(Nation.GB).treasury;

      expect(cash).toEqual(2);
      expect(treasury).toEqual(2);
    });

    test("Bert buys a 9 million GB bond", () => {
      const log = mainLog.slice(0, 10);
      log.push(
        Action.bondPurchase({ nation: Nation.GB, player: "Bert", cost: 9 })
      );
      const game = Imperial.fromLog(log);
      const cash = game.players["Bert"].cash;
      const treasury = game.nations.get(Nation.GB).treasury;

      expect(cash).toEqual(4);
      expect(treasury).toEqual(11);
    });

    test("Bert buys a 2 million RU bond", () => {
      const log = mainLog.slice(0, 11);
      log.push(
        Action.bondPurchase({ nation: Nation.RU, player: "Bert", cost: 2 })
      );
      const game = Imperial.fromLog(log);
      const cash = game.players["Bert"].cash;
      const treasury = game.nations.get(Nation.RU).treasury;

      expect(cash).toEqual(2);
      expect(treasury).toEqual(2);
    });

    test("Daniel buys a 9 million RU bond", () => {
      const log = mainLog.slice(0, 12);
      log.push(
        Action.bondPurchase({ nation: Nation.RU, player: "Daniel", cost: 9 })
      );
      const game = Imperial.fromLog(log);
      const cash = game.players["Daniel"].cash;
      const treasury = game.nations.get(Nation.RU).treasury;

      expect(cash).toEqual(2);
      expect(treasury).toEqual(11);
    });

    test("Claudia is the first player to take a turn", () => {
      const log = mainLog.slice(0, 13);
      log.push(Action.startFirstRound());
      const game = Imperial.fromLog(log);
      const currentPlayer = game.currentPlayer;

      expect(currentPlayer).toEqual("Claudia");
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
        const expectedActions = [
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
        ];

        expect(game.availableActions).toEqual(expectedActions);
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
        const expectedActions = [
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
        ];

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
        const availableActions = [
          Action.maneuver({
            origin: "liverpool",
            destination: "north atlantic",
          }),
          Action.maneuver({ origin: "london", destination: "english channel" }),
        ];

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
        const availableActions = [
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
        ];

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
    const secondRoundLog = [
      Action.playerSeating({ order: ["Daniel", "Claudia", "Bert", "Anton"] }),
      Action.assignStartingNation({ nation: Nation.RU, player: "Daniel" }),
      Action.assignStartingNation({ nation: Nation.FR, player: "Claudia" }),
      Action.assignStartingNation({ nation: Nation.GB, player: "Bert" }),
      Action.assignStartingNation({ nation: Nation.IT, player: "Anton" }),
      Action.bondPurchase({ nation: Nation.AH, player: "Claudia", cost: 2 }),
      Action.bondPurchase({ nation: Nation.IT, player: "Anton", cost: 9 }),
      Action.bondPurchase({ nation: Nation.FR, player: "Claudia", cost: 9 }),
      Action.bondPurchase({ nation: Nation.FR, player: "Daniel", cost: 2 }),
      Action.bondPurchase({ nation: Nation.GB, player: "Anton", cost: 2 }),
      Action.bondPurchase({ nation: Nation.GB, player: "Bert", cost: 9 }),
      Action.bondPurchase({ nation: Nation.RU, player: "Bert", cost: 2 }),
      Action.bondPurchase({ nation: Nation.RU, player: "Daniel", cost: 9 }),
      Action.startFirstRound(),
      // first round
      Action.rondel({ nation: Nation.AH, cost: 0, slot: "import" }),
      Action.import({ province: "trieste" }),
      Action.import({ province: "lemberg" }),
      Action.rondel({ nation: Nation.IT, cost: 0, slot: "investor" }),
      Action.bondPurchase({ nation: Nation.GE, player: "Daniel", cost: 4 }),
      Action.rondel({ nation: Nation.FR, cost: 0, slot: "factory" }),
      Action.buildFactory({ province: "marseille" }),
      Action.rondel({ nation: Nation.GB, cost: 0, slot: "production1" }),
      Action.rondel({ nation: Nation.GE, cost: 0, slot: "production2" }),
      Action.rondel({ nation: Nation.RU, cost: 0, slot: "investor" }),
      Action.bondPurchase({ nation: Nation.GE, player: "Anton", cost: 6 }),
      // second round
      Action.rondel({ nation: Nation.AH, cost: 0, slot: "production2" }),
      Action.rondel({ nation: Nation.IT, cost: 0, slot: "production2" }),
      Action.rondel({ nation: Nation.FR, cost: 0, slot: "production1" }),
      Action.rondel({ nation: Nation.GB, cost: 0, slot: "maneuver1" }),
      Action.maneuver({ origin: "liverpool", destination: "north atlantic" }),
      Action.maneuver({ origin: "london", destination: "english channel" }),
      Action.rondel({ nation: Nation.GE, cost: 0, slot: "maneuver2" }),
      Action.maneuver({ origin: "hamburg", destination: "north sea" }),
      Action.maneuver({ origin: "berlin", destination: "norway" }),
      Action.rondel({ nation: Nation.RU, cost: 0, slot: "import" }),
      Action.import({ province: "st. petersburg" }),
      Action.import({ province: "moscow" }),
      Action.import({ province: "moscow" }),
    ];
    describe("1. AH does maneuver2", () => {
      test("AH's available actions are to move trieste, lemberg, budapest, and vienna", () => {
        const log = [
          ...secondRoundLog,
          Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver2" }),
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

        const availableActions = [
          ...lembergActions,
          Action.maneuver({ origin: "trieste", destination: "ionian sea" }),
          ...viennaActions,
          ...budapestActions,
        ];
        expect(Imperial.fromLog(log).state.availableActions).toEqual(
          availableActions
        );
      });

      test("ionian sea, romania, west balkan, and tunis have AH flags", () => {
        const log = [
          ...secondRoundLog,
          Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver2" }),
          Action.maneuver({ origin: "trieste", destination: "ionian sea" }),
          Action.maneuver({ origin: "lemberg", destination: "romania" }),
          Action.maneuver({ origin: "budapest", destination: "west balkan" }),
          Action.maneuver({ origin: "vienna", destination: "tunis" }),
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

        expect(ionianSeaFlag).toEqual(Nation.AH);
        expect(romaniaFlag).toEqual(Nation.AH);
        expect(westBalkanFlag).toEqual(Nation.AH);
        expect(tunisFlag).toEqual(Nation.AH);
      });
    });

    describe("2. IT does maneuver2", () => {
      test("IT's available actions are to move naples and rome", () => {
        const log = [
          ...secondRoundLog,
          Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver2" }),
          Action.maneuver({ origin: "trieste", destination: "ionian sea" }),
          Action.maneuver({ origin: "lemberg", destination: "romania" }),
          Action.maneuver({ origin: "budapest", destination: "west balkan" }),
          Action.maneuver({ origin: "vienna", destination: "tunis" }),
          Action.rondel({ nation: Nation.IT, cost: 0, slot: "maneuver2" }),
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
          romeActions.push(
            Action.maneuver({ origin: "rome", destination: province })
          );
        });

        const availableActions = [
          Action.maneuver({
            origin: "naples",
            destination: "western mediterranean sea",
          }),
          ...romeActions,
        ];
        expect(Imperial.fromLog(log).state.availableActions).toEqual(
          availableActions
        );
      });

      test("spain and western mediterranean sea have IT flags", () => {
        const log = [
          ...secondRoundLog,
          Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver2" }),
          Action.maneuver({ origin: "trieste", destination: "ionian sea" }),
          Action.maneuver({ origin: "lemberg", destination: "romania" }),
          Action.maneuver({ origin: "budapest", destination: "west balkan" }),
          Action.maneuver({ origin: "vienna", destination: "tunis" }),
          Action.rondel({ nation: Nation.IT, cost: 0, slot: "maneuver2" }),
          Action.maneuver({
            origin: "naples",
            destination: "western mediterranean sea",
          }),
          Action.maneuver({ origin: "rome", destination: "spain" }),
        ];
        const westernMediterraneanSeaFlag = Imperial.fromLog(log).state
          .provinces["western mediterranean sea"].flag;
        const spainFlag = Imperial.fromLog(log).state.provinces["spain"].flag;

        expect(westernMediterraneanSeaFlag).toEqual(Nation.IT);
        expect(spainFlag).toEqual(Nation.IT);
      });
    });

    describe("3. FR does maneuver1", () => {
      test("FR's available actions are to move bordeaux, marseille, and paris", () => {
        const log = [
          ...secondRoundLog,
          Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver2" }),
          Action.maneuver({ origin: "trieste", destination: "ionian sea" }),
          Action.maneuver({ origin: "lemberg", destination: "romania" }),
          Action.maneuver({ origin: "budapest", destination: "west balkan" }),
          Action.maneuver({ origin: "vienna", destination: "tunis" }),
          Action.rondel({ nation: Nation.IT, cost: 0, slot: "maneuver2" }),
          Action.maneuver({
            origin: "naples",
            destination: "western mediterranean sea",
          }),
          Action.maneuver({ origin: "rome", destination: "spain" }),
          Action.rondel({ nation: Nation.FR, cost: 0, slot: "maneuver1" }),
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
          parisActions.push(
            Action.maneuver({ origin: "paris", destination: province })
          );
        });

        const availableActions = [
          Action.maneuver({
            origin: "bordeaux",
            destination: "bay of biscay",
          }),
          Action.maneuver({
            origin: "marseille",
            destination: "western mediterranean sea",
          }),
          ...parisActions,
        ];
        expect(Imperial.fromLog(log).state.availableActions).toEqual(
          availableActions
        );
      });

      test("IT controller (Anton) can choose whether to fight or allow FR fleet to coexist in western mediterranean sea", () => {
        const log = [
          ...secondRoundLog,
          Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver2" }),
          Action.maneuver({ origin: "trieste", destination: "ionian sea" }),
          Action.maneuver({ origin: "lemberg", destination: "romania" }),
          Action.maneuver({ origin: "budapest", destination: "west balkan" }),
          Action.maneuver({ origin: "vienna", destination: "tunis" }),
          Action.rondel({ nation: Nation.IT, cost: 0, slot: "maneuver2" }),
          Action.maneuver({
            origin: "naples",
            destination: "western mediterranean sea",
          }),
          Action.maneuver({ origin: "rome", destination: "spain" }),
          Action.rondel({ nation: Nation.IT, cost: 0, slot: "maneuver2" }),
          Action.maneuver({
            origin: "naples",
            destination: "western mediterranean sea",
          }),
          Action.rondel({ nation: Nation.FR, cost: 0, slot: "maneuver1" }),
          Action.maneuver({
            origin: "marseille",
            destination: "western mediterranean sea",
          }),
        ];
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
        expect(Imperial.fromLog(log).state.availableActions).toEqual(
          expectedActions
        );
      });

      test("IT chooses to fight so both fleets get removed", () => {
        const log = [
          ...secondRoundLog,
          Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver2" }),
          Action.maneuver({ origin: "trieste", destination: "ionian sea" }),
          Action.maneuver({ origin: "lemberg", destination: "romania" }),
          Action.maneuver({ origin: "budapest", destination: "west balkan" }),
          Action.maneuver({ origin: "vienna", destination: "tunis" }),
          Action.rondel({ nation: Nation.IT, cost: 0, slot: "maneuver2" }),
          Action.maneuver({
            origin: "naples",
            destination: "western mediterranean sea",
          }),
          Action.maneuver({ origin: "rome", destination: "spain" }),
          Action.rondel({ nation: Nation.FR, cost: 0, slot: "maneuver1" }),
          Action.maneuver({
            origin: "marseille",
            destination: "western mediterranean sea",
          }),
          Action.fight({
            province: "western mediterranean sea",
            incumbent: Nation.IT,
            challenger: Nation.FR,
          }),
        ];

        expect(
          Imperial.fromLog(log).state.provinces["western mediterranean sea"]
            .unitCount
        ).toEqual(0);
        expect(
          Imperial.fromLog(log).state.provinces["western mediterranean sea"]
            .flag
        ).toEqual(Nation.IT);
      });

      test("Morocco and bay of biscay have FR flags", () => {
        const log = [
          ...secondRoundLog,
          Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver2" }),
          Action.maneuver({ origin: "trieste", destination: "ionian sea" }),
          Action.maneuver({ origin: "lemberg", destination: "romania" }),
          Action.maneuver({ origin: "budapest", destination: "west balkan" }),
          Action.maneuver({ origin: "vienna", destination: "tunis" }),
          Action.rondel({ nation: Nation.IT, cost: 0, slot: "maneuver2" }),
          Action.maneuver({
            origin: "naples",
            destination: "western mediterranean sea",
          }),
          Action.maneuver({ origin: "rome", destination: "spain" }),
          Action.rondel({ nation: Nation.FR, cost: 0, slot: "maneuver1" }),
          Action.maneuver({
            origin: "bordeaux",
            destination: "bay of biscay",
          }),
          Action.maneuver({
            origin: "paris",
            destination: "morocco",
          }),
        ];
        expect(
          Imperial.fromLog(log).state.provinces["bay of biscay"].unitCount
        ).toEqual(1);
        expect(
          Imperial.fromLog(log).state.provinces["bay of biscay"].flag
        ).toEqual(Nation.FR);
        expect(
          Imperial.fromLog(log).state.provinces["morocco"].unitCount
        ).toEqual(1);
        expect(Imperial.fromLog(log).state.provinces["morocco"].flag).toEqual(
          Nation.FR
        );
      });
    });

    describe("4. GB invests", () => {
      test("GB has 6 million left in the treasury", () => {
        const log = [
          ...secondRoundLog,
          Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver2" }),
          Action.maneuver({ origin: "trieste", destination: "ionian sea" }),
          Action.maneuver({ origin: "lemberg", destination: "romania" }),
          Action.maneuver({ origin: "budapest", destination: "west balkan" }),
          Action.maneuver({ origin: "vienna", destination: "tunis" }),
          Action.rondel({ nation: Nation.IT, cost: 0, slot: "maneuver2" }),
          Action.maneuver({
            origin: "naples",
            destination: "western mediterranean sea",
          }),
          Action.maneuver({ origin: "rome", destination: "spain" }),
          Action.rondel({ nation: Nation.FR, cost: 0, slot: "maneuver1" }),
          Action.maneuver({
            origin: "bordeaux",
            destination: "bay of biscay",
          }),
          Action.maneuver({
            origin: "paris",
            destination: "morocco",
          }),
          Action.rondel({ nation: Nation.GB, cost: 0, slot: "investor" }),
        ];
        const treasury = Imperial.fromLog(log).state.nations.get(Nation.GB)
          .treasury;
        expect(treasury).toEqual(6);
      });

      test("Bert (GB's controller and investor-card holder) has 9 million in cash", () => {
        const log = [
          ...secondRoundLog,
          Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver2" }),
          Action.maneuver({ origin: "trieste", destination: "ionian sea" }),
          Action.maneuver({ origin: "lemberg", destination: "romania" }),
          Action.maneuver({ origin: "budapest", destination: "west balkan" }),
          Action.maneuver({ origin: "vienna", destination: "tunis" }),
          Action.rondel({ nation: Nation.IT, cost: 0, slot: "maneuver2" }),
          Action.maneuver({
            origin: "naples",
            destination: "western mediterranean sea",
          }),
          Action.maneuver({ origin: "rome", destination: "spain" }),
          Action.rondel({ nation: Nation.FR, cost: 0, slot: "maneuver1" }),
          Action.maneuver({
            origin: "bordeaux",
            destination: "bay of biscay",
          }),
          Action.maneuver({
            origin: "paris",
            destination: "morocco",
          }),
          Action.rondel({ nation: Nation.GB, cost: 0, slot: "investor" }),
        ];
        const controller = Imperial.fromLog(log).state.nations.get(Nation.GB)
          .controller;
        const cash = Imperial.fromLog(log).state.players[controller].cash;
        expect(cash).toEqual(9);
      });

      test("Bert can buy a bond", () => {
        const log = [
          ...secondRoundLog,
          Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver2" }),
          Action.maneuver({ origin: "trieste", destination: "ionian sea" }),
          Action.maneuver({ origin: "lemberg", destination: "romania" }),
          Action.maneuver({ origin: "budapest", destination: "west balkan" }),
          Action.maneuver({ origin: "vienna", destination: "tunis" }),
          Action.rondel({ nation: Nation.IT, cost: 0, slot: "maneuver2" }),
          Action.maneuver({
            origin: "naples",
            destination: "western mediterranean sea",
          }),
          Action.maneuver({ origin: "rome", destination: "spain" }),
          Action.rondel({ nation: Nation.FR, cost: 0, slot: "maneuver1" }),
          Action.maneuver({
            origin: "bordeaux",
            destination: "bay of biscay",
          }),
          Action.maneuver({
            origin: "paris",
            destination: "morocco",
          }),
          Action.rondel({ nation: Nation.GB, cost: 0, slot: "investor" }),
        ];
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
        expect(Imperial.fromLog(log).availableActionsState()).toEqual(
          expectedActions
        );
      });

      describe("Investor-card holder (Bert) buys the 6 million bond of RU", () => {
        test("Bert has 3 million", () => {
          const log = [
            ...secondRoundLog,
            Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver2" }),
            Action.maneuver({ origin: "trieste", destination: "ionian sea" }),
            Action.maneuver({ origin: "lemberg", destination: "romania" }),
            Action.maneuver({ origin: "budapest", destination: "west balkan" }),
            Action.maneuver({ origin: "vienna", destination: "tunis" }),
            Action.rondel({ nation: Nation.IT, cost: 0, slot: "maneuver2" }),
            Action.maneuver({
              origin: "naples",
              destination: "western mediterranean sea",
            }),
            Action.maneuver({ origin: "rome", destination: "spain" }),
            Action.rondel({ nation: Nation.FR, cost: 0, slot: "maneuver1" }),
            Action.maneuver({
              origin: "bordeaux",
              destination: "bay of biscay",
            }),
            Action.maneuver({
              origin: "paris",
              destination: "morocco",
            }),
            Action.rondel({ nation: Nation.GB, cost: 0, slot: "investor" }),
            Action.bondPurchase({ nation: Nation.RU, player: "Bert", cost: 6 }),
          ];
          const cash = Imperial.fromLog(log).state.players["Bert"].cash;
          expect(cash).toEqual(3);
        });

        test("RU treasury has 9 million", () => {
          const log = [
            ...secondRoundLog,
            Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver2" }),
            Action.maneuver({ origin: "trieste", destination: "ionian sea" }),
            Action.maneuver({ origin: "lemberg", destination: "romania" }),
            Action.maneuver({ origin: "budapest", destination: "west balkan" }),
            Action.maneuver({ origin: "vienna", destination: "tunis" }),
            Action.rondel({ nation: Nation.IT, cost: 0, slot: "maneuver2" }),
            Action.maneuver({
              origin: "naples",
              destination: "western mediterranean sea",
            }),
            Action.maneuver({ origin: "rome", destination: "spain" }),
            Action.rondel({ nation: Nation.FR, cost: 0, slot: "maneuver1" }),
            Action.maneuver({
              origin: "bordeaux",
              destination: "bay of biscay",
            }),
            Action.maneuver({
              origin: "paris",
              destination: "morocco",
            }),
            Action.rondel({ nation: Nation.GB, cost: 0, slot: "investor" }),
            Action.bondPurchase({ nation: Nation.RU, player: "Bert", cost: 6 }),
          ];
          const treasury = Imperial.fromLog(log).state.nations.get(Nation.RU)
            .treasury;
          expect(treasury).toEqual(9);
        });
      });
    });

    describe("5. GE does taxation", () => {
      test("GE moves to the taxation slot", () => {
        const log = [
          ...secondRoundLog,
          Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver2" }),
          Action.maneuver({ origin: "trieste", destination: "ionian sea" }),
          Action.maneuver({ origin: "lemberg", destination: "romania" }),
          Action.maneuver({ origin: "budapest", destination: "west balkan" }),
          Action.maneuver({ origin: "vienna", destination: "tunis" }),
          Action.rondel({ nation: Nation.IT, cost: 0, slot: "maneuver2" }),
          Action.maneuver({
            origin: "naples",
            destination: "western mediterranean sea",
          }),
          Action.maneuver({ origin: "rome", destination: "spain" }),
          Action.rondel({ nation: Nation.FR, cost: 0, slot: "maneuver1" }),
          Action.maneuver({
            origin: "bordeaux",
            destination: "bay of biscay",
          }),
          Action.maneuver({
            origin: "paris",
            destination: "morocco",
          }),
          Action.rondel({ nation: Nation.GB, cost: 0, slot: "investor" }),
          Action.bondPurchase({ nation: Nation.RU, player: "Bert", cost: 6 }),
          Action.rondel({ nation: Nation.GE, cost: 0, slot: "taxation" }),
        ];
        const actions = Imperial.fromLog(log).state.availableActions;
        const expected = rondelSlots.map((slot) =>
          Action.rondel({ nation: Nation.RU, cost: 0, slot })
        );
        expect(actions).toEqual(new Set(expected));
      });

      describe("consequences", () => {
        test("GE has 14 million in its treasury", () => {
          const log = [
            ...secondRoundLog,
            Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver2" }),
            Action.maneuver({ origin: "trieste", destination: "ionian sea" }),
            Action.maneuver({ origin: "lemberg", destination: "romania" }),
            Action.maneuver({ origin: "budapest", destination: "west balkan" }),
            Action.maneuver({ origin: "vienna", destination: "tunis" }),
            Action.rondel({ nation: Nation.IT, cost: 0, slot: "maneuver2" }),
            Action.maneuver({
              origin: "naples",
              destination: "western mediterranean sea",
            }),
            Action.maneuver({ origin: "rome", destination: "spain" }),
            Action.rondel({ nation: Nation.FR, cost: 0, slot: "maneuver1" }),
            Action.maneuver({
              origin: "bordeaux",
              destination: "bay of biscay",
            }),
            Action.maneuver({
              origin: "paris",
              destination: "morocco",
            }),
            Action.rondel({ nation: Nation.GB, cost: 0, slot: "investor" }),
            Action.bondPurchase({ nation: Nation.RU, player: "Bert", cost: 6 }),
            Action.rondel({ nation: Nation.GE, cost: 0, slot: "taxation" }),
          ];
          const treasury = Imperial.fromLog(log).state.nations.get(Nation.GE)
            .treasury;
          expect(treasury).toEqual(14);
        });

        test("GE moves up one field on tax chart", () => {
          const log = [
            ...secondRoundLog,
            Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver2" }),
            Action.maneuver({ origin: "trieste", destination: "ionian sea" }),
            Action.maneuver({ origin: "lemberg", destination: "romania" }),
            Action.maneuver({ origin: "budapest", destination: "west balkan" }),
            Action.maneuver({ origin: "vienna", destination: "tunis" }),
            Action.rondel({ nation: Nation.IT, cost: 0, slot: "maneuver2" }),
            Action.maneuver({
              origin: "naples",
              destination: "western mediterranean sea",
            }),
            Action.maneuver({ origin: "rome", destination: "spain" }),
            Action.rondel({ nation: Nation.FR, cost: 0, slot: "maneuver1" }),
            Action.maneuver({
              origin: "bordeaux",
              destination: "bay of biscay",
            }),
            Action.maneuver({
              origin: "paris",
              destination: "morocco",
            }),
            Action.rondel({ nation: Nation.GB, cost: 0, slot: "investor" }),
            Action.bondPurchase({ nation: Nation.RU, player: "Bert", cost: 6 }),
            Action.rondel({ nation: Nation.GE, cost: 0, slot: "taxation" }),
          ];
          const taxChartPosition = Imperial.fromLog(log).state.nations.get(
            Nation.GE
          ).taxChartPosition;
          expect(taxChartPosition).toEqual("6");
        });

        test("GE receives 1 power point", () => {
          const log = [
            ...secondRoundLog,
            Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver2" }),
            Action.maneuver({ origin: "trieste", destination: "ionian sea" }),
            Action.maneuver({ origin: "lemberg", destination: "romania" }),
            Action.maneuver({ origin: "budapest", destination: "west balkan" }),
            Action.maneuver({ origin: "vienna", destination: "tunis" }),
            Action.rondel({ nation: Nation.IT, cost: 0, slot: "maneuver2" }),
            Action.maneuver({
              origin: "naples",
              destination: "western mediterranean sea",
            }),
            Action.maneuver({ origin: "rome", destination: "spain" }),
            Action.rondel({ nation: Nation.FR, cost: 0, slot: "maneuver1" }),
            Action.maneuver({
              origin: "bordeaux",
              destination: "bay of biscay",
            }),
            Action.maneuver({
              origin: "paris",
              destination: "morocco",
            }),
            Action.rondel({ nation: Nation.GB, cost: 0, slot: "investor" }),
            Action.bondPurchase({ nation: Nation.RU, player: "Bert", cost: 6 }),
            Action.rondel({ nation: Nation.GE, cost: 0, slot: "taxation" }),
          ];
          const powerPoints = Imperial.fromLog(log).state.nations.get(Nation.GE)
            .powerPoints;
          expect(powerPoints).toEqual(1);
        });

        test("Anton has 4 million cash", () => {
          const log = [
            ...secondRoundLog,
            Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver2" }),
            Action.maneuver({ origin: "trieste", destination: "ionian sea" }),
            Action.maneuver({ origin: "lemberg", destination: "romania" }),
            Action.maneuver({ origin: "budapest", destination: "west balkan" }),
            Action.maneuver({ origin: "vienna", destination: "tunis" }),
            Action.rondel({ nation: Nation.IT, cost: 0, slot: "maneuver2" }),
            Action.maneuver({
              origin: "naples",
              destination: "western mediterranean sea",
            }),
            Action.maneuver({ origin: "rome", destination: "spain" }),
            Action.rondel({ nation: Nation.FR, cost: 0, slot: "maneuver1" }),
            Action.maneuver({
              origin: "bordeaux",
              destination: "bay of biscay",
            }),
            Action.maneuver({
              origin: "paris",
              destination: "morocco",
            }),
            Action.rondel({ nation: Nation.GB, cost: 0, slot: "investor" }),
            Action.bondPurchase({ nation: Nation.RU, player: "Bert", cost: 6 }),
            Action.rondel({ nation: Nation.GE, cost: 0, slot: "taxation" }),
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
          Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver2" }),
          Action.maneuver({ origin: "trieste", destination: "ionian sea" }),
          Action.maneuver({ origin: "lemberg", destination: "romania" }),
          Action.maneuver({ origin: "budapest", destination: "west balkan" }),
          Action.maneuver({ origin: "vienna", destination: "tunis" }),
          Action.rondel({ nation: Nation.IT, cost: 0, slot: "maneuver2" }),
          Action.maneuver({
            origin: "naples",
            destination: "western mediterranean sea",
          }),
          Action.maneuver({ origin: "rome", destination: "spain" }),
          Action.rondel({ nation: Nation.FR, cost: 0, slot: "maneuver1" }),
          Action.maneuver({
            origin: "bordeaux",
            destination: "bay of biscay",
          }),
          Action.maneuver({
            origin: "paris",
            destination: "morocco",
          }),
          Action.rondel({ nation: Nation.GB, cost: 0, slot: "investor" }),
          Action.bondPurchase({ nation: Nation.RU, player: "Bert", cost: 6 }),
          Action.rondel({ nation: Nation.GE, cost: 0, slot: "taxation" }),
          Action.rondel({ nation: Nation.RU, cost: 0, slot: "production2" }),
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
    const thirdRoundLog = [
      Action.playerSeating({ order: ["Daniel", "Claudia", "Bert", "Anton"] }),
      Action.assignStartingNation({ nation: Nation.RU, player: "Daniel" }),
      Action.assignStartingNation({ nation: Nation.FR, player: "Claudia" }),
      Action.assignStartingNation({ nation: Nation.GB, player: "Bert" }),
      Action.assignStartingNation({ nation: Nation.IT, player: "Anton" }),
      Action.bondPurchase({ nation: Nation.AH, player: "Claudia", cost: 2 }),
      Action.bondPurchase({ nation: Nation.IT, player: "Anton", cost: 9 }),
      Action.bondPurchase({ nation: Nation.FR, player: "Claudia", cost: 9 }),
      Action.bondPurchase({ nation: Nation.FR, player: "Daniel", cost: 2 }),
      Action.bondPurchase({ nation: Nation.GB, player: "Anton", cost: 2 }),
      Action.bondPurchase({ nation: Nation.GB, player: "Bert", cost: 9 }),
      Action.bondPurchase({ nation: Nation.RU, player: "Bert", cost: 2 }),
      Action.bondPurchase({ nation: Nation.RU, player: "Daniel", cost: 9 }),
      Action.startFirstRound(),
      // first round
      Action.rondel({ nation: Nation.AH, cost: 0, slot: "import" }),
      Action.import({ province: "trieste" }),
      Action.import({ province: "lemberg" }),
      Action.rondel({ nation: Nation.IT, cost: 0, slot: "investor" }),
      Action.bondPurchase({ nation: Nation.GE, player: "Daniel", cost: 4 }),
      Action.rondel({ nation: Nation.FR, cost: 0, slot: "factory" }),
      Action.buildFactory({ province: "marseille" }),
      Action.rondel({ nation: Nation.GB, cost: 0, slot: "production1" }),
      Action.rondel({ nation: Nation.GE, cost: 0, slot: "production2" }),
      Action.rondel({ nation: Nation.RU, cost: 0, slot: "investor" }),
      Action.bondPurchase({ nation: Nation.GE, player: "Anton", cost: 6 }),
      // second round
      Action.rondel({ nation: Nation.AH, cost: 0, slot: "production2" }),
      Action.rondel({ nation: Nation.IT, cost: 0, slot: "production2" }),
      Action.rondel({ nation: Nation.FR, cost: 0, slot: "production1" }),
      Action.rondel({ nation: Nation.GB, cost: 0, slot: "maneuver1" }),
      Action.maneuver({ origin: "liverpool", destination: "north atlantic" }),
      Action.maneuver({ origin: "london", destination: "english channel" }),
      Action.rondel({ nation: Nation.GE, cost: 0, slot: "maneuver2" }),
      Action.maneuver({ origin: "hamburg", destination: "north sea" }),
      Action.maneuver({ origin: "berlin", destination: "norway" }),
      Action.rondel({ nation: Nation.RU, cost: 0, slot: "import" }),
      Action.import({ province: "st. petersburg" }),
      Action.import({ province: "moscow" }),
      Action.import({ province: "moscow" }),
      // third round
      Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver2" }),
      Action.maneuver({ origin: "trieste", destination: "ionian sea" }),
      Action.maneuver({ origin: "lemberg", destination: "romania" }),
      Action.maneuver({ origin: "budapest", destination: "west balkan" }),
      Action.maneuver({ origin: "vienna", destination: "tunis" }),
      Action.rondel({ nation: Nation.IT, cost: 0, slot: "maneuver2" }),
      Action.maneuver({
        origin: "naples",
        destination: "western mediterranean sea",
      }),
      Action.maneuver({ origin: "rome", destination: "spain" }),
      Action.rondel({ nation: Nation.FR, cost: 0, slot: "maneuver1" }),
      Action.maneuver({
        origin: "marseille",
        destination: "western mediterranean sea",
      }),
      Action.maneuver({
        origin: "bordeaux",
        destination: "bay of biscay",
      }),
      Action.maneuver({
        origin: "paris",
        destination: "morocco",
      }),
      Action.rondel({ nation: Nation.GB, cost: 0, slot: "investor" }),
      Action.bondPurchase({ nation: Nation.RU, player: "Bert", cost: 6 }),
      Action.rondel({ nation: Nation.GE, cost: 0, slot: "taxation" }),
      Action.rondel({ nation: Nation.RU, cost: 0, slot: "production2" }),
    ];
    describe("1. AH does taxation", () => {
      test("AH moves to the taxation slot", () => {
        const log = [
          ...thirdRoundLog,
          Action.rondel({ nation: Nation.AH, cost: 0, slot: "taxation" }),
        ];
        const actions = Imperial.fromLog(log).state.availableActions;
        const expected = rondelSlots.map((slot) =>
          Action.rondel({ nation: Nation.IT, cost: 0, slot })
        );
        expect(actions).toEqual(new Set(expected));
      });

      describe("consequences", () => {
        test("AH has 4 million in its treasury", () => {
          const log = [
            ...thirdRoundLog,
            Action.rondel({ nation: Nation.AH, cost: 0, slot: "taxation" }),
          ];
          const treasury = Imperial.fromLog(log).state.nations.get(Nation.AH)
            .treasury;
          expect(treasury).toEqual(4);
        });

        test("AH moves up to position '8' on the tax chart", () => {
          const log = [
            ...thirdRoundLog,
            Action.rondel({ nation: Nation.AH, cost: 0, slot: "taxation" }),
          ];
          const taxChartPosition = Imperial.fromLog(log).state.nations.get(
            Nation.AH
          ).taxChartPosition;
          expect(taxChartPosition).toEqual("8");
        });

        test("AH receives 3 power points", () => {
          const log = [
            ...thirdRoundLog,
            Action.rondel({ nation: Nation.AH, cost: 0, slot: "taxation" }),
          ];
          const powerPoints = Imperial.fromLog(log).state.nations.get(Nation.AH)
            .powerPoints;
          expect(powerPoints).toEqual(3);
        });

        test("Claudia has 5 million cash", () => {
          const log = [
            ...thirdRoundLog,
            Action.rondel({ nation: Nation.AH, cost: 0, slot: "taxation" }),
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
          Action.rondel({ nation: Nation.AH, cost: 0, slot: "taxation" }),
          Action.rondel({ nation: Nation.IT, cost: 0, slot: "production1" }),
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
          Action.rondel({ nation: Nation.AH, cost: 0, slot: "taxation" }),
          Action.rondel({ nation: Nation.IT, cost: 0, slot: "production1" }),
          Action.rondel({ nation: Nation.FR, cost: 0, slot: "production2" }),
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
        test("Claudia (investor card owner) starts the turn with 7 million", () => {
          const log = [
            ...thirdRoundLog,
            Action.rondel({ nation: Nation.AH, cost: 0, slot: "taxation" }),
            Action.rondel({ nation: Nation.IT, cost: 0, slot: "production1" }),
            Action.rondel({ nation: Nation.FR, cost: 0, slot: "production2" }),
          ];
          const cash = Imperial.fromLog(log).state.players["Claudia"].cash;
          expect(cash).toEqual(7);
        });

        test("Claudia can buy a bond", () => {
          const log = [
            ...thirdRoundLog,
            Action.rondel({ nation: Nation.AH, cost: 0, slot: "taxation" }),
            Action.rondel({ nation: Nation.IT, cost: 0, slot: "production1" }),
            Action.rondel({ nation: Nation.FR, cost: 0, slot: "production2" }),
          ];
          const expectedActions = [
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
          ];
          expect(Imperial.fromLog(log).availableActionsState()).toEqual(
            expectedActions
          );
        });

        describe("Claudia buys a 6 million AH bond", () => {
          test("Claudia has 1 million in cash", () => {
            const log = [
              ...thirdRoundLog,
              Action.rondel({ nation: Nation.AH, cost: 0, slot: "taxation" }),
              Action.rondel({
                nation: Nation.IT,
                cost: 0,
                slot: "production1",
              }),
              Action.rondel({
                nation: Nation.FR,
                cost: 0,
                slot: "production2",
              }),
              Action.bondPurchase({
                nation: Nation.AH,
                player: "Claudia",
                cost: 6,
              }),
            ];
            const cash = Imperial.fromLog(log).state.players["Claudia"].cash;
            expect(cash).toEqual(1);
          });

          test("Claudia has the #3 AH bond", () => {
            const log = [
              ...thirdRoundLog,
              Action.rondel({ nation: Nation.AH, cost: 0, slot: "taxation" }),
              Action.rondel({
                nation: Nation.IT,
                cost: 0,
                slot: "production1",
              }),
              Action.rondel({
                nation: Nation.FR,
                cost: 0,
                slot: "production2",
              }),
              Action.bondPurchase({
                nation: Nation.AH,
                player: "Claudia",
                cost: 6,
              }),
            ];
            const bonds = Imperial.fromLog(log).state.players["Claudia"].bonds;
            expect(bonds).toEqual([
              { nation: Nation.AH, cost: 2 },
              { nation: Nation.FR, cost: 9 },
              { nation: Nation.AH, cost: 6 },
            ]);
          });
        });

        test("Daniel is the investor card owner", () => {
          const log = [
            ...thirdRoundLog,
            Action.rondel({ nation: Nation.AH, cost: 0, slot: "taxation" }),
            Action.rondel({ nation: Nation.IT, cost: 0, slot: "production1" }),
            Action.rondel({ nation: Nation.FR, cost: 0, slot: "production2" }),
            Action.bondPurchase({
              nation: Nation.AH,
              player: "Claudia",
              cost: 6,
            }),
          ];
          const investorCardHolder = Imperial.fromLog(log).state
            .investorCardHolder;
          expect(investorCardHolder).toEqual("Daniel");
        });
      });
    });

    describe("4. GB does production2", () => {
      test("London and Liverpool have units", () => {
        const log = [
          ...thirdRoundLog,
          Action.rondel({ nation: Nation.AH, cost: 0, slot: "taxation" }),
          Action.rondel({ nation: Nation.IT, cost: 0, slot: "production1" }),
          Action.rondel({ nation: Nation.FR, cost: 0, slot: "production2" }),
          Action.bondPurchase({
            nation: Nation.AH,
            player: "Claudia",
            cost: 6,
          }),
          Action.rondel({ nation: Nation.GB, cost: 0, slot: "production2" }),
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

    describe("5. GE builds a factory", () => {
      test("GE can choose where to build the factory", () => {
        const log = [
          ...thirdRoundLog,
          Action.rondel({ nation: Nation.AH, cost: 0, slot: "taxation" }),
          Action.rondel({ nation: Nation.IT, cost: 0, slot: "production1" }),
          Action.rondel({ nation: Nation.FR, cost: 0, slot: "production2" }),
          Action.bondPurchase({
            nation: Nation.AH,
            player: "Claudia",
            cost: 6,
          }),
          Action.rondel({ nation: Nation.GB, cost: 0, slot: "production2" }),
          Action.rondel({ nation: Nation.GE, cost: 0, slot: "factory" }),
        ];
        const expected = new Set(
          ["danzig", "munich", "cologne"].map((province) =>
            Action.buildFactory({ province })
          )
        );
        expect(Imperial.fromLog(log).state.availableActions).toEqual(expected);
      });

      describe("GE builds a factory in Cologne", () => {
        test("Cologne has a factory", () => {
          const log = [
            ...thirdRoundLog,
            Action.rondel({ nation: Nation.AH, cost: 0, slot: "taxation" }),
            Action.rondel({ nation: Nation.IT, cost: 0, slot: "production1" }),
            Action.rondel({ nation: Nation.FR, cost: 0, slot: "production2" }),
            Action.bondPurchase({
              nation: Nation.AH,
              player: "Claudia",
              cost: 6,
            }),
            Action.rondel({ nation: Nation.GB, cost: 0, slot: "production2" }),
            Action.rondel({ nation: Nation.GE, cost: 0, slot: "factory" }),
            Action.buildFactory({ province: "cologne" }),
          ];
          const hasFactory = Imperial.fromLog(log).state.provinces["cologne"]
            .hasFactory;
          expect(hasFactory).toEqual(true);
        });

        test("GE has 9 treasury", () => {
          const log = [
            ...thirdRoundLog,
            Action.rondel({ nation: Nation.AH, cost: 0, slot: "taxation" }),
            Action.rondel({ nation: Nation.IT, cost: 0, slot: "production1" }),
            Action.rondel({ nation: Nation.FR, cost: 0, slot: "production2" }),
            Action.bondPurchase({
              nation: Nation.AH,
              player: "Claudia",
              cost: 6,
            }),
            Action.rondel({ nation: Nation.GB, cost: 0, slot: "production2" }),
            Action.rondel({ nation: Nation.GE, cost: 0, slot: "factory" }),
            Action.buildFactory({ province: "cologne" }),
          ];
          const treasury = Imperial.fromLog(log).state.nations.get(Nation.GE)
            .treasury;
          expect(treasury).toEqual(9);
        });
      });
    });

    describe("6. RU does maneuver2", () => {
      test("RU's available actions are to move st. petersburg, odessa, and moscow (x3)", () => {
        const log = [
          ...thirdRoundLog,
          Action.rondel({ nation: Nation.AH, cost: 0, slot: "taxation" }),
          Action.rondel({ nation: Nation.IT, cost: 0, slot: "production1" }),
          Action.rondel({ nation: Nation.FR, cost: 0, slot: "production2" }),
          Action.bondPurchase({
            nation: Nation.AH,
            player: "Claudia",
            cost: 6,
          }),
          Action.rondel({ nation: Nation.GB, cost: 0, slot: "production2" }),
          Action.rondel({ nation: Nation.GE, cost: 0, slot: "factory" }),
          Action.buildFactory({ province: "cologne" }),
          Action.rondel({ nation: Nation.RU, cost: 0, slot: "maneuver2" }),
        ];
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

        const availableActions = [
          Action.maneuver({
            origin: "st. petersburg",
            destination: "baltic sea",
          }),
          Action.maneuver({
            origin: "odessa",
            destination: "black sea",
          }),
          ...moscowActions,
        ];
        expect(Imperial.fromLog(log).state.availableActions).toEqual(
          availableActions
        );
      });

      test("Sweden, Baltic Sea, Black Sea, and Turkey have RU flags", () => {
        const log = [
          ...thirdRoundLog,
          Action.rondel({ nation: Nation.AH, cost: 0, slot: "taxation" }),
          Action.rondel({ nation: Nation.IT, cost: 0, slot: "production1" }),
          Action.rondel({ nation: Nation.FR, cost: 0, slot: "production2" }),
          Action.bondPurchase({
            nation: Nation.AH,
            player: "Claudia",
            cost: 6,
          }),
          Action.rondel({ nation: Nation.GB, cost: 0, slot: "production2" }),
          Action.rondel({ nation: Nation.GE, cost: 0, slot: "factory" }),
          Action.buildFactory({ province: "cologne" }),
          Action.rondel({ nation: Nation.RU, cost: 0, slot: "maneuver2" }),
          Action.maneuver({
            origin: "st. petersburg",
            destination: "baltic sea",
          }),
          Action.maneuver({
            origin: "odessa",
            destination: "black sea",
          }),
          Action.maneuver({
            origin: "moscow",
            destination: "sweden",
          }),
          Action.maneuver({
            origin: "moscow",
            destination: "turkey",
          }),
          Action.maneuver({
            origin: "moscow",
            destination: "lemberg",
          }),
        ];
        const balticSeaFlag = Imperial.fromLog(log).state.provinces[
          "baltic sea"
        ].flag;
        const swedenFlag = Imperial.fromLog(log).state.provinces["sweden"].flag;
        const blackSeaFlag = Imperial.fromLog(log).state.provinces["black sea"]
          .flag;
        const turkeyFlag = Imperial.fromLog(log).state.provinces["turkey"].flag;

        expect(balticSeaFlag).toEqual(Nation.RU);
        expect(swedenFlag).toEqual(Nation.RU);
        expect(blackSeaFlag).toEqual(Nation.RU);
        expect(turkeyFlag).toEqual(Nation.RU);
      });
    });
  });

  describe("fifth round", () => {
    const fourthRoundLog = [
      Action.playerSeating({ order: ["Daniel", "Claudia", "Bert", "Anton"] }),
      Action.assignStartingNation({ nation: Nation.RU, player: "Daniel" }),
      Action.assignStartingNation({ nation: Nation.FR, player: "Claudia" }),
      Action.assignStartingNation({ nation: Nation.GB, player: "Bert" }),
      Action.assignStartingNation({ nation: Nation.IT, player: "Anton" }),
      Action.bondPurchase({ nation: Nation.AH, player: "Claudia", cost: 2 }),
      Action.bondPurchase({ nation: Nation.IT, player: "Anton", cost: 9 }),
      Action.bondPurchase({ nation: Nation.FR, player: "Claudia", cost: 9 }),
      Action.bondPurchase({ nation: Nation.FR, player: "Daniel", cost: 2 }),
      Action.bondPurchase({ nation: Nation.GB, player: "Anton", cost: 2 }),
      Action.bondPurchase({ nation: Nation.GB, player: "Bert", cost: 9 }),
      Action.bondPurchase({ nation: Nation.RU, player: "Bert", cost: 2 }),
      Action.bondPurchase({ nation: Nation.RU, player: "Daniel", cost: 9 }),
      Action.startFirstRound(),
      // first round
      Action.rondel({ nation: Nation.AH, cost: 0, slot: "import" }),
      Action.import({ province: "trieste" }),
      Action.import({ province: "lemberg" }),
      Action.rondel({ nation: Nation.IT, cost: 0, slot: "investor" }),
      Action.bondPurchase({ nation: Nation.GE, player: "Daniel", cost: 4 }),
      Action.rondel({ nation: Nation.FR, cost: 0, slot: "factory" }),
      Action.buildFactory({ province: "marseille" }),
      Action.rondel({ nation: Nation.GB, cost: 0, slot: "production1" }),
      Action.rondel({ nation: Nation.GE, cost: 0, slot: "production2" }),
      Action.rondel({ nation: Nation.RU, cost: 0, slot: "investor" }),
      Action.bondPurchase({ nation: Nation.GE, player: "Anton", cost: 6 }),
      // second round
      Action.rondel({ nation: Nation.AH, cost: 0, slot: "production2" }),
      Action.rondel({ nation: Nation.IT, cost: 0, slot: "production2" }),
      Action.rondel({ nation: Nation.FR, cost: 0, slot: "production1" }),
      Action.rondel({ nation: Nation.GB, cost: 0, slot: "maneuver1" }),
      Action.maneuver({ origin: "liverpool", destination: "north atlantic" }),
      Action.maneuver({ origin: "london", destination: "english channel" }),
      Action.rondel({ nation: Nation.GE, cost: 0, slot: "maneuver2" }),
      Action.maneuver({ origin: "hamburg", destination: "north sea" }),
      Action.maneuver({ origin: "berlin", destination: "norway" }),
      Action.rondel({ nation: Nation.RU, cost: 0, slot: "import" }),
      Action.import({ province: "st. petersburg" }),
      Action.import({ province: "moscow" }),
      Action.import({ province: "moscow" }),
      // third round
      Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver2" }),
      Action.maneuver({ origin: "trieste", destination: "ionian sea" }),
      Action.maneuver({ origin: "lemberg", destination: "romania" }),
      Action.maneuver({ origin: "budapest", destination: "west balkan" }),
      Action.maneuver({ origin: "vienna", destination: "tunis" }),
      Action.rondel({ nation: Nation.IT, cost: 0, slot: "maneuver2" }),
      Action.maneuver({
        origin: "naples",
        destination: "western mediterranean sea",
      }),
      Action.maneuver({ origin: "rome", destination: "spain" }),
      Action.rondel({ nation: Nation.FR, cost: 0, slot: "maneuver1" }),
      Action.maneuver({
        origin: "marseille",
        destination: "western mediterranean sea",
      }),
      Action.maneuver({
        origin: "bordeaux",
        destination: "bay of biscay",
      }),
      Action.maneuver({
        origin: "paris",
        destination: "morocco",
      }),
      Action.rondel({ nation: Nation.GB, cost: 0, slot: "investor" }),
      Action.bondPurchase({ nation: Nation.RU, player: "Bert", cost: 6 }),
      Action.rondel({ nation: Nation.GE, cost: 0, slot: "taxation" }),
      Action.rondel({ nation: Nation.RU, cost: 0, slot: "production2" }),
      // fourth round
      Action.rondel({ nation: Nation.AH, cost: 0, slot: "taxation" }),
      Action.rondel({ nation: Nation.IT, cost: 0, slot: "production1" }),
      Action.rondel({ nation: Nation.FR, cost: 0, slot: "production2" }),
      Action.bondPurchase({ nation: Nation.AH, player: "Claudia", cost: 6 }),
      Action.rondel({ nation: Nation.GB, cost: 0, slot: "production2" }),
      Action.rondel({ nation: Nation.GE, cost: 0, slot: "factory" }),
      Action.buildFactory({ province: "cologne" }),
      Action.rondel({ nation: Nation.RU, cost: 0, slot: "maneuver2" }),
      Action.maneuver({
        origin: "st. petersburg",
        destination: "baltic sea",
      }),
      Action.maneuver({
        origin: "odessa",
        destination: "black sea",
      }),
      Action.maneuver({
        origin: "moscow",
        destination: "sweden",
      }),
      Action.maneuver({
        origin: "moscow",
        destination: "turkey",
      }),
      Action.maneuver({
        origin: "moscow",
        destination: "lemberg",
      }),
    ];
    describe("1. AH does maneuver1", () => {
      test("AH's available actions are to move Tunis, Ionian Sea, West Balkan, and Romania", () => {
        const newEntries = [
          ,
          Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver1" }),
        ];
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
        const availableActions = [
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
        ];
        const game = Imperial.fromLog(fourthRoundLog);
        newEntries.forEach((entry) => game.tick(entry));
        expect(game.state.availableActions).toEqual(availableActions);
      });

      test("Algeria, Bulgaria, Western Mediterranean, and Eastern Mediterranean have AH flags", () => {
        const log = [
          ...fourthRoundLog,
          Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver1" }),
          Action.maneuver({
            origin: "ionian sea",
            destination: "western mediterranean sea",
          }),
          Action.maneuver({ origin: "tunis", destination: "algeria" }),
          Action.maneuver({ origin: "west balkan", destination: "bulgaria" }),
          Action.maneuver({ origin: "romania", destination: "odessa" }),
        ];
        const algeriaFlag = Imperial.fromLog(log).state.provinces["algeria"]
          .flag;
        const bulgariaFlag = Imperial.fromLog(log).state.provinces["bulgaria"]
          .flag;
        const westernMediterraneanSeaFlag = Imperial.fromLog(log).state
          .provinces["western mediterranean sea"].flag;

        expect(algeriaFlag).toEqual(Nation.AH);
        expect(bulgariaFlag).toEqual(Nation.AH);
        expect(westernMediterraneanSeaFlag).toEqual(Nation.AH);
      });
    });

    describe("2. IT invests", () => {
      test("IT has 1 left in the treasury", () => {
        const log = [
          ...fourthRoundLog,
          Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver1" }),
          Action.maneuver({
            origin: "ionian sea",
            destination: "western mediterranean sea",
          }),
          Action.maneuver({ origin: "tunis", destination: "algeria" }),
          Action.maneuver({ origin: "west balkan", destination: "bulgaria" }),
          Action.maneuver({ origin: "romania", destination: "odessa" }),
          Action.rondel({ nation: Nation.IT, cost: 0, slot: "investor" }),
        ];
        const treasury = Imperial.fromLog(log).state.nations.get(Nation.IT)
          .treasury;
        expect(treasury).toEqual(1);
      });

      xtest("Anton (IT's controller) has 8 million in cash", () => {
        const log = [
          ...fourthRoundLog,
          Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver1" }),
          Action.maneuver({
            origin: "ionian sea",
            destination: "western mediterranean sea",
          }),
          Action.maneuver({ origin: "tunis", destination: "algeria" }),
          Action.maneuver({ origin: "west balkan", destination: "bulgaria" }),
          Action.maneuver({ origin: "romania", destination: "odessa" }),
          Action.rondel({ nation: Nation.IT, cost: 0, slot: "investor" }),
        ];
        const controller = Imperial.fromLog(log).state.nations.get(Nation.IT)
          .controller;
        const cash = Imperial.fromLog(log).state.players[controller].cash;
        expect(cash).toEqual(8);
      });

      describe("investor card is activated", () => {
        test("Daniel (investor card holder) has 6 million in cash", () => {
          const log = [
            ...fourthRoundLog,
            Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver1" }),
            Action.maneuver({
              origin: "ionian sea",
              destination: "western mediterranean sea",
            }),
            Action.maneuver({ origin: "tunis", destination: "algeria" }),
            Action.maneuver({ origin: "west balkan", destination: "bulgaria" }),
            Action.maneuver({ origin: "romania", destination: "odessa" }),
            Action.rondel({ nation: Nation.IT, cost: 0, slot: "investor" }),
          ];
          const investorCardHolder = Imperial.fromLog(log).state
            .investorCardHolder;
          const cash = Imperial.fromLog(log).state.players[investorCardHolder]
            .cash;
          expect(cash).toEqual(6);
        });

        test("Daniel can buy a bond", () => {
          const log = [
            ...fourthRoundLog,
            Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver1" }),
            Action.maneuver({
              origin: "ionian sea",
              destination: "western mediterranean sea",
            }),
            Action.maneuver({ origin: "tunis", destination: "algeria" }),
            Action.maneuver({ origin: "west balkan", destination: "bulgaria" }),
            Action.maneuver({ origin: "romania", destination: "odessa" }),
            Action.rondel({ nation: Nation.IT, cost: 0, slot: "investor" }),
          ];
          const expectedActions = [
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
          ];
          expect(Imperial.fromLog(log).availableActionsState()).toEqual(
            expectedActions
          );
        });
        xtest("Daniel has a 9 million GE bond and does not have a 4 million GE bond", () => {
          const log = [
            ...fourthRoundLog,
            Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver1" }),
            Action.maneuver({
              origin: "ionian sea",
              destination: "western mediterranean sea",
            }),
            Action.maneuver({ origin: "tunis", destination: "algeria" }),
            Action.maneuver({ origin: "west balkan", destination: "bulgaria" }),
            Action.maneuver({ origin: "romania", destination: "odessa" }),
            Action.rondel({ nation: Nation.IT, cost: 0, slot: "investor" }),
            Action.bondPurchase({
              nation: Nation.GE,
              player: "Daniel",
              cost: 9,
            }),
          ];
          const expectedBonds = [
            { nation: Nation.FR, cost: 2 },
            { nation: Nation.RU, cost: 9 },
            { nation: Nation.GE, cost: 9 },
          ];
          expect(Imperial.fromLog(log).state.players["Daniel"].bonds).toEqual(
            expectedBonds
          );
        });
        xtest("Daniel has 3 million in cash", () => {
          const log = [
            ...fourthRoundLog,
            Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver1" }),
            Action.maneuver({
              origin: "ionian sea",
              destination: "western mediterranean sea",
            }),
            Action.maneuver({ origin: "tunis", destination: "algeria" }),
            Action.maneuver({ origin: "west balkan", destination: "bulgaria" }),
            Action.maneuver({ origin: "romania", destination: "odessa" }),
            Action.rondel({ nation: Nation.IT, cost: 0, slot: "investor" }),
            Action.bondPurchase({
              nation: Nation.GE,
              player: "Daniel",
              cost: 9,
            }),
          ];
          const game = Imperial.fromLog(fourthRoundLog);
          newEntries.forEach(game.tick);

          const cash = game.state.players["Daniel"].cash;
          expect(cash).toEqual(3);
        });

        test("GE has 14 million in treasury", () => {});
        test("Daniel controls GE", () => {});
        test("Anton holds the investor card", () => {});
      });
    });
  });
});

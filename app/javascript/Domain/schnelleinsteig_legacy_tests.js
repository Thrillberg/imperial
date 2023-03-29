// This file is not run anymore because it is out of date and not worth
// the effort to update.
// It was valuable in the initial development process and we wish it well
// in all its future endeavours!
import { Nation, Bond } from './constants';
import Action from './action';
import Imperial from './ImperialGameCoordinator';
import mainLog from './schnelleinsteigLog';

describe('Schnelleinsteig', () => {
  describe('setup for four players', () => {
    const game = Imperial.fromLog(mainLog.slice(0, 1));

    test('players', () => {
      expect(game.players).toEqual({
        Daniel: {
          name: 'Daniel',
          bonds: new Set([Bond(Nation.RU, 4), Bond(Nation.FR, 1)]),
          cash: 2,
        },
        Claudia: {
          name: 'Claudia',
          bonds: new Set([Bond(Nation.FR, 4), Bond(Nation.AH, 1)]),
          cash: 2,
        },
        Bert: {
          name: 'Bert',
          bonds: new Set([Bond(Nation.GB, 4), Bond(Nation.RU, 1)]),
          cash: 2,
        },
        Anton: {
          name: 'Anton',
          bonds: new Set([Bond(Nation.IT, 4), Bond(Nation.GB, 1)]),
          cash: 2,
        },
      });
    });

    test('order', () => {
      expect(game.order).toEqual(['Daniel', 'Claudia', 'Bert', 'Anton']);
    });

    test('nations', () => {
      expect(game.nations).toEqual(
        new Map([
          [
            Nation.AH,
            {
              flagCount: 0,
              powerPoints: 0,
              taxChartPosition: 5,
              controller: 'Claudia',
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
              controller: 'Claudia',
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
              controller: 'Bert',
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
              controller: 'Anton',
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
              controller: 'Daniel',
              rondelPosition: null,
              treasury: 11,
            },
          ],
        ]),
      );
    });
  });

  describe('first round', () => {
    describe('1. AH imports', () => {
      test("AH's treasury is empty and Trieste & Lemberg have AH armies", () => {
        const log = mainLog.slice(0, 15);
        log.push(
          Action.import({
            placements: [
              { province: 'trieste', type: 'fleet' },
              { province: 'lemberg', type: 'army' },
            ],
          }),
        );
        const game = Imperial.fromLog(log);
        const { treasury } = game.nations.get(Nation.AH);
        const triesteFleetCount = game.units.get(Nation.AH).get('trieste')
          .fleets;
        const lembergArmyCount = game.units.get(Nation.AH).get('lemberg')
          .armies;

        expect(treasury).toEqual(0);
        expect(triesteFleetCount).toEqual(1);
        expect(lembergArmyCount).toEqual(1);
      });

      test("it is now IT's turn", () => {
        const log = mainLog.slice(0, 15);
        log.push(
          Action.import({
            placements: [
              { province: 'trieste', type: 'fleet' },
              { province: 'lemberg', type: 'army' },
            ],
          }),
        );
        const game = Imperial.fromLog(log);
        const currentPlayerName = game.nations.get(Nation.IT).controller;

        expect(game.currentPlayerName).toEqual(currentPlayerName);
      });
    });

    describe('2. IT invests', () => {
      test('IT has 5 million left in the treasury', () => {
        const log = mainLog.slice(0, 17);
        log.push(
          Action.rondel({ nation: Nation.IT, cost: 0, slot: 'investor' }),
        );
        const game = Imperial.fromLog(log);
        const { treasury } = game.nations.get(Nation.IT);

        expect(treasury).toEqual(5);
      });

      test("IT's controller (Anton) has 6 million in cash", () => {
        const log = mainLog.slice(0, 17);
        log.push(
          Action.rondel({ nation: Nation.IT, cost: 0, slot: 'investor' }),
        );
        const game = Imperial.fromLog(log);
        const { controller } = game.nations.get(Nation.IT);
        const { cash } = game.players[controller];

        expect(cash).toEqual(6);
      });

      test('investor card is active', () => {
        const log = mainLog.slice(0, 17);
        log.push(
          Action.rondel({ nation: Nation.IT, cost: 0, slot: 'investor' }),
        );
        const game = Imperial.fromLog(log);

        expect(game.investorCardActive).toEqual(true);
      });

      test('Investor-card holder (Daniel) has 4 million in cash', () => {
        const log = mainLog.slice(0, 17);
        log.push(
          Action.rondel({ nation: Nation.IT, cost: 0, slot: 'investor' }),
        );
        const game = Imperial.fromLog(log);
        const { investorCardHolder } = game;
        const { cash } = game.players[investorCardHolder];

        expect(cash).toEqual(4);
      });

      test('Daniel can buy a bond', () => {
        const log = mainLog.slice(0, 17);
        log.push(
          Action.rondel({ nation: Nation.IT, cost: 0, slot: 'investor' }),
        );
        const game = Imperial.fromLog(log);
        const expectedActions = new Set([
          Action.bondPurchase({ nation: Nation.AH, player: 'Daniel', cost: 4 }),
          Action.bondPurchase({ nation: Nation.IT, player: 'Daniel', cost: 2 }),
          Action.bondPurchase({ nation: Nation.IT, player: 'Daniel', cost: 4 }),
          Action.bondPurchase({ nation: Nation.FR, player: 'Daniel', cost: 4 }),
          Action.bondPurchase({ nation: Nation.FR, player: 'Daniel', cost: 6 }),
          Action.bondPurchase({ nation: Nation.GB, player: 'Daniel', cost: 4 }),
          Action.bondPurchase({ nation: Nation.GE, player: 'Daniel', cost: 2 }),
          Action.bondPurchase({ nation: Nation.GE, player: 'Daniel', cost: 4 }),
          Action.bondPurchase({ nation: Nation.RU, player: 'Daniel', cost: 4 }),
          Action.bondPurchase({ nation: Nation.RU, player: 'Daniel', cost: 6 }),
          Action.bondPurchase({
            nation: Nation.RU,
            player: 'Daniel',
            cost: 12,
          }),
        ]);

        expect(game.availableActions).toEqual(expectedActions);
      });

      test("it is the investor card holder's turn", () => {
        const log = mainLog.slice(0, 17);
        log.push(
          Action.rondel({ nation: Nation.IT, cost: 0, slot: 'investor' }),
        );
        const game = Imperial.fromLog(log);
        const currentPlayerName = game.investorCardHolder;

        expect(game.currentPlayerName).toEqual(currentPlayerName);
      });

      describe('Investor-card holder (Daniel) buys the 4 million bond of GE', () => {
        test('Investor-card holder has no cash', () => {
          const log = mainLog.slice(0, 18);
          log.push(
            Action.bondPurchase({
              nation: Nation.GE,
              player: 'Daniel',
              cost: 4,
            }),
          );
          const game = Imperial.fromLog(log);
          const { cash } = game.players.Daniel;

          expect(cash).toEqual(0);
        });

        test('GE treasury has 4 million', () => {
          const log = mainLog.slice(0, 18);
          log.push(
            Action.bondPurchase({
              nation: Nation.GE,
              player: 'Daniel',
              cost: 4,
            }),
          );
          const game = Imperial.fromLog(log);
          const { treasury } = game.nations.get(Nation.GE);

          expect(treasury).toEqual(4);
        });
      });

      test("it is now FR's turn", () => {
        const log = mainLog.slice(0, 18);
        log.push(
          Action.bondPurchase({
            nation: Nation.GE,
            player: 'Daniel',
            cost: 4,
          }),
        );
        const game = Imperial.fromLog(log);
        const currentPlayerName = game.nations.get(Nation.FR).controller;

        expect(game.currentPlayerName).toEqual(currentPlayerName);
      });

      test('investor card is no longer active', () => {
        const log = mainLog.slice(0, 18);
        log.push(
          Action.bondPurchase({
            nation: Nation.GE,
            player: 'Daniel',
            cost: 4,
          }),
        );
        const game = Imperial.fromLog(log);

        expect(game.investorCardActive).toEqual(false);
      });
    });

    describe('3. FR builds a factory', () => {
      test('Claudia can choose where to put the factory', () => {
        const log = mainLog.slice(0, 19);
        log.push(
          Action.rondel({ nation: Nation.FR, cost: 0, slot: 'factory' }),
        );
        const game = Imperial.fromLog(log);
        const expectedActions = [
          Action.buildFactory({ province: 'brest' }),
          Action.buildFactory({ province: 'dijon' }),
          Action.buildFactory({ province: 'marseille' }),
        ];

        expect(game.availableActions).toEqual(new Set(expectedActions));
      });

      test('Marseille has a factory', () => {
        const log = mainLog.slice(0, 20);
        log.push(Action.buildFactory({ province: 'marseille' }));
        const game = Imperial.fromLog(log);
        const { factory } = game.provinces.get('marseille');

        expect(factory).toEqual('shipyard');
      });

      test('FR has 6 million in its treasury', () => {
        const log = mainLog.slice(0, 20);
        log.push(Action.buildFactory({ province: 'marseille' }));
        const game = Imperial.fromLog(log);
        const { treasury } = game.nations.get(Nation.FR);

        expect(treasury).toEqual(6);
      });

      test('Paris and Bordeaux have factories', () => {
        const log = mainLog.slice(0, 20);
        log.push(Action.buildFactory({ province: 'marseille' }));
        const game = Imperial.fromLog(log);
        const parisFactory = game.provinces.get('paris').factory;
        const bordeauxFactory = game.provinces.get('bordeaux').factory;

        expect(parisFactory).toEqual('armaments');
        expect(bordeauxFactory).toEqual('shipyard');
      });

      test("it is now GB's turn", () => {
        const log = mainLog.slice(0, 20);
        log.push(Action.buildFactory({ province: 'marseille' }));
        const game = Imperial.fromLog(log);
        const currentPlayerName = game.nations.get(Nation.GB).controller;

        expect(game.currentPlayerName).toEqual(currentPlayerName);
      });
    });

    describe('4. GB does production1', () => {
      test('London and Liverpool have units', () => {
        const log = mainLog.slice(0, 21);
        log.push(
          Action.rondel({ nation: Nation.GB, cost: 0, slot: 'production1' }),
        );
        const game = Imperial.fromLog(log);
        const londonFleetCount = game.units.get(Nation.GB).get('london').fleets;
        const liverpoolFleetCount = game.units.get(Nation.GB).get('liverpool')
          .fleets;

        expect(londonFleetCount).toEqual(1);
        expect(liverpoolFleetCount).toEqual(1);
      });

      test("it is now GE's turn", () => {
        const log = mainLog.slice(0, 21);
        log.push(
          Action.rondel({ nation: Nation.GB, cost: 0, slot: 'production1' }),
        );
        const game = Imperial.fromLog(log);
        const currentPlayerName = game.nations.get(Nation.GE).controller;

        expect(game.currentPlayerName).toEqual(currentPlayerName);
      });
    });

    describe('5. GE does production2', () => {
      test('Berlin and Hamburg have units', () => {
        const log = mainLog.slice(0, 22);
        log.push(
          Action.rondel({ nation: Nation.GE, cost: 0, slot: 'production2' }),
        );
        const game = Imperial.fromLog(log);
        const berlinArmyCount = game.units.get(Nation.GE).get('berlin').armies;
        const hamburgFleetCount = game.units.get(Nation.GE).get('hamburg')
          .fleets;

        expect(berlinArmyCount).toEqual(1);
        expect(hamburgFleetCount).toEqual(1);
      });

      test("it is now RU's turn", () => {
        const log = mainLog.slice(0, 22);
        log.push(
          Action.rondel({ nation: Nation.GE, cost: 0, slot: 'production2' }),
        );
        const game = Imperial.fromLog(log);
        const currentPlayerName = game.nations.get(Nation.RU).controller;

        expect(game.currentPlayerName).toEqual(currentPlayerName);
      });
    });

    describe('6. RU invests', () => {
      test('Turn begins with Anton holding the investor card', () => {
        const log = mainLog.slice(0, 23);
        const game = Imperial.fromLog(log);

        const { investorCardHolder } = game;

        expect(investorCardHolder).toEqual('Anton');
      });

      test('RU has 6 million left in the treasury', () => {
        const log = mainLog.slice(0, 23);
        log.push(
          Action.rondel({ nation: Nation.RU, cost: 0, slot: 'investor' }),
        );
        const game = Imperial.fromLog(log);
        const { treasury } = game.nations.get(Nation.RU);

        expect(treasury).toEqual(6);
      });

      test('Daniel has 4 million in cash', () => {
        const log = mainLog.slice(0, 23);
        log.push(
          Action.rondel({ nation: Nation.RU, cost: 0, slot: 'investor' }),
        );
        const game = Imperial.fromLog(log);
        const { cash } = game.players.Daniel;

        expect(cash).toEqual(4);
      });

      test('Bert has 3 million in cash', () => {
        const log = mainLog.slice(0, 23);
        log.push(
          Action.rondel({ nation: Nation.RU, cost: 0, slot: 'investor' }),
        );
        const game = Imperial.fromLog(log);
        const { cash } = game.players.Bert;

        expect(cash).toEqual(3);
      });

      test("IT's controller (Anton) has 8 million in cash", () => {
        const log = mainLog.slice(0, 23);
        log.push(
          Action.rondel({ nation: Nation.RU, cost: 0, slot: 'investor' }),
        );
        const game = Imperial.fromLog(log);
        const { cash } = game.players.Anton;

        expect(cash).toEqual(8);
      });

      test('Anton can buy a bond', () => {
        const log = mainLog.slice(0, 23);
        log.push(
          Action.rondel({ nation: Nation.RU, cost: 0, slot: 'investor' }),
        );
        const game = Imperial.fromLog(log);
        const expectedActions = new Set([
          Action.bondPurchase({ nation: Nation.AH, player: 'Anton', cost: 4 }),
          Action.bondPurchase({ nation: Nation.AH, player: 'Anton', cost: 6 }),
          Action.bondPurchase({ nation: Nation.IT, player: 'Anton', cost: 2 }),
          Action.bondPurchase({ nation: Nation.IT, player: 'Anton', cost: 4 }),
          Action.bondPurchase({ nation: Nation.IT, player: 'Anton', cost: 6 }),
          Action.bondPurchase({ nation: Nation.IT, player: 'Anton', cost: 12 }),
          Action.bondPurchase({ nation: Nation.IT, player: 'Anton', cost: 16 }),
          Action.bondPurchase({ nation: Nation.FR, player: 'Anton', cost: 4 }),
          Action.bondPurchase({ nation: Nation.FR, player: 'Anton', cost: 6 }),
          Action.bondPurchase({ nation: Nation.GB, player: 'Anton', cost: 4 }),
          Action.bondPurchase({ nation: Nation.GB, player: 'Anton', cost: 6 }),
          Action.bondPurchase({ nation: Nation.GE, player: 'Anton', cost: 2 }),
          Action.bondPurchase({ nation: Nation.GE, player: 'Anton', cost: 6 }),
          Action.bondPurchase({ nation: Nation.RU, player: 'Anton', cost: 4 }),
          Action.bondPurchase({ nation: Nation.RU, player: 'Anton', cost: 6 }),
        ]);

        expect(game.availableActions).toEqual(expectedActions);
      });

      describe('Investor-card holder (Anton) buys the 6 million bond of GE', () => {
        test('Investor-card holder (Anton) 2 million in cash', () => {
          const log = mainLog.slice(0, 24);
          log.push(
            Action.bondPurchase({
              nation: Nation.GE,
              player: 'Anton',
              cost: 6,
            }),
          );
          const game = Imperial.fromLog(log);
          const { cash } = game.players.Anton;

          expect(cash).toEqual(2);
        });

        test('GE treasury has 10 million', () => {
          const log = mainLog.slice(0, 24);
          log.push(
            Action.bondPurchase({
              nation: Nation.GE,
              player: 'Anton',
              cost: 6,
            }),
          );
          const game = Imperial.fromLog(log);
          const { treasury } = game.nations.get(Nation.GE);

          expect(treasury).toEqual(10);
        });

        test('Anton controls GE', () => {
          const log = mainLog.slice(0, 24);
          log.push(
            Action.bondPurchase({
              nation: Nation.GE,
              player: 'Anton',
              cost: 6,
            }),
          );
          const game = Imperial.fromLog(log);
          const { controller } = game.nations.get(Nation.GE);

          expect(controller).toEqual('Anton');
        });
      });
    });

    test("it is now AH's turn", () => {
      const log = mainLog.slice(0, 24);
      log.push(
        Action.bondPurchase({
          nation: Nation.GE,
          player: 'Anton',
          cost: 6,
        }),
      );
      const game = Imperial.fromLog(log);
      const currentPlayerName = game.nations.get(Nation.AH).controller;

      expect(game.currentPlayerName).toEqual(currentPlayerName);
    });
  });

  describe('second round', () => {
    describe('1. AH does production2', () => {
      const log = mainLog.slice(0, 25);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.AH, cost: 0, slot: 'production2' }),
      );

      test('vienna and budapest have 1 unit each', () => {
        const viennaArmyCount = game.units.get(Nation.AH).get('vienna').armies;
        const budapestArmyCount = game.units.get(Nation.AH).get('budapest')
          .armies;

        expect(viennaArmyCount).toEqual(1);
        expect(budapestArmyCount).toEqual(1);
      });

      test('AH treasury remains empty', () => {
        const AHTreasury = game.nations.get(Nation.AH).treasury;

        expect(AHTreasury).toEqual(0);
      });
    });

    describe('2. IT does production2', () => {
      const log = mainLog.slice(0, 26);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.IT, cost: 0, slot: 'production2' }),
      );

      test('rome and naples have 1 unit each', () => {
        const romeArmyCount = game.units.get(Nation.IT).get('rome').armies;
        const naplesFleetCount = game.units.get(Nation.IT).get('naples').fleets;

        expect(romeArmyCount).toEqual(1);
        expect(naplesFleetCount).toEqual(1);
      });
    });

    describe('3. FR does production1', () => {
      const log = mainLog.slice(0, 27);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.FR, cost: 0, slot: 'production1' }),
      );

      test('bordeaux, marseille, and paris have 1 unit each', () => {
        const bordeauxFleetCount = game.units.get(Nation.FR).get('bordeaux')
          .fleets;
        const marseilleFleetCount = game.units.get(Nation.FR).get('marseille')
          .fleets;
        const parisArmyCount = game.units.get(Nation.FR).get('paris').armies;

        expect(bordeauxFleetCount).toEqual(1);
        expect(marseilleFleetCount).toEqual(1);
        expect(parisArmyCount).toEqual(1);
      });
    });

    describe('4. GB does maneuver1', () => {
      const log = mainLog.slice(0, 28);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.GB, cost: 0, slot: 'maneuver1' }),
      );

      test("GB's available actions are to move liverpool and london fleets", () => {
        const availableActions = new Set([
          Action.endManeuver(),
          Action.maneuver({
            origin: 'liverpool',
            destination: 'northatlantic',
          }),
          Action.maneuver({ origin: 'london', destination: 'englishchannel' }),
          Action.maneuver({ origin: 'london', destination: 'northsea' }),
          Action.maneuver({ origin: 'london', destination: 'northatlantic' }),
        ]);

        expect(game.availableActions).toEqual(availableActions);
      });

      test('north atlantic and english channel have GB flags', () => {
        game.tick(
          Action.maneuver({
            origin: 'liverpool',
            destination: 'northatlantic',
          }),
        );
        game.tick(
          Action.maneuver({ origin: 'london', destination: 'englishchannel' }),
        );
        const northAtlanticFlag = game.provinces.get('northatlantic').flag;
        const englishChannelFlag = game.provinces.get('englishchannel').flag;

        expect(northAtlanticFlag).toEqual(Nation.GB);
        expect(englishChannelFlag).toEqual(Nation.GB);
      });
    });

    describe('5. GE does maneuver2', () => {
      const log = mainLog.slice(0, 31);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.GE, cost: 0, slot: 'maneuver2' }),
      );

      test("GE's available fleet maneuver is hamburg", () => {
        expect(game.availableActions).toEqual(
          new Set([
            Action.endManeuver(),
            Action.maneuver({ origin: 'hamburg', destination: 'northsea' }),
            Action.maneuver({ origin: 'hamburg', destination: 'balticsea' }),
            Action.maneuver({ origin: 'berlin', destination: 'danzig' }),
            Action.maneuver({ origin: 'berlin', destination: 'prague' }),
            Action.maneuver({ origin: 'berlin', destination: 'munich' }),
            Action.maneuver({ origin: 'berlin', destination: 'cologne' }),
            Action.maneuver({ origin: 'berlin', destination: 'hamburg' }),
            Action.maneuver({ origin: 'berlin', destination: 'dijon' }),
            Action.maneuver({ origin: 'berlin', destination: 'belgium' }),
            Action.maneuver({ origin: 'berlin', destination: 'holland' }),
            Action.maneuver({ origin: 'berlin', destination: 'denmark' }),
            Action.maneuver({ origin: 'berlin', destination: 'vienna' }),
            Action.maneuver({ origin: 'berlin', destination: 'warsaw' }),
            Action.maneuver({
              origin: 'berlin',
              destination: 'stpetersburg',
            }),
          ]),
        );
      });

      test("GE's available army maneuver is berlin", () => {
        game.tick(
          Action.maneuver({ origin: 'hamburg', destination: 'northsea' }),
        );

        const availableActions = new Set([
          Action.endManeuver(),
          Action.maneuver({ origin: 'berlin', destination: 'danzig' }),
          Action.maneuver({ origin: 'berlin', destination: 'prague' }),
          Action.maneuver({ origin: 'berlin', destination: 'munich' }),
          Action.maneuver({ origin: 'berlin', destination: 'cologne' }),
          Action.maneuver({ origin: 'berlin', destination: 'hamburg' }),
          Action.maneuver({ origin: 'berlin', destination: 'dijon' }),
          Action.maneuver({ origin: 'berlin', destination: 'belgium' }),
          Action.maneuver({ origin: 'berlin', destination: 'holland' }),
          Action.maneuver({ origin: 'berlin', destination: 'denmark' }),
          Action.maneuver({ origin: 'berlin', destination: 'sheffield' }),
          Action.maneuver({ origin: 'berlin', destination: 'edinburgh' }),
          Action.maneuver({ origin: 'berlin', destination: 'norway' }),
          Action.maneuver({ origin: 'berlin', destination: 'london' }),
          Action.maneuver({ origin: 'berlin', destination: 'stpetersburg' }),
          Action.maneuver({ origin: 'berlin', destination: 'warsaw' }),
          Action.maneuver({ origin: 'berlin', destination: 'vienna' }),
        ]);

        expect(game.availableActions).toEqual(availableActions);
      });

      test('north sea and norway have GE flags', () => {
        game.tick(Action.maneuver({ origin: 'berlin', destination: 'norway' }));
        const northSeaFlag = game.provinces.get('northsea').flag;
        const norwayFlag = game.provinces.get('norway').flag;

        expect(northSeaFlag).toEqual(Nation.GE);
        expect(norwayFlag).toEqual(Nation.GE);
      });
    });

    describe('6. Russia imports', () => {
      const log = mainLog.slice(0, 34);
      const game = Imperial.fromLog(log);

      game.tick(Action.rondel({ nation: Nation.RU, cost: 0, slot: 'import' }));

      describe('Russia imports 1 in St. Petersburg and 2 in Moscow', () => {
        game.tick(
          Action.import({
            placements: [
              { province: 'stpetersburg', type: 'fleet' },
              { province: 'moscow', type: 'army' },
              { province: 'moscow', type: 'army' },
            ],
          }),
        );

        test('RU has 1 fleet in st. petersburg and 2 armies in moscow', () => {
          const stPetersburgFleets = game.units
            .get(Nation.RU)
            .get('stpetersburg').fleets;
          const moscowArmies = game.units.get(Nation.RU).get('moscow').armies;

          expect(stPetersburgFleets).toEqual(1);
          expect(moscowArmies).toEqual(2);
        });

        test('RU has 3 million in treasury', () => {
          const { treasury } = game.nations.get(Nation.RU);

          expect(treasury).toEqual(3);
        });
      });
    });
  });

  describe('third round', () => {
    describe('1. AH does maneuver2', () => {
      const log = mainLog.slice(0, 37);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.AH, cost: 0, slot: 'maneuver2' }),
      );

      test("AH's available fleet maneuver is trieste", () => {
        const availableActions = new Set([
          Action.endManeuver(),
          Action.maneuver({ origin: 'trieste', destination: 'ioniansea' }),
        ]);
        const landDestinations = [
          'warsaw',
          'kiev',
          'prague',
          'romania',
          'danzig',
          'munich',
          'genoa',
          'venice',
          'berlin',
          'trieste',
          'westbalkan',
        ];
        landDestinations.forEach((province) => {
          availableActions.add(
            Action.maneuver({ origin: 'lemberg', destination: province }),
          );
          availableActions.add(
            Action.maneuver({ origin: 'budapest', destination: province }),
          );
          availableActions.add(
            Action.maneuver({ origin: 'vienna', destination: province }),
          );
        });
        availableActions.add(
          Action.maneuver({ origin: 'lemberg', destination: 'budapest' }),
        );
        availableActions.add(
          Action.maneuver({ origin: 'lemberg', destination: 'vienna' }),
        );
        availableActions.add(
          Action.maneuver({ origin: 'budapest', destination: 'lemberg' }),
        );
        availableActions.add(
          Action.maneuver({ origin: 'budapest', destination: 'vienna' }),
        );
        availableActions.add(
          Action.maneuver({ origin: 'vienna', destination: 'budapest' }),
        );
        availableActions.add(
          Action.maneuver({ origin: 'vienna', destination: 'lemberg' }),
        );

        expect(game.availableActions).toEqual(availableActions);
      });

      test("AH's available army maneuvers are lemberg, budapest, and vienna", () => {
        game.tick(
          Action.maneuver({ origin: 'trieste', destination: 'ioniansea' }),
        );
        const availableActions = new Set([Action.endManeuver()]);
        const landDestinations = [
          'warsaw',
          'kiev',
          'prague',
          'romania',
          'danzig',
          'munich',
          'genoa',
          'venice',
          'berlin',
          'trieste',
          'westbalkan',
          'rome',
          'naples',
          'greece',
          'tunis',
        ];
        landDestinations.forEach((province) => {
          availableActions.add(
            Action.maneuver({ origin: 'lemberg', destination: province }),
          );
          availableActions.add(
            Action.maneuver({ origin: 'budapest', destination: province }),
          );
          availableActions.add(
            Action.maneuver({ origin: 'vienna', destination: province }),
          );
        });
        availableActions.add(
          Action.maneuver({ origin: 'lemberg', destination: 'budapest' }),
        );
        availableActions.add(
          Action.maneuver({ origin: 'lemberg', destination: 'vienna' }),
        );
        availableActions.add(
          Action.maneuver({ origin: 'budapest', destination: 'lemberg' }),
        );
        availableActions.add(
          Action.maneuver({ origin: 'budapest', destination: 'vienna' }),
        );
        availableActions.add(
          Action.maneuver({ origin: 'vienna', destination: 'lemberg' }),
        );
        availableActions.add(
          Action.maneuver({ origin: 'vienna', destination: 'budapest' }),
        );

        expect(game.availableActions).toEqual(availableActions);
      });

      test('ionian sea, romania, west balkan, and tunis have AH flags', () => {
        game.tick(
          Action.maneuver({ origin: 'lemberg', destination: 'romania' }),
        );
        game.tick(
          Action.maneuver({ origin: 'budapest', destination: 'westbalkan' }),
        );
        game.tick(Action.maneuver({ origin: 'vienna', destination: 'tunis' }));

        const ionianSeaFlag = game.provinces.get('ioniansea').flag;
        const romaniaFlag = game.provinces.get('romania').flag;
        const westBalkanFlag = game.provinces.get('westbalkan').flag;
        const tunisFlag = game.provinces.get('tunis').flag;

        expect(ionianSeaFlag).toEqual(Nation.AH);
        expect(romaniaFlag).toEqual(Nation.AH);
        expect(westBalkanFlag).toEqual(Nation.AH);
        expect(tunisFlag).toEqual(Nation.AH);
      });
    });

    describe('2. IT does maneuver2', () => {
      const log = mainLog.slice(0, 43);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.IT, cost: 0, slot: 'maneuver2' }),
      );

      test("IT's available fleet maneuver is naples", () => {
        const availableActions = new Set([
          Action.endManeuver(),
          Action.maneuver({
            origin: 'naples',
            destination: 'westernmediterraneansea',
          }),
          Action.maneuver({
            origin: 'naples',
            destination: 'ioniansea',
          }),
        ]);
        const landDestinations = [
          'naples',
          'genoa',
          'florence',
          'venice',
          'marseille',
          'vienna',
          'trieste',
        ];
        landDestinations.forEach((province) => {
          availableActions.add(
            Action.maneuver({ origin: 'rome', destination: province }),
          );
        });

        expect(game.currentNation).toEqual(Nation.IT);
        expect(game.availableActions).toEqual(availableActions);
      });

      test("IT's available army maneuver is rome", () => {
        game.tick(
          Action.maneuver({
            origin: 'naples',
            destination: 'westernmediterraneansea',
          }),
        );
        const availableActions = new Set([Action.endManeuver()]);
        const landDestinations = [
          'naples',
          'tunis',
          'algeria',
          'spain',
          'marseille',
          'genoa',
          'florence',
          'venice',
          'vienna',
          'trieste',
        ];
        landDestinations.forEach((province) => {
          availableActions.add(
            Action.maneuver({ origin: 'rome', destination: province }),
          );
        });

        expect(game.availableActions).toEqual(availableActions);
      });

      test('spain and western mediterranean sea have IT flags', () => {
        game.tick(Action.maneuver({ origin: 'rome', destination: 'spain' }));
        const westernMediterraneanSeaFlag = game.provinces.get(
          'westernmediterraneansea',
        ).flag;
        const spainFlag = game.provinces.get('spain').flag;

        expect(westernMediterraneanSeaFlag).toEqual(Nation.IT);
        expect(spainFlag).toEqual(Nation.IT);
      });
    });

    describe('3. FR does maneuver1', () => {
      const log = mainLog.slice(0, 46);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.FR, cost: 0, slot: 'maneuver1' }),
      );

      test("FR's available fleet maneuvers are bordeaux and marseille", () => {
        const availableActions = new Set([
          Action.endManeuver(),
          Action.maneuver({
            origin: 'bordeaux',
            destination: 'bayofbiscay',
          }),
          Action.maneuver({
            origin: 'marseille',
            destination: 'westernmediterraneansea',
          }),
        ]);
        const landDestinations = [
          'brest',
          'dijon',
          'bordeaux',
          'marseille',
          'belgium',
          'genoa',
          'munich',
          'spain',
        ];
        landDestinations.forEach((province) => {
          availableActions.add(
            Action.maneuver({ origin: 'paris', destination: province }),
          );
        });

        expect(game.availableActions).toEqual(availableActions);
      });

      test('IT controller (Anton) can choose whether to fight or allow FR fleet to coexist in western mediterranean sea', () => {
        game.tick(
          Action.maneuver({
            origin: 'marseille',
            destination: 'westernmediterraneansea',
          }),
        );
        const expectedActions = [
          Action.coexist({
            province: 'westernmediterraneansea',
            incumbent: Nation.IT,
            challenger: Nation.FR,
          }),
          Action.fight({
            province: 'westernmediterraneansea',
            incumbent: Nation.IT,
            challenger: Nation.FR,
            targetType: 'fleet',
          }),
        ];

        expect(game.availableActions).toEqual(new Set(expectedActions));
      });

      test('IT chooses to fight so both fleets get removed', () => {
        game.tick(
          Action.fight({
            province: 'westernmediterraneansea',
            incumbent: Nation.IT,
            challenger: Nation.FR,
            targetType: 'fleet',
          }),
        );
        const westernMed = game.provinces.get('westernmediterraneansea');

        expect(
          game.units.get(Nation.IT).get('westernmediterraneansea').fleets,
        ).toEqual(0);
        expect(
          game.units.get(Nation.FR).get('westernmediterraneansea').fleets,
        ).toEqual(0);
        expect(westernMed.flag).toEqual(Nation.IT);
      });

      test("FR's available army maneuver is paris", () => {
        game.tick(
          Action.maneuver({
            origin: 'bordeaux',
            destination: 'bayofbiscay',
          }),
        );
        const landDestinations = [
          'brest',
          'dijon',
          'belgium',
          'munich',
          'bordeaux',
          'marseille',
          'genoa',
          'spain',
          'portugal',
          'morocco',
        ];
        const availableActions = new Set([Action.endManeuver()]);
        landDestinations.forEach((province) => {
          availableActions.add(
            Action.maneuver({ origin: 'paris', destination: province }),
          );
        });

        expect(game.availableActions).toEqual(availableActions);
      });

      test('Morocco and bay of biscay have FR flags', () => {
        game.tick(
          Action.maneuver({
            origin: 'paris',
            destination: 'morocco',
          }),
        );

        expect(game.units.get(Nation.FR).get('bayofbiscay').fleets).toEqual(1);
        expect(game.provinces.get('bayofbiscay').flag).toEqual(Nation.FR);
        expect(game.units.get(Nation.FR).get('morocco').armies).toEqual(1);
        expect(game.provinces.get('morocco').flag).toEqual(Nation.FR);
      });
    });

    describe('4. GB invests', () => {
      const log = mainLog.slice(0, 51);
      const game = Imperial.fromLog(log);

      game.tick(
        Action.rondel({ nation: Nation.GB, cost: 0, slot: 'investor' }),
      );

      test('GB has 6 million left in the treasury', () => {
        const { treasury } = game.nations.get(Nation.GB);

        expect(treasury).toEqual(6);
      });

      test("Bert (GB's controller and investor-card holder) has 9 million in cash", () => {
        const { controller } = game.nations.get(Nation.GB);
        const { cash } = game.players[controller];

        expect(cash).toEqual(9);
      });

      test('Bert can buy a bond', () => {
        const expectedActions = [
          Action.bondPurchase({ nation: Nation.AH, player: 'Bert', cost: 4 }),
          Action.bondPurchase({ nation: Nation.AH, player: 'Bert', cost: 6 }),
          Action.bondPurchase({ nation: Nation.AH, player: 'Bert', cost: 9 }),
          Action.bondPurchase({ nation: Nation.IT, player: 'Bert', cost: 2 }),
          Action.bondPurchase({ nation: Nation.IT, player: 'Bert', cost: 4 }),
          Action.bondPurchase({ nation: Nation.IT, player: 'Bert', cost: 6 }),
          Action.bondPurchase({ nation: Nation.FR, player: 'Bert', cost: 4 }),
          Action.bondPurchase({ nation: Nation.FR, player: 'Bert', cost: 6 }),
          Action.bondPurchase({ nation: Nation.GB, player: 'Bert', cost: 4 }),
          Action.bondPurchase({ nation: Nation.GB, player: 'Bert', cost: 6 }),
          Action.bondPurchase({ nation: Nation.GB, player: 'Bert', cost: 12 }),
          Action.bondPurchase({ nation: Nation.GB, player: 'Bert', cost: 16 }),
          Action.bondPurchase({ nation: Nation.GE, player: 'Bert', cost: 2 }),
          Action.bondPurchase({ nation: Nation.GE, player: 'Bert', cost: 9 }),
          Action.bondPurchase({ nation: Nation.RU, player: 'Bert', cost: 4 }),
          Action.bondPurchase({ nation: Nation.RU, player: 'Bert', cost: 6 }),
        ];

        expect(game.availableActions).toEqual(new Set(expectedActions));
      });

      describe('Investor-card holder (Bert) buys the 6 million bond of RU', () => {
        test('Bert has 3 million', () => {
          game.tick(
            Action.bondPurchase({ nation: Nation.RU, player: 'Bert', cost: 6 }),
          );
          const { cash } = game.players.Bert;

          expect(cash).toEqual(3);
        });

        test('RU treasury has 9 million', () => {
          const { treasury } = game.nations.get(Nation.RU);

          expect(treasury).toEqual(9);
        });
      });
    });

    describe('5. GE does taxation', () => {
      const log = mainLog.slice(0, 53);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.GE, cost: 0, slot: 'taxation' }),
      );

      describe('consequences', () => {
        test('GE has 14 million in its treasury', () => {
          const { treasury } = game.nations.get(Nation.GE);

          expect(treasury).toEqual(14);
        });

        test('GE moves up one field on tax chart', () => {
          const { taxChartPosition } = game.nations.get(Nation.GE);

          expect(taxChartPosition).toEqual(6);
        });

        test('GE receives 1 power point', () => {
          const { powerPoints } = game.nations.get(Nation.GE);

          expect(powerPoints).toEqual(1);
        });

        test('Anton has 4 million cash', () => {
          const { cash } = game.players.Anton;

          expect(cash).toEqual(4);
        });
      });
    });

    describe('6. RU does production2', () => {
      const log = mainLog.slice(0, 54);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.RU, cost: 0, slot: 'production2' }),
      );

      test('Odessa and Moscow have units', () => {
        const odessaFleetCount = game.units.get(Nation.RU).get('odessa').fleets;
        const moscowArmyCount = game.units.get(Nation.RU).get('moscow').armies;

        expect(odessaFleetCount).toEqual(1);
        expect(moscowArmyCount).toEqual(3);
      });
    });
  });

  describe('fourth round', () => {
    describe('1. AH does taxation', () => {
      const log = mainLog.slice(0, 55);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.AH, cost: 0, slot: 'taxation' }),
      );

      describe('consequences', () => {
        test('AH has 4 million in its treasury', () => {
          const { treasury } = game.nations.get(Nation.AH);

          expect(treasury).toEqual(4);
        });

        test('AH moves up to position 8 on the tax chart', () => {
          const { taxChartPosition } = game.nations.get(Nation.AH);

          expect(taxChartPosition).toEqual(8);
        });

        test('AH receives 3 power points', () => {
          const { powerPoints } = game.nations.get(Nation.AH);

          expect(powerPoints).toEqual(3);
        });

        test('Claudia has 5 million cash', () => {
          const { cash } = game.players.Claudia;

          expect(cash).toEqual(5);
        });
      });
    });

    describe('2. IT does production1', () => {
      const log = mainLog.slice(0, 56);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.IT, cost: 0, slot: 'production1' }),
      );

      test('Rome and Naples have units', () => {
        const romeArmyCount = game.units.get(Nation.IT).get('rome').armies;
        const naplesFleetCount = game.units.get(Nation.IT).get('naples').fleets;

        expect(romeArmyCount).toEqual(1);
        expect(naplesFleetCount).toEqual(1);
      });
    });

    describe('3. FR does production2', () => {
      const log = mainLog.slice(0, 57);
      const game = Imperial.fromLog(log);

      game.tick(
        Action.rondel({ nation: Nation.FR, cost: 0, slot: 'production2' }),
      );

      test('Bordeaux, Marseille and Paris have units', () => {
        const bordeauxFleetCount = game.units.get(Nation.FR).get('bordeaux')
          .fleets;
        const marseilleFleetCount = game.units.get(Nation.FR).get('marseille')
          .fleets;
        const parisArmyCount = game.units.get(Nation.FR).get('paris').armies;

        expect(bordeauxFleetCount).toEqual(1);
        expect(marseilleFleetCount).toEqual(1);
        expect(parisArmyCount).toEqual(1);
      });

      describe('investor card is activated', () => {
        test('Claudia (investor card owner) starts the turn with 7 million', () => {
          const { cash } = game.players.Claudia;

          expect(cash).toEqual(7);
        });

        test('Claudia can buy a bond', () => {
          const expectedActions = new Set([
            Action.bondPurchase({
              nation: Nation.AH,
              player: 'Claudia',
              cost: 4,
            }),
            Action.bondPurchase({
              nation: Nation.AH,
              player: 'Claudia',
              cost: 9,
            }),
            Action.bondPurchase({
              nation: Nation.AH,
              player: 'Claudia',
              cost: 6,
            }),
            Action.bondPurchase({
              nation: Nation.FR,
              player: 'Claudia',
              cost: 6,
            }),
            Action.bondPurchase({
              nation: Nation.FR,
              player: 'Claudia',
              cost: 12,
            }),
            Action.bondPurchase({
              nation: Nation.FR,
              player: 'Claudia',
              cost: 16,
            }),
            Action.bondPurchase({
              nation: Nation.IT,
              player: 'Claudia',
              cost: 2,
            }),
            Action.bondPurchase({
              nation: Nation.IT,
              player: 'Claudia',
              cost: 4,
            }),
            Action.bondPurchase({
              nation: Nation.IT,
              player: 'Claudia',
              cost: 6,
            }),
            Action.bondPurchase({
              nation: Nation.FR,
              player: 'Claudia',
              cost: 4,
            }),
            Action.bondPurchase({
              nation: Nation.FR,
              player: 'Claudia',
              cost: 6,
            }),
            Action.bondPurchase({
              nation: Nation.GB,
              player: 'Claudia',
              cost: 4,
            }),
            Action.bondPurchase({
              nation: Nation.GB,
              player: 'Claudia',
              cost: 6,
            }),
            Action.bondPurchase({
              nation: Nation.GE,
              player: 'Claudia',
              cost: 2,
            }),
            Action.bondPurchase({
              nation: Nation.RU,
              player: 'Claudia',
              cost: 4,
            }),
          ]);
          expect(game.availableActions).toEqual(expectedActions);
        });

        describe('Claudia buys a 6 million AH bond', () => {
          test('Claudia has 1 million in cash', () => {
            game.tick(
              Action.bondPurchase({
                nation: Nation.AH,
                player: 'Claudia',
                cost: 6,
              }),
            );
            const { cash } = game.players.Claudia;

            expect(cash).toEqual(1);
          });

          test('Claudia has the #3 AH bond', () => {
            const { bonds } = game.players.Claudia;

            expect(bonds).toEqual(
              new Set([
                Bond(Nation.AH, 1),
                Bond(Nation.FR, 4),
                Bond(Nation.AH, 3),
              ]),
            );
          });
        });

        test('Daniel is the investor card owner', () => {
          expect(game.investorCardHolder).toEqual('Daniel');
        });
      });
    });

    describe('4. GB does production2', () => {
      const log = mainLog.slice(0, 59);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.GB, cost: 0, slot: 'production2' }),
      );

      test('London and Liverpool have GB fleets', () => {
        const londonFleetCount = game.units.get(Nation.GB).get('london').fleets;
        const liverpoolFleetCount = game.units.get(Nation.GB).get('liverpool')
          .fleets;

        expect(londonFleetCount).toEqual(1);
        expect(liverpoolFleetCount).toEqual(1);
      });
    });

    describe('5. GE builds a factory', () => {
      const log = mainLog.slice(0, 60);
      const game = Imperial.fromLog(log);

      test('GE can choose where to build the factory', () => {
        game.tick(
          Action.rondel({ nation: Nation.GE, cost: 0, slot: 'factory' }),
        );

        const expected = new Set(
          ['danzig', 'munich', 'cologne'].forEach((province) => Action.buildFactory({ province })),
        );

        expect(game.availableActions).toEqual(expected);
      });

      describe('GE builds a factory in Cologne', () => {
        test('Cologne has a factory', () => {
          game.tick(Action.buildFactory({ province: 'cologne' }));

          const { factory } = game.provinces.get('cologne');

          expect(factory).toEqual('armaments');
        });

        test('GE has 9 treasury', () => {
          const { treasury } = game.nations.get(Nation.GE);

          expect(treasury).toEqual(9);
        });
      });
    });

    describe('6. RU does maneuver2', () => {
      const log = mainLog.slice(0, 62);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.RU, cost: 0, slot: 'maneuver2' }),
      );

      test("RU's available fleet maneuvers are st. petersburg and odessa", () => {
        const availableActions = new Set([
          Action.endManeuver(),
          Action.maneuver({
            origin: 'stpetersburg',
            destination: 'balticsea',
          }),
          Action.maneuver({
            origin: 'odessa',
            destination: 'blacksea',
          }),
        ]);
        const landDestinations = [
          'warsaw',
          'odessa',
          'kiev',
          'stpetersburg',
          'danzig',
          'prague',
          'lemberg',
          'romania',
        ];
        landDestinations.forEach((province) => {
          availableActions.add(
            Action.maneuver({ origin: 'moscow', destination: province }),
          );
        });

        expect(game.availableActions).toEqual(availableActions);
      });

      test("RU's available army maneuver is moscow (x3)", () => {
        game.tick(
          Action.maneuver({
            origin: 'stpetersburg',
            destination: 'balticsea',
          }),
        );
        game.tick(
          Action.maneuver({
            origin: 'odessa',
            destination: 'blacksea',
          }),
        );
        const availableActions = new Set([Action.endManeuver()]);
        const landDestinations = [
          'warsaw',
          'odessa',
          'kiev',
          'stpetersburg',
          'danzig',
          'prague',
          'lemberg',
          'romania',
          'bulgaria',
          'turkey',
          'sweden',
          'berlin',
          'hamburg',
          'denmark',
          'norway',
        ];
        landDestinations.forEach((province) => {
          availableActions.add(
            Action.maneuver({ origin: 'moscow', destination: province }),
          );
        });

        expect(game.availableActions).toEqual(availableActions);
      });

      test('Sweden, Baltic Sea, Black Sea, and Turkey have RU flags', () => {
        game.tick(
          Action.maneuver({
            origin: 'moscow',
            destination: 'sweden',
          }),
        );
        game.tick(
          Action.maneuver({
            origin: 'moscow',
            destination: 'turkey',
          }),
        );
        game.tick(
          Action.maneuver({
            origin: 'moscow',
            destination: 'lemberg',
          }),
        );
        const balticSeaFlag = game.provinces.get('balticsea').flag;
        const swedenFlag = game.provinces.get('sweden').flag;
        const blackSeaFlag = game.provinces.get('blacksea').flag;
        const turkeyFlag = game.provinces.get('turkey').flag;

        expect(balticSeaFlag).toEqual(Nation.RU);
        expect(swedenFlag).toEqual(Nation.RU);
        expect(blackSeaFlag).toEqual(Nation.RU);
        expect(turkeyFlag).toEqual(Nation.RU);
      });
    });
  });

  describe('fifth round', () => {
    describe('1. AH does maneuver1', () => {
      const log = mainLog.slice(0, 68);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.AH, cost: 0, slot: 'maneuver1' }),
      );

      test("AH's available fleet maneuver is ionian sea", () => {
        const availableActions = new Set([
          Action.endManeuver(),
          Action.maneuver({
            origin: 'ioniansea',
            destination: 'westernmediterraneansea',
          }),
          Action.maneuver({
            origin: 'ioniansea',
            destination: 'easternmediterraneansea',
          }),
        ]);
        const romaniaDestinations = [
          'odessa',
          'kiev',
          'lemberg',
          'budapest',
          'bulgaria',
          'westbalkan',
        ];
        romaniaDestinations.forEach((province) => {
          availableActions.add(
            Action.maneuver({ origin: 'romania', destination: province }),
          );
        });
        const westBalkanDestinations = [
          'greece',
          'bulgaria',
          'romania',
          'trieste',
          'budapest',
          'tunis',
          'naples',
          'venice',
          'rome',
        ];
        westBalkanDestinations.forEach((province) => {
          availableActions.add(
            Action.maneuver({ origin: 'westbalkan', destination: province }),
          );
        });
        availableActions.add(
          Action.maneuver({ origin: 'tunis', destination: 'algeria' }),
        );
        const tunisConvoyDestinations = [
          'westbalkan',
          'greece',
          'trieste',
          'naples',
          'venice',
          'rome',
        ];
        tunisConvoyDestinations.forEach((province) => {
          availableActions.add(
            Action.maneuver({ origin: 'tunis', destination: province }),
          );
        });

        expect(game.currentNation).toEqual(Nation.AH);
        expect(game.availableActions).toEqual(availableActions);
      });

      test("AH's available army maneuvers are Tunis, West Balkan, and Romania", () => {
        game.tick(
          Action.maneuver({
            origin: 'ioniansea',
            destination: 'westernmediterraneansea',
          }),
        );
        const availableActions = new Set([Action.endManeuver()]);
        const romaniaDestinations = [
          'odessa',
          'bulgaria',
          'westbalkan',
          'budapest',
          'lemberg',
          'kiev',
        ];
        romaniaDestinations.forEach((province) => {
          availableActions.add(
            Action.maneuver({ origin: 'romania', destination: province }),
          );
        });
        const westBalkanDestinations = [
          'greece',
          'bulgaria',
          'romania',
          'trieste',
          'budapest',
        ];
        westBalkanDestinations.forEach((province) => {
          availableActions.add(
            Action.maneuver({ origin: 'westbalkan', destination: province }),
          );
        });
        const tunisDestinations = [
          'algeria',
          'florence',
          'rome',
          'naples',
          'genoa',
          'marseille',
          'spain',
        ];
        tunisDestinations.forEach((province) => {
          availableActions.add(
            Action.maneuver({ origin: 'tunis', destination: province }),
          );
        });

        expect(game.availableActions).toEqual(availableActions);
      });

      test('Algeria, Bulgaria, and Western Mediterranean have AH flags', () => {
        game.tick(Action.maneuver({ origin: 'tunis', destination: 'algeria' }));
        game.tick(
          Action.maneuver({ origin: 'westbalkan', destination: 'bulgaria' }),
        );
        game.tick(
          Action.maneuver({ origin: 'romania', destination: 'odessa' }),
        );
        const westernMediterraneanSeaFlag = game.provinces.get(
          'westernmediterraneansea',
        ).flag;
        const algeriaFlag = game.provinces.get('algeria').flag;
        const bulgariaFlag = game.provinces.get('bulgaria').flag;

        expect(westernMediterraneanSeaFlag).toEqual(Nation.AH);
        expect(algeriaFlag).toEqual(Nation.AH);
        expect(bulgariaFlag).toEqual(Nation.AH);
      });
    });

    describe('2. IT invests', () => {
      const log = mainLog.slice(0, 74);
      const game = Imperial.fromLog(log);
      game.tick(
        Action.rondel({ nation: Nation.IT, cost: 0, slot: 'investor' }),
      );

      test('IT has 1 left in the treasury', () => {
        const { treasury } = game.nations.get(Nation.IT);

        expect(treasury).toEqual(1);
      });

      test("Anton (IT's controller) has 8 million in cash", () => {
        const { controller } = game.nations.get(Nation.IT);
        const { cash } = game.players[controller];

        expect(cash).toEqual(8);
      });

      describe('investor card is activated', () => {
        test('Daniel (investor card holder) has 6 million in cash', () => {
          const { cash } = game.players[game.investorCardHolder];

          expect(cash).toEqual(6);
        });

        test('Daniel can buy a bond', () => {
          const expectedActions = new Set([
            Action.bondPurchase({
              nation: Nation.AH,
              player: 'Daniel',
              cost: 4,
            }),
            Action.bondPurchase({
              nation: Nation.IT,
              player: 'Daniel',
              cost: 2,
            }),
            Action.bondPurchase({
              nation: Nation.IT,
              player: 'Daniel',
              cost: 4,
            }),
            Action.bondPurchase({
              nation: Nation.IT,
              player: 'Daniel',
              cost: 6,
            }),
            Action.bondPurchase({
              nation: Nation.FR,
              player: 'Daniel',
              cost: 4,
            }),
            Action.bondPurchase({
              nation: Nation.FR,
              player: 'Daniel',
              cost: 6,
            }),
            Action.bondPurchase({
              nation: Nation.GB,
              player: 'Daniel',
              cost: 4,
            }),
            Action.bondPurchase({
              nation: Nation.GB,
              player: 'Daniel',
              cost: 6,
            }),
            Action.bondPurchase({
              nation: Nation.GE,
              player: 'Daniel',
              cost: 2,
            }),
            Action.bondPurchase({
              nation: Nation.GE,
              player: 'Daniel',
              cost: 9,
            }),
            Action.bondPurchase({
              nation: Nation.RU,
              player: 'Daniel',
              cost: 4,
            }),
            Action.bondPurchase({
              nation: Nation.RU,
              player: 'Daniel',
              cost: 12,
            }),
          ]);

          expect(game.availableActions).toEqual(expectedActions);
        });

        test('Daniel has a 9 million GE bond and does not have a 4 million GE bond', () => {
          game.tick(
            Action.bondPurchase({
              nation: Nation.GE,
              player: 'Daniel',
              cost: 9,
            }),
          );
          const expectedBonds = new Set([
            Bond(Nation.FR, 1),
            Bond(Nation.RU, 4),
            Bond(Nation.GE, 4),
          ]);

          expect(game.players.Daniel.bonds).toEqual(expectedBonds);
        });

        test('Daniel has 1 million in cash', () => {
          const { cash } = game.players.Daniel;

          expect(cash).toEqual(1);
        });

        test('GE has 14 million in treasury', () => {
          const { treasury } = game.nations.get(Nation.GE);

          expect(treasury).toEqual(14);
        });

        test('Daniel controls GE', () => {
          const { controller } = game.nations.get(Nation.GE);

          expect(controller).toEqual('Daniel');
        });

        test('Anton holds the investor card', () => {
          expect(game.investorCardHolder).toEqual('Anton');
        });
      });
    });
  });
});

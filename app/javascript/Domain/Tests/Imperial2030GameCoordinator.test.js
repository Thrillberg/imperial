import Action from '../action';

import { Nation2030 } from '../constants';
import GameBoard from '../gameBoard';
import Imperial from '../ImperialGameCoordinator';

import MoveToRondelSlot from '../UseCases/Rondels/MoveToSlot';

const initialize = (game) => {
  game.tick(
    Action.initialize({
      players: [
        { id: 'player1', nation: Nation2030.RU },
        { id: 'player2', nation: Nation2030.CN },
      ],
      soloMode: false,
      variant: 'standard',
      baseGame: 'imperial2030',
    }),
  );
};

describe('imperial2030', () => {
  describe('taxation', () => {
    const newGame = () => {
      const board = new GameBoard({
        nodes: [
          { name: 'a', nation: Nation2030.RU },
          { name: 'b', nation: Nation2030.RU },
          { name: 'c', nation: null },
          { name: 'd', nation: null },
          { name: 'e', nation: Nation2030.RU },
          { name: 'f', nation: Nation2030.RU },
          { name: 'g', nation: null },
          { name: 'h', nation: null },
          { name: 'i', nation: null },
          { name: 'j', nation: null },
          { name: 'k', nation: null },
          { name: 'l', nation: null },
          { name: 'm', nation: null },
          { name: 'n', nation: null },
          { name: 'o', nation: null },
          { name: 'p', nation: null },
          { name: 'q', nation: null },
          { name: 'r', nation: null },
          { name: 's', nation: null },
          { name: 't', nation: null },
        ],
        edges: [],
      });

      const game = new Imperial(board);
      initialize(game);
      return game;
    };

    describe('tax revenue / success bonus & collecting money', () => {
      test('taxes are paid out', () => {
        const game = newGame();
        // Place two RU factories on the board
        game.provinces.get('a').factory = 'armaments';
        game.provinces.get('b').factory = 'armaments';
        // Add a flag for RU
        game.provinces.get('c').flag = Nation2030.RU;
        // Arbitrarily give RU 5 treasury; we want this to increase by 5
        game.nations.get(Nation2030.RU).treasury = 5;

        game.tick(
          Action.rondel({ cost: 0, nation: Nation2030.RU, slot: 'taxation' }),
        );

        expect(game.nations.get(Nation2030.RU).treasury).toEqual(10);
      });

      test('occupied factories generate no taxes', () => {
        const game = newGame();
        // Place three RU factories on the board
        game.provinces.get('a').factory = 'armaments';
        game.provinces.get('b').factory = 'armaments';
        game.provinces.get('e').factory = 'armaments';
        // Add a flag for RU
        game.provinces.get('c').flag = Nation2030.RU;
        // China is occupying "a"!
        game.units.get(Nation2030.CN).get('a').armies = 1;
        // Arbitrarily give RU 5 treasury; we want this to increase by 5
        game.nations.get(Nation2030.RU).treasury = 5;

        game.tick(
          Action.rondel({ cost: 0, nation: Nation2030.RU, slot: 'taxation' }),
        );

        expect(game.nations.get(Nation2030.RU).treasury).toEqual(10);
      });

      test('tax revenue cannot exceed 23', () => {
        const game = newGame();
        // Place four RU factories on the board
        game.provinces.get('a').factory = 'armaments';
        game.provinces.get('b').factory = 'armaments';
        game.provinces.get('e').factory = 'armaments';
        game.provinces.get('f').factory = 'armaments';
        // Add sixteen flags for RU
        game.provinces.get('c').flag = Nation2030.RU;
        game.provinces.get('d').flag = Nation2030.RU;
        game.provinces.get('d').flag = Nation2030.RU;
        game.provinces.get('h').flag = Nation2030.RU;
        game.provinces.get('i').flag = Nation2030.RU;
        game.provinces.get('j').flag = Nation2030.RU;
        game.provinces.get('k').flag = Nation2030.RU;
        game.provinces.get('l').flag = Nation2030.RU;
        game.provinces.get('m').flag = Nation2030.RU;
        game.provinces.get('n').flag = Nation2030.RU;
        game.provinces.get('o').flag = Nation2030.RU;
        game.provinces.get('p').flag = Nation2030.RU;
        game.provinces.get('q').flag = Nation2030.RU;
        game.provinces.get('r').flag = Nation2030.RU;
        game.provinces.get('s').flag = Nation2030.RU;
        game.provinces.get('t').flag = Nation2030.RU;
        // Arbitrarily give RU 5 treasury; we want this to increase by 23, not 24
        game.nations.get(Nation2030.RU).treasury = 5;

        game.tick(
          Action.rondel({ cost: 0, nation: Nation2030.RU, slot: 'taxation' }),
        );

        expect(game.nations.get(Nation2030.RU).treasury).toEqual(23);
      });

      test('payment to nation is reduced if they control units', () => {
        const game = newGame();
        // Place two RU factories on the board
        game.provinces.get('a').factory = 'armaments';
        game.provinces.get('b').factory = 'armaments';
        // Add two flags for RU
        game.provinces.get('c').flag = Nation2030.RU;
        game.provinces.get('d').flag = Nation2030.RU;
        // Arbitrarily give RU 5 treasury; we want this to increase to 10 (then reduce to 9)
        game.nations.get(Nation2030.RU).treasury = 5;
        // AH controls one army
        game.units.get(Nation2030.RU).get('a').armies = 1;

        game.tick(
          Action.rondel({ cost: 0, nation: Nation2030.RU, slot: 'taxation' }),
        );

        expect(game.nations.get(Nation2030.RU).treasury).toEqual(9);
      });

      test('nations lose money if they control many units', () => {
        const game = newGame();
        // Arbitrarily give RU 5 treasury; we want this to decrease by 1
        game.nations.get(Nation2030.RU).treasury = 5;
        // RU controls one army
        game.units.get(Nation2030.RU).get('a').armies = 1;

        game.tick(
          Action.rondel({ cost: 0, nation: Nation2030.RU, slot: 'taxation' }),
        );

        expect(game.nations.get(Nation2030.RU).treasury).toEqual(4);
      });

      test("player is paid from nation's treasury", () => {
        const game = newGame();
        // Place two RU factories on the board
        game.provinces.get('a').factory = 'armaments';
        game.provinces.get('b').factory = 'armaments';
        // Add two flags for RU
        game.provinces.get('c').flag = Nation2030.RU;
        game.provinces.get('d').flag = Nation2030.RU;
        // RU controls one army
        game.units.get(Nation2030.RU).get('a').armies = 1;
        // Arbitrarily give RU 0 treasury, which will increase to 6 when initially collecting taxes
        // and decrease to 5 for soldiers' pay
        game.nations.get(Nation2030.RU).treasury = 0;
        // Arbitrarily give controlling player 5 cash;
        // we want this to increase to 6 and RU treasury to decrease to 4
        game.players.player1.cash = 5;

        game.tick(
          Action.rondel({ cost: 0, nation: Nation2030.RU, slot: 'taxation' }),
        );

        expect(game.nations.get(Nation2030.RU).treasury).toEqual(4);
        expect(game.players.player1.cash).toEqual(6);
      });
    });

    describe('adding power points', () => {
      test('nation earns no power points', () => {
        const game = newGame();
        // Arbitrarily give RU 3 power points
        game.nations.get(Nation2030.RU).powerPoints = 3;

        game.tick(
          Action.rondel({ cost: 0, nation: Nation2030.RU, slot: 'taxation' }),
        );

        expect(game.nations.get(Nation2030.RU).powerPoints).toEqual(3);
      });

      test('nation earns one power point', () => {
        const game = newGame();
        // Arbitrarily give RU 3 power points
        game.nations.get(Nation2030.RU).powerPoints = 3;
        // Give RU factories and flags for 6 taxes
        game.provinces.get('a').factory = 'armaments';
        game.provinces.get('b').factory = 'armaments';
        game.provinces.get('c').flag = Nation2030.RU;
        game.provinces.get('d').flag = Nation2030.RU;

        game.tick(
          Action.rondel({ cost: 0, nation: Nation2030.RU, slot: 'taxation' }),
        );

        expect(game.nations.get(Nation2030.RU).powerPoints).toEqual(4);
      });

      test('achieving 25 power points (or more) triggers game end', () => {
        const game = newGame();
        // Arbitrarily give RU 3 power points
        game.nations.get(Nation2030.RU).powerPoints = 24;
        // Give RU stuff to put RU's power points over 25
        game.provinces.get('a').factory = 'armaments';
        game.provinces.get('b').factory = 'armaments';
        game.provinces.get('c').flag = Nation2030.RU;
        game.provinces.get('d').flag = Nation2030.RU;
        game.provinces.get('e').flag = Nation2030.RU;

        game.tick(
          Action.rondel({ cost: 0, nation: Nation2030.RU, slot: 'taxation' }),
        );

        expect(game.nations.get(Nation2030.RU).powerPoints).toEqual(25);
        expect(game.log[game.log.length - 1]).toEqual(Action.endGame());
      });

      test('based on a real-life example!', () => {
        const game = newGame();
        // Arbitrarily give RU 6 power points
        game.nations.get(Nation2030.RU).powerPoints = 6;
        // Give RU stuff to put RU's power points at 8 (+2)
        game.provinces.get('a').factory = 'armaments';
        game.provinces.get('b').factory = 'armaments';
        game.provinces.get('c').flag = Nation2030.RU;
        game.provinces.get('d').flag = Nation2030.RU;
        game.provinces.get('e').factory = 'armaments';

        game.tick(
          Action.rondel({ cost: 0, nation: Nation2030.RU, slot: 'taxation' }),
        );

        expect(game.nations.get(Nation2030.RU).powerPoints).toEqual(8);
      });
    });
  });

  describe('rondel cost', () => {
    const newGame = () => {
      const board = new GameBoard({ nodes: [], edges: [] });

      const game = new Imperial(board);
      initialize(game);
      return game;
    };

    describe('moving beyond 3 slots', () => {
      test('it costs 1 + nation score to move extra slots', () => {
        const gameCoordinator = newGame();
        const { game } = gameCoordinator;
        // Give player2 3 cash so they can afford all rondel positions
        gameCoordinator.players.player2.cash = 3;
        const expected = new Set();
        ['investor', 'import', 'production2'].forEach((slot) => {
          expected.add(Action.rondel({ nation: Nation2030.CN, cost: 0, slot }));
        });
        expected.add(
          Action.rondel({ nation: Nation2030.CN, cost: 1, slot: 'maneuver2' }),
        );
        expected.add(
          Action.rondel({ nation: Nation2030.CN, cost: 2, slot: 'taxation' }),
        );
        expected.add(
          Action.rondel({ nation: Nation2030.CN, cost: 3, slot: 'factory' }),
        );
        expected.add(Action.undo({ player: 'player1' }));
        gameCoordinator.nations.get(Nation2030.CN).rondelPosition = 'maneuver1';
        MoveToRondelSlot.forceMoveNation(game.China, game.rondel.maneuver1Slot);
        gameCoordinator.tick(
          Action.rondel({ slot: 'maneuver1', cost: 0, nation: Nation2030.RU }),
        );

        expect(gameCoordinator.availableActions).toEqual(expected);
      });

      test('it costs 4 + nation score * 4 to move extra slots', () => {
        const gameCoordinator = newGame();
        const { game } = gameCoordinator;
        // Give player2 3 cash so they can afford all rondel positions
        gameCoordinator.players.player2.cash = 30;
        // Give CN 24 power points so that they need to pay an extra 4 per slot
        gameCoordinator.nations.get(Nation2030.CN).powerPoints = 24;
        game.China.powerPoints = 24;

        const expected = new Set();
        ['investor', 'import', 'production2'].forEach((slot) => {
          expected.add(Action.rondel({ nation: Nation2030.CN, cost: 0, slot }));
        });
        expected.add(
          Action.rondel({ nation: Nation2030.CN, cost: 5, slot: 'maneuver2' }),
        );
        expected.add(
          Action.rondel({ nation: Nation2030.CN, cost: 10, slot: 'taxation' }),
        );
        expected.add(
          Action.rondel({ nation: Nation2030.CN, cost: 15, slot: 'factory' }),
        );
        expected.add(Action.undo({ player: 'player1' }));
        gameCoordinator.nations.get(Nation2030.CN).rondelPosition = 'maneuver1';
        MoveToRondelSlot.forceMoveNation(game.China, game.rondel.maneuver1Slot);
        gameCoordinator.tick(
          Action.rondel({ slot: 'maneuver1', cost: 0, nation: Nation2030.RU }),
        );

        expect(gameCoordinator.availableActions).toEqual(expected);
      });
    });
  });

  describe('blocking canals', () => {
    const newGame = () => {
      const board = new GameBoard({
        nodes: [
          { name: 'northpacific', isOcean: true },
          { name: 'colombia' },
          { name: 'caribbeansea', isOcean: true },
          { name: 'mediterraneansea', isOcean: true },
          { name: 'northafrica' },
          { name: 'indianocean', isOcean: true },
          { name: 'northatlantic', isOcean: true },
        ],
        edges: [
          ['northpacific', 'caribbeansea'],
          ['northpacific', 'colombia'],
          ['colombia', 'caribbeansea'],
          ['mediterraneansea', 'indianocean'],
          ['mediterraneansea', 'northafrica'],
          ['northafrica', 'indianocean'],
          ['northatlantic', 'mediterraneansea'],
        ],
      });

      const game = new Imperial(board);
      initialize(game);
      return game;
    };

    test("a nation can block another nation's army from moving from North Pacific to "
    + ' the Caribbean Sea if the nation has a flag in Colombia', () => {
      const game = newGame();
      game.provinces.get('colombia').flag = Nation2030.CN;
      game.units.get(Nation2030.RU).get('northpacific').fleets = 1;

      game.tick(
        Action.rondel({ nation: Nation2030.RU, cost: 0, slot: 'maneuver1' }),
      );
      game.tick(
        Action.maneuver({ origin: 'northpacific', destination: 'caribbeansea' }),
      );

      const expected = new Set();
      expected.add(Action.blockCanal());
      expected.add(Action.unblockCanal());
      expected.add(Action.undo({ player: 'player1' }));

      expect(game.availableActions).toEqual(expected);
    });

    test('fleets can freely move through canals if nobody has a flag in Colombia', () => {
      const game = newGame();
      game.units.get(Nation2030.RU).get('northpacific').fleets = 1;

      game.tick(
        Action.rondel({ nation: Nation2030.RU, cost: 0, slot: 'maneuver1' }),
      );
      game.tick(
        Action.maneuver({ origin: 'northpacific', destination: 'caribbeansea' }),
      );

      const expected = new Set();
      ['factory', 'investor', 'import', 'production2', 'production1', 'maneuver1', 'maneuver2', 'taxation'].forEach((slot) => {
        expected.add(Action.rondel({ nation: Nation2030.CN, cost: 0, slot }));
      });
      expected.add(Action.undo({ player: 'player1' }));

      expect(game.availableActions).toEqual(expected);
    });

    test("a nation can block another nation's army from moving from Mediterranean Sea to "
    + 'the Indian Ocean if the nation has a flag in North Africa', () => {
      const game = newGame();
      game.provinces.get('northafrica').flag = Nation2030.CN;
      game.units.get(Nation2030.RU).get('mediterraneansea').fleets = 1;

      game.tick(
        Action.rondel({ nation: Nation2030.RU, cost: 0, slot: 'maneuver1' }),
      );
      game.tick(
        Action.maneuver({ origin: 'mediterraneansea', destination: 'indianocean' }),
      );

      const expected = new Set();
      expected.add(Action.blockCanal());
      expected.add(Action.unblockCanal());
      expected.add(Action.undo({ player: 'player1' }));

      expect(game.availableActions).toEqual(expected);
    });

    test('if a canal is blocked, maneuver does not succeed', () => {
      const game = newGame();
      game.provinces.get('northafrica').flag = Nation2030.CN;
      game.units.get(Nation2030.RU).get('mediterraneansea').fleets = 1;

      game.tick(
        Action.rondel({ nation: Nation2030.RU, cost: 0, slot: 'maneuver1' }),
      );
      game.tick(
        Action.maneuver({ origin: 'mediterraneansea', destination: 'indianocean' }),
      );

      expect(game.currentPlayerName).toEqual('player2');
      expect(game.currentNation).toEqual(Nation2030.RU);

      game.tick(Action.blockCanal());

      const expected = new Set();
      expected.add(
        Action.endManeuver(),
      );
      expected.add(
        Action.maneuver({
          origin: 'mediterraneansea',
          destination: 'northatlantic',
        }),
      );
      expected.add(Action.undo({ player: 'player2' }));

      expect(game.availableActions).toEqual(expected);
      expect(game.currentPlayerName).toEqual('player1');
    });

    test('if a canal is unblocked, maneuver succeeds', () => {
      const game = newGame();
      game.provinces.get('northafrica').flag = Nation2030.CN;
      game.units.get(Nation2030.RU).get('mediterraneansea').fleets = 1;

      game.tick(
        Action.rondel({ nation: Nation2030.RU, cost: 0, slot: 'maneuver1' }),
      );
      game.tick(
        Action.maneuver({ origin: 'mediterraneansea', destination: 'indianocean' }),
      );

      expect(game.currentPlayerName).toEqual('player2');
      expect(game.currentNation).toEqual(Nation2030.RU);

      game.tick(Action.unblockCanal());

      const expected = new Set();
      ['factory', 'investor', 'import', 'production2', 'production1', 'maneuver1', 'maneuver2', 'taxation'].forEach((slot) => {
        expected.add(Action.rondel({ nation: Nation2030.CN, cost: 0, slot }));
      });
      expected.add(Action.undo({ player: 'player2' }));

      expect(game.availableActions).toEqual(expected);
      expect(game.currentPlayerName).toEqual('player2');
    });
  });

  describe('.loadFromJSON', () => {
    test('returns game with correct state', () => {
      const nations = [
        {
          RU: {
            controller: 'player1',
            flagCount: 0,
            powerPoints: 0,
            rondelPosition: null,
            taxChartPosition: 5,
            treasury: 11,
          },
        }, {
          CN: {
            controller: 'player2',
            flagCount: 0,
            powerPoints: 0,
            rondelPosition: null,
            taxChartPosition: 5,
            treasury: 11,
          },
        }, {
          IN: {
            controller: 'player1',
            flagCount: 0,
            powerPoints: 0,
            rondelPosition: null,
            taxChartPosition: 5,
            treasury: 11,
          },
        }, {
          BR: {
            controller: 'player2',
            flagCount: 0,
            powerPoints: 0,
            rondelPosition: null,
            taxChartPosition: 5,
            treasury: 11,
          },
        }, {
          US: {
            controller: 'player1',
            flagCount: 0,
            powerPoints: 0,
            rondelPosition: null,
            taxChartPosition: 5,
            treasury: 11,
          },
        }, {
          EU: {
            controller: 'player2',
            flagCount: 0,
            powerPoints: 0,
            rondelPosition: null,
            taxChartPosition: 5,
            treasury: 11,
          },
        },
      ];
      const players = {
        player1: {
          bonds: [
            {
              cost: 9,
              nation: 'RU',
              number: 4,
            },
            {
              cost: 2,
              nation: 'US',
              number: 1,
            },
            {
              cost: 9,
              nation: 'IN',
              number: 4,
            },
            {
              cost: 2,
              nation: 'RU',
              number: 1,
            },
            {
              cost: 9,
              nation: 'US',
              number: 4,
            },
            {
              cost: 2,
              nation: 'CN',
              number: 1,
            },
          ],
          cash: 2,
          name: 'player1',
          rawScore: 0,
        },
        player2: {
          bonds: [
            {
              cost: 9,
              nation: 'CN',
              number: 4,
            },
            {
              cost: 2,
              nation: 'BR',
              number: 1,
            },
            {
              cost: 9,
              nation: 'EU',
              number: 4,
            },
            {
              cost: 2,
              nation: 'IN',
              number: 1,
            },
            {
              cost: 9,
              nation: 'BR',
              number: 4,
            },
            {
              cost: 2,
              nation: 'EU',
              number: 1,
            },
          ],
          cash: 2,
          name: 'player2',
          rawScore: 0,
        },
      };
      const provinces = {
        a: { factory: null },
        b: { factory: null },
      };
      const units = {
        RU: {
          a: { armies: 0, fleets: 0, friendly: false },
          b: { armies: 0, fleets: 0, friendly: false },
        },
        CN: {
          a: { armies: 0, fleets: 0, friendly: false },
          b: { armies: 0, fleets: 0, friendly: false },
        },
        IN: {
          a: { armies: 0, fleets: 0, friendly: false },
          b: { armies: 0, fleets: 0, friendly: false },
        },
        BR: {
          a: { armies: 0, fleets: 0, friendly: false },
          b: { armies: 0, fleets: 0, friendly: false },
        },
        US: {
          a: { armies: 0, fleets: 0, friendly: false },
          b: { armies: 0, fleets: 0, friendly: false },
        },
        EU: {
          a: { armies: 0, fleets: 0, friendly: false },
          b: { armies: 0, fleets: 0, friendly: false },
        },
      };
      const stateAsJSON = {
        baseGame: 'imperial2030',
        currentNation: 'RU',
        nations,
        players,
        provinces,
        units,
        variant: 'standard',
        winner: '',
      };

      const expectedNations = new Set();
      [
        [Nation2030.RU, 'player1'],
        [Nation2030.CN, 'player2'],
        [Nation2030.IN, 'player1'],
        [Nation2030.BR, 'player2'],
        [Nation2030.US, 'player1'],
        [Nation2030.EU, 'player2'],
      ].forEach(([nation, controller]) => {
        expectedNations.add(new Map().set(nation, {
          controller,
          flagCount: 0,
          powerPoints: 0,
          rondelPosition: null,
          taxChartPosition: 5,
          treasury: 11,
        }));
      });
      const expectedPlayers = {
        player1: {
          bonds: new Set([
            {
              cost: 9,
              nation: Nation2030.RU,
              number: 4,
            },
            {
              cost: 2,
              nation: Nation2030.US,
              number: 1,
            },
            {
              cost: 9,
              nation: Nation2030.IN,
              number: 4,
            },
            {
              cost: 2,
              nation: Nation2030.RU,
              number: 1,
            },
            {
              cost: 9,
              nation: Nation2030.US,
              number: 4,
            },
            {
              cost: 2,
              nation: Nation2030.CN,
              number: 1,
            },
          ]),
          cash: 2,
          name: 'player1',
          rawScore: 0,
        },
        player2: {
          bonds: new Set([
            {
              cost: 9,
              nation: Nation2030.CN,
              number: 4,
            },
            {
              cost: 2,
              nation: Nation2030.BR,
              number: 1,
            },
            {
              cost: 9,
              nation: Nation2030.EU,
              number: 4,
            },
            {
              cost: 2,
              nation: Nation2030.IN,
              number: 1,
            },
            {
              cost: 9,
              nation: Nation2030.BR,
              number: 4,
            },
            {
              cost: 2,
              nation: Nation2030.EU,
              number: 1,
            },
          ]),
          cash: 2,
          name: 'player2',
          rawScore: 0,
        },
      };
      const expectedProvinces = new Map();
      expectedProvinces.set('a', { factory: null });
      expectedProvinces.set('b', { factory: null });

      const expectedUnitsByProvince = new Map();
      expectedUnitsByProvince.set('a', { armies: 0, fleets: 0, friendly: false });
      expectedUnitsByProvince.set('b', { armies: 0, fleets: 0, friendly: false });

      const expectedUnits = new Map();
      for (const nation in units) {
        expectedUnits.set(Nation2030[nation], expectedUnitsByProvince);
      }

      const game = Imperial.loadFromJSON(stateAsJSON);

      expect(game.baseGame).toEqual('imperial2030');
      expect(game.currentNation).toEqual(Nation2030.RU);
      expect(game.nations).toEqual(expectedNations);
      expect(game.players).toEqual(expectedPlayers);
      expect(game.provinces).toEqual(expectedProvinces);
      expect(game.units).toEqual(expectedUnits);
      expect(game.variant).toEqual('standard');
      expect(game.winner).toEqual('');
    });
  });
});

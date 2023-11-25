import Action from '../action';

import { Bond, Nation } from '../constants';
import GameBoard from '../gameBoard';

import Logger from '../../src/Logger';

import Imperial from '../ImperialGameCoordinator';

import MoveToRondelSlot from '../UseCases/Rondels/MoveToSlot';

const cloneUnits = (units) => {
  const out = new Map();
  units.forEach((provinces, nation) => {
    out.set(nation, new Map());
    provinces.forEach((obj, province) => {
      out.get(nation).set(province, { ...obj });
    });
  });
  return out;
};

const initialize = (game) => {
  game.tick(
    Action.initialize({
      players: [
        { id: 'player1', nation: Nation.AH },
        { id: 'player2', nation: Nation.IT },
      ],
      soloMode: false,
      variant: 'standard',
      baseGame: 'imperial',
    }),
  );
};

describe('imperial', () => {
  describe('#tick', () => {
    describe('bondPurchase', () => {
      const newGame = () => {
        const board = new GameBoard({
          nodes: [
            { name: 'a', nation: Nation.AH },
            { name: 'b', nation: Nation.AH },
          ],
          edges: [],
        });

        const game = new Imperial(board);
        initialize(game);
        return game;
      };

      test('player purchases a bond outright', () => {
        const game = newGame();
        // Empty out player's bonds
        game.players.player1.bonds.clear();
        // Give player enough cash to afford a bond
        game.players.player1.cash = 4;
        game.investorCardHolder = 'player1';
        const expected = new Set(
          [
            'factory',
            'production1',
            'maneuver1',
            'investor',
            'import',
            'production2',
            'maneuver2',
            'taxation',
          ].map((slot) => Action.rondel({ nation: Nation.IT, cost: 0, slot })),
        );
        expected.add(Action.undo({ player: 'player1' }));

        game.tick(
          Action.rondel({ nation: Nation.AH, cost: 0, slot: 'investor' }),
        );
        game.tick(
          Action.bondPurchase({
            player: 'player1',
            cost: 4,
            nation: Nation.IT,
            tradeInValue: 0,
          }),
        );

        expect(game.players.player1.bonds).toEqual(
          new Set([Bond(Nation.IT, 2)]),
        );
        expect(game.availableActions).toEqual(expected);
      });

      test('player purchases a bond by trading one in', () => {
        const game = newGame();
        // Give player one bond to trade in
        game.players.player1.bonds.clear();
        game.players.player1.bonds.add(Bond(Nation.AH, 1));
        game.availableActions = new Set([
          Action.bondPurchase({
            player: 'player1',
            cost: 4,
            nation: Nation.AH,
            tradeInValue: 2,
          }),
        ]);

        game.tick(
          Action.bondPurchase({
            player: 'player1',
            cost: 4,
            nation: Nation.AH,
            tradeInValue: 2,
          }),
        );

        expect(game.players.player1.bonds).toEqual(
          new Set([Bond(Nation.AH, 2)]),
        );
      });

      test('player trades in the highest-value bond', () => {
        const game = newGame();
        game.players.player1.bonds.clear();
        game.players.player1.bonds.add(Bond(Nation.AH, 3));
        game.players.player1.bonds.add(Bond(Nation.AH, 5));

        game.players.player1.cash = 12;
        game.availableActions = new Set([
          Action.bondPurchase({
            player: 'player1',
            cost: 20,
            nation: Nation.AH,
            tradeInValue: 12,
          }),
        ]);

        game.tick(
          Action.bondPurchase({
            player: 'player1',
            cost: 20,
            nation: Nation.AH,
            tradeInValue: 12,
          }),
        );

        expect(game.players.player1.bonds).toEqual(
          new Set([Bond(Nation.AH, 7), Bond(Nation.AH, 3)]),
        );
        expect(game.players.player1.cash).toEqual(4);
      });

      test('purchasing a bond can grant control of the nation', () => {
        const game = newGame();
        game.players.player1.bonds.clear();
        game.players.player1.cash = 4;
        // Nobody controls Italy
        game.nations.get(Nation.IT).controller = null;

        game.tick(
          Action.rondel({ nation: Nation.AH, cost: 0, slot: 'investor' }),
        );
        game.tick(
          Action.bondPurchase({
            player: 'player2',
            cost: 4,
            nation: Nation.IT,
            tradeInValue: 0,
          }),
        );

        expect(game.nations.get(Nation.IT).controller).toEqual('player2');
      });
    });

    describe('skipBondPurchase', () => {
      const newGame = () => {
        const board = new GameBoard({
          nodes: [
            { name: 'a', nation: Nation.AH },
            { name: 'b', nation: Nation.AH },
          ],
          edges: [],
        });

        const game = new Imperial(board);
        initialize(game);
        return game;
      };

      test('player chooses not to purchase a bond', () => {
        const game = newGame();
        game.investorCardHolder = 'player1';
        const expected = new Set(
          [
            'factory',
            'production1',
            'maneuver1',
            'investor',
            'import',
            'production2',
            'maneuver2',
            'taxation',
          ].map((slot) => Action.rondel({ nation: Nation.IT, cost: 0, slot })),
        );
        expected.add(Action.undo({ player: 'player1' }));

        game.tick(
          Action.rondel({ nation: Nation.AH, cost: 0, slot: 'investor' }),
        );
        game.tick(Action.skipBondPurchase({ player: 'player1', nation: null }));

        expect(game.availableActions).toEqual(expected);
      });
    });

    describe('endManeuver', () => {
      const newGame = () => {
        const board = new GameBoard({
          nodes: [{ name: 'a' }],
          edges: [],
        });

        const game = new Imperial(board);
        initialize(game);
        return game;
      };

      test("it is IT's turn to select a rondel slot", () => {
        const gameCoordinator = newGame();
        const { game } = gameCoordinator;

        const expected = new Set();
        ['investor', 'import', 'production2'].forEach((slot) => {
          expected.add(Action.rondel({ nation: Nation.IT, cost: 0, slot }));
        });
        expected.add(
          Action.rondel({ nation: Nation.IT, cost: 2, slot: 'maneuver2' }),
        );
        expected.add(
          Action.rondel({ nation: Nation.IT, cost: 4, slot: 'taxation' }),
        );
        expected.add(
          Action.rondel({ nation: Nation.IT, cost: 6, slot: 'factory' }),
        );
        expected.add(Action.undo({ player: 'player1' }));
        gameCoordinator.units.get(Nation.AH).get('a').armies = 1;
        gameCoordinator.players.player2.cash = 6;

        gameCoordinator.nations.get(Nation.IT).rondelPosition = 'maneuver1';
        MoveToRondelSlot.forceMoveNation(game.Italy, gameCoordinator.game.rondel.maneuver1Slot);
        gameCoordinator.tick(
          Action.rondel({ slot: 'maneuver1', cost: 0, nation: Nation.AH }),
        );
        gameCoordinator.tick(Action.endManeuver());

        expect(gameCoordinator.availableActions).toEqual(expected);
        expect(gameCoordinator.unitsToMove).toEqual([]);
      });
    });

    describe('endGame', () => {
      const newGame = () => {
        const board = new GameBoard({
          nodes: [],
          edges: [],
        });

        const game = new Imperial(board);
        initialize(game);
        return game;
      };

      test('winner is set', () => {
        const gameCoordinator = newGame();
        gameCoordinator.nations.get(Nation.AH).powerPoints = 25;
        gameCoordinator.nations.get(Nation.IT).powerPoints = 15;
        gameCoordinator.game.AustriaHungary.powerPoints = 25;
        gameCoordinator.game.Italy.powerPoints = 15;

        gameCoordinator.players.player1.bonds.clear();
        gameCoordinator.players.player1.bonds.add(Bond(Nation.AH, 5));
        gameCoordinator.players.player1.bonds.add(Bond(Nation.IT, 2));

        gameCoordinator.players.player2.bonds.clear();
        gameCoordinator.players.player2.bonds.add(Bond(Nation.AH, 2));
        gameCoordinator.players.player2.bonds.add(Bond(Nation.IT, 5));
        gameCoordinator.players.player1.cash = 2;
        gameCoordinator.players.player2.cash = 10;

        gameCoordinator.tick(Action.endGame());

        // player1 has AH bond 5 * 5 (powerPoints) + IT bond 2 * 3 (powerPoints) + 2 cash
        // player1 has 33 points
        // player2 has AH bond 2 * 5 (powerPoints) + IT bond 5 * 3 (powerPoints) + 10 cash
        // player2 has 35 points
        expect(gameCoordinator.winner).toEqual('player2');
      });

      test('it can handle a tie', () => {
        const gameCoordinator = newGame();
        gameCoordinator.nations.get(Nation.AH).powerPoints = 25;
        gameCoordinator.nations.get(Nation.IT).powerPoints = 15;
        gameCoordinator.game.AustriaHungary.powerPoints = 25;
        gameCoordinator.game.Italy.powerPoints = 15;

        gameCoordinator.players.player2.bonds.clear();
        gameCoordinator.players.player2.bonds.add(Bond(Nation.AH, 5));
        gameCoordinator.players.player2.bonds.add(Bond(Nation.IT, 2));

        gameCoordinator.players.player1.bonds.clear();
        gameCoordinator.players.player1.bonds.add(Bond(Nation.AH, 2));
        gameCoordinator.players.player1.bonds.add(Bond(Nation.IT, 5));

        gameCoordinator.players.player2.cash = 4;
        gameCoordinator.players.player1.cash = 10;
        gameCoordinator.updateRawScores();

        gameCoordinator.tick(Action.endGame());

        // player2 has AH bond 5 * 5 (powerPoints) + IT bond 2 * 3 (powerPoints) + 4 cash
        // player2 has 35 points
        // player1 has AH bond 2 * 5 (powerPoints) + IT bond 5 * 3 (powerPoints) + 10 cash
        // player1 has 35 points
        // Players points are equal but player1 controls more of the "winning"
        // country, so player2 wins the game
        expect(gameCoordinator.winner).toEqual('player2');
      });
    });

    describe('buildFactory', () => {
      const newGame = () => {
        const board = new GameBoard({
          nodes: [{ name: 'a', nation: Nation.AH, factoryType: 'armaments' }],
          edges: [],
        });

        const game = new Imperial(board);
        initialize(game);
        return game;
      };

      test('AH builds a factory', () => {
        // Arrange
        const game = newGame();

        // Act
        game.tick(
          Action.rondel({ nation: Nation.AH, cost: 0, slot: 'factory' }),
        );
        game.tick(Action.buildFactory({
          province: 'a', player: 'player1', nationCosts: 5, playerCosts: 0,
        }));

        // Assert
        const expected = new Set(
          [
            'factory',
            'production1',
            'maneuver1',
            'investor',
            'import',
            'production2',
            'maneuver2',
            'taxation',
          ].map((slot) => Action.rondel({ nation: Nation.IT, cost: 0, slot })),
        );
        expected.add(Action.undo({ player: 'player1' }));
        expect(game.availableActions).toEqual(expected);
        expect(game.buildingFactory).toEqual(false);
      });
    });

    describe('import', () => {
      const newGame = () => {
        const board = new GameBoard({
          nodes: [
            { name: 'a', nation: Nation.AH, factoryType: 'shipyard' },
            { name: 'b', nation: Nation.AH },
          ],
          edges: [],
        });

        const game = new Imperial(board);
        initialize(game);
        return game;
      };

      test('import nothing adds no new units', () => {
        const game = newGame();
        const beforeUnits = cloneUnits(game.units);
        const expected = new Set(
          [
            'factory',
            'production1',
            'maneuver1',
            'investor',
            'import',
            'production2',
            'maneuver2',
            'taxation',
          ].map((slot) => Action.rondel({ nation: Nation.IT, cost: 0, slot })),
        );
        expected.add(Action.undo({ player: 'player1' }));

        expect(game.nations.get(Nation.AH).treasury).toEqual(11);

        game.advanceOnRondel(
          Action.rondel({ nation: Nation.AH, cost: 0, slot: 'import' }),
        );
        game.tick(Action.import({ placements: [] }));

        expect(game.units).toEqual(beforeUnits);
        expect(game.nations.get(Nation.AH).treasury).toEqual(11);
        expect(game.availableActions).toEqual(expected);
        expect(game.importing).toEqual(false);
      });

      test('import one army', () => {
        const game = newGame();
        const expected = cloneUnits(game.units);
        expected.get(Nation.AH).get('a').armies += 1;
        expect(game.nations.get(Nation.AH).treasury).toEqual(11);

        game.advanceOnRondel(
          Action.rondel({ nation: Nation.AH, cost: 0, slot: 'import' }),
        );
        game.tick(
          Action.import({ placements: [{ province: 'a', type: 'army' }] }),
        );

        expect(game.units).toEqual(expected);
        expect(game.nations.get(Nation.AH).treasury).toEqual(10);
        expect(game.importing).toEqual(false);
      });

      test('import one army and one fleet', () => {
        const game = newGame();
        const expected = cloneUnits(game.units);
        expected.get(Nation.AH).get('a').armies += 1;
        expected.get(Nation.AH).get('a').fleets += 1;

        expect(game.nations.get(Nation.AH).treasury).toEqual(11);

        game.tick(
          Action.rondel({ nation: Nation.AH, cost: 0, slot: 'import' }),
        );
        game.tick(
          Action.import({
            placements: [
              { province: 'a', type: 'army' },
              { province: 'a', type: 'fleet' },
            ],
          }),
        );

        expect(game.units).toEqual(expected);
        expect(game.nations.get(Nation.AH).treasury).toEqual(9);
        expect(game.importing).toEqual(false);
      });

      test('import two armies and one fleet', () => {
        const game = newGame();
        const expected = cloneUnits(game.units);
        expected.get(Nation.AH).get('a').armies += 1;
        expected.get(Nation.AH).get('b').armies += 1;
        expected.get(Nation.AH).get('a').fleets += 1;
        expect(game.nations.get(Nation.AH).treasury).toEqual(11);

        game.advanceOnRondel(
          Action.rondel({ nation: Nation.AH, cost: 0, slot: 'import' }),
        );
        game.tick(
          Action.import({
            placements: [
              { province: 'a', type: 'army' },
              { province: 'b', type: 'army' },
              { province: 'a', type: 'fleet' },
            ],
          }),
        );

        expect(game.units).toEqual(expected);
        expect(game.nations.get(Nation.AH).treasury).toEqual(8);
        expect(game.importing).toEqual(false);
      });
    });

    describe('initialize', () => {
      const newGame = () => {
        const board = new GameBoard({
          nodes: [],
          edges: [],
        });

        const game = new Imperial(board);
        return game;
      };

      test("it is AH's turn to select a rondel slot", () => {
        const game = newGame();

        game.tick(
          Action.initialize({
            players: [
              { id: 'player1', nation: Nation.AH },
              { id: 'player2', nation: Nation.IT },
            ],
            soloMode: false,
            variant: 'standard',
            baseGame: 'imperial',
          }),
        );

        expect(game.availableActions).toEqual(
          new Set(
            [
              'factory',
              'production1',
              'maneuver1',
              'investor',
              'import',
              'production2',
              'maneuver2',
              'taxation',
            ].map((slot) => Action.rondel({ nation: Nation.AH, cost: 0, slot })),
          ),
        );
      });
    });

    describe('rondel', () => {
      describe('slots that cost money', () => {
        const newGame = () => {
          const board = new GameBoard({
            nodes: [
              { name: 'a', nation: Nation.AH },
              { name: 'b', nation: Nation.IT },
              { name: 'c', nation: Nation.FR },
              { name: 'd', nation: Nation.GB },
              { name: 'e', nation: Nation.GE },
              { name: 'f', nation: Nation.RU },
            ],
            edges: [],
          });

          const game = new Imperial(board);
          initialize(game);
          return game;
        };

        test('a free slot does not deduct any money', () => {
          const game = newGame();

          expect(game.nations.get(Nation.AH).treasury).toEqual(11);

          game.tick(
            Action.rondel({ slot: 'factory', cost: 0, nation: Nation.AH }),
          );

          expect(game.nations.get(Nation.AH).treasury).toEqual(11);
        });
        test('a slot can deduct 2 million', () => {
          const game = newGame();

          game.players.player1.cash = 2;

          game.tick(
            Action.rondel({ slot: 'import', cost: 0, nation: Nation.AH }),
          );
          game.tick(Action.import({ placements: [] }));
          game.tick(
            Action.rondel({ slot: 'import', cost: 0, nation: Nation.IT }),
          );
          game.tick(Action.import({ placements: [] }));
          game.tick(
            Action.rondel({ slot: 'import', cost: 0, nation: Nation.FR }),
          );
          game.tick(Action.import({ placements: [] }));
          game.tick(
            Action.rondel({ slot: 'import', cost: 0, nation: Nation.GB }),
          );
          game.tick(Action.import({ placements: [] }));
          game.tick(
            Action.rondel({ slot: 'import', cost: 0, nation: Nation.GE }),
          );
          game.tick(Action.import({ placements: [] }));
          game.tick(
            Action.rondel({ slot: 'import', cost: 0, nation: Nation.RU }),
          );
          game.tick(Action.import({ placements: [] }));
          game.tick(
            Action.rondel({ slot: 'factory', cost: 2, nation: Nation.AH }),
          );

          expect(game.players.player1.cash).toEqual(0);
        });

        test("player cannot move to slot they can't afford", () => {
          const game = newGame();

          game.players.player1.cash = 0;

          game.tick(
            Action.rondel({ slot: 'import', cost: 0, nation: Nation.AH }),
          );
          game.tick(Action.import({ placements: [] }));
          game.tick(
            Action.rondel({ slot: 'import', cost: 0, nation: Nation.IT }),
          );
          game.tick(Action.import({ placements: [] }));
          game.tick(
            Action.rondel({ slot: 'import', cost: 0, nation: Nation.FR }),
          );
          game.tick(Action.import({ placements: [] }));
          game.tick(
            Action.rondel({ slot: 'import', cost: 0, nation: Nation.GB }),
          );
          game.tick(Action.import({ placements: [] }));
          game.tick(
            Action.rondel({ slot: 'import', cost: 0, nation: Nation.GE }),
          );
          game.tick(Action.import({ placements: [] }));
          game.tick(
            Action.rondel({ slot: 'import', cost: 0, nation: Nation.RU }),
          );
          game.tick(Action.import({ placements: [] }));

          expect(game.availableActions).toEqual(
            new Set([
              Action.rondel({
                slot: 'production2',
                cost: 0,
                nation: Nation.AH,
              }),
              Action.rondel({ slot: 'maneuver2', cost: 0, nation: Nation.AH }),
              Action.rondel({ slot: 'taxation', cost: 0, nation: Nation.AH }),
              Action.undo({ player: 'player2' }),
            ]),
          );
        });

        test('nation can move to Factory even if they cannot afford to buy a factory', () => {
          const game = newGame();
          game.nations.get(Nation.AH).treasury = 0;

          game.tick(
            Action.rondel({ slot: 'maneuver2', cost: 0, nation: Nation.AH }),
          );
          game.tick(
            Action.rondel({ slot: 'taxation', cost: 0, nation: Nation.IT }),
          );
          game.tick(
            Action.rondel({ slot: 'taxation', cost: 0, nation: Nation.FR }),
          );
          game.tick(
            Action.rondel({ slot: 'taxation', cost: 0, nation: Nation.GB }),
          );
          game.tick(
            Action.rondel({ slot: 'taxation', cost: 0, nation: Nation.GE }),
          );
          game.tick(
            Action.rondel({ slot: 'taxation', cost: 0, nation: Nation.RU }),
          );

          expect(game.availableActions).toEqual(
            new Set([
              Action.rondel({ slot: 'taxation', cost: 0, nation: Nation.AH }),
              Action.rondel({ slot: 'production1', cost: 0, nation: Nation.AH }),
              Action.rondel({ slot: 'factory', cost: 0, nation: Nation.AH }),
              Action.rondel({ slot: 'maneuver1', cost: 2, nation: Nation.AH }),
              Action.undo({ player: 'player2' }),
            ]),
          );
        });
      });

      describe('import', () => {
        test('nation can import armies in their province', () => {
          const board = new GameBoard({
            nodes: [
              { name: 'a', nation: Nation.AH },
              { name: 'b', nation: null },
              { name: 'c', nation: Nation.IT },
            ],
            edges: [],
          });

          const game = new Imperial(board);
          initialize(game);

          const availableActions = new Set([Action.import({ placements: [] })]);
          availableActions.add(
            Action.import({ placements: [{ province: 'a', type: 'army' }] }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(Action.undo({ player: 'player1' }));

          game.tick(
            Action.rondel({ slot: 'import', cost: 0, nation: Nation.AH }),
          );

          expect(game.availableActions).toEqual(availableActions);
          expect(game.nations.get(Nation.AH).rondelPosition).toEqual('import');
          expect(game.importing).toEqual(true);
        });

        test('importing when armies are at the limit', () => {
          const board = new GameBoard({
            nodes: [
              { name: 'a', nation: Nation.AH },
              { name: 'b', nation: null },
              { name: 'c', nation: Nation.IT },
            ],
            edges: [],
          });

          const game = new Imperial(board);
          initialize(game);
          game.units.get(Nation.AH).get('a').armies = game.unitLimits.get(
            Nation.AH,
          ).armies;
          const availableActions = new Set([Action.import({ placements: [] }), Action.undo({ player: 'player1' })]);

          game.tick(
            Action.rondel({ slot: 'import', cost: 0, nation: Nation.AH }),
          );

          expect(game.availableActions).toEqual(availableActions);
          expect(game.nations.get(Nation.AH).rondelPosition).toEqual('import');
          expect(game.importing).toEqual(true);
        });

        test('importing when armies are 1 below the limit', () => {
          const board = new GameBoard({
            nodes: [
              { name: 'a', nation: Nation.AH },
              { name: 'b', nation: null },
              { name: 'c', nation: Nation.IT },
            ],
            edges: [],
          });

          const game = new Imperial(board);
          initialize(game);
          game.units.get(Nation.AH).get('a').armies = game.unitLimits.get(Nation.AH).armies - 1;
          const availableActions = new Set([Action.import({ placements: [] }), Action.undo({ player: 'player1' })]);

          availableActions.add(
            Action.import({ placements: [{ province: 'a', type: 'army' }] }),
          );

          game.tick(
            Action.rondel({ slot: 'import', cost: 0, nation: Nation.AH }),
          );

          expect(game.availableActions).toEqual(availableActions);
          expect(game.nations.get(Nation.AH).rondelPosition).toEqual('import');
          expect(game.importing).toEqual(true);
        });

        test('importing when armies are 2 below the limit', () => {
          const board = new GameBoard({
            nodes: [
              { name: 'a', nation: Nation.AH },
              { name: 'b', nation: null },
              { name: 'c', nation: Nation.IT },
            ],
            edges: [],
          });

          const game = new Imperial(board);
          initialize(game);
          game.units.get(Nation.AH).get('a').armies = game.unitLimits.get(Nation.AH).armies - 2;
          const availableActions = new Set([Action.import({ placements: [] })]);

          availableActions.add(
            Action.import({ placements: [{ province: 'a', type: 'army' }] }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(Action.undo({ player: 'player1' }));

          game.tick(
            Action.rondel({ slot: 'import', cost: 0, nation: Nation.AH }),
          );

          expect(game.availableActions).toEqual(availableActions);
          expect(game.nations.get(Nation.AH).rondelPosition).toEqual('import');
          expect(game.importing).toEqual(true);
        });

        test('importing when armies are 3 below the limit', () => {
          const board = new GameBoard({
            nodes: [
              { name: 'a', nation: Nation.AH },
              { name: 'b', nation: null },
              { name: 'c', nation: Nation.IT },
            ],
            edges: [],
          });

          const game = new Imperial(board);
          initialize(game);
          game.units.get(Nation.AH).get('a').armies = game.unitLimits.get(Nation.AH).armies - 3;
          const availableActions = new Set([Action.import({ placements: [] })]);

          availableActions.add(
            Action.import({ placements: [{ province: 'a', type: 'army' }] }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(Action.undo({ player: 'player1' }));

          game.tick(
            Action.rondel({ slot: 'import', cost: 0, nation: Nation.AH }),
          );

          expect(game.availableActions).toEqual(availableActions);
          expect(game.nations.get(Nation.AH).rondelPosition).toEqual('import');
          expect(game.importing).toEqual(true);
        });

        test('nation can import fleets in their coastal province', () => {
          const board = new GameBoard({
            nodes: [
              { name: 'a', nation: Nation.AH, factoryType: 'shipyard' },
              { name: 'b', nation: null },
              { name: 'c', nation: Nation.IT },
            ],
            edges: [],
          });

          const game = new Imperial(board);
          initialize(game);

          const availableActions = new Set([Action.import({ placements: [] })]);
          availableActions.add(
            Action.import({ placements: [{ province: 'a', type: 'army' }] }),
          );
          availableActions.add(
            Action.import({ placements: [{ province: 'a', type: 'fleet' }] }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'fleet' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'fleet' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
                { province: 'a', type: 'fleet' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'fleet' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'fleet' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'army' },
                { province: 'a', type: 'fleet' },
              ],
            }),
          );
          availableActions.add(Action.undo({ player: 'player1' }));

          game.tick(
            Action.rondel({ slot: 'import', cost: 0, nation: Nation.AH }),
          );

          expect(game.availableActions).toEqual(availableActions);
          expect(game.nations.get(Nation.AH).rondelPosition).toEqual('import');
          expect(game.importing).toEqual(true);
        });

        test('importing when fleets are at the limit', () => {
          const board = new GameBoard({
            nodes: [
              { name: 'a', nation: Nation.AH, factoryType: 'shipyard' },
              { name: 'b', nation: null },
              { name: 'c', nation: Nation.IT },
            ],
            edges: [],
          });

          const game = new Imperial(board);
          initialize(game);
          game.units.get(Nation.AH).get('a').fleets = game.unitLimits.get(
            Nation.AH,
          ).fleets;
          const availableActions = new Set([Action.import({ placements: [] })]);

          availableActions.add(
            Action.import({ placements: [{ province: 'a', type: 'army' }] }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(Action.undo({ player: 'player1' }));

          game.tick(
            Action.rondel({ slot: 'import', cost: 0, nation: Nation.AH }),
          );

          expect(game.availableActions).toEqual(availableActions);
          expect(game.nations.get(Nation.AH).rondelPosition).toEqual('import');
          expect(game.importing).toEqual(true);
        });

        test('importing when fleets are 1 below the limit', () => {
          const board = new GameBoard({
            nodes: [
              { name: 'a', nation: Nation.AH, factoryType: 'shipyard' },
              { name: 'b', nation: null },
              { name: 'c', nation: Nation.IT },
            ],
            edges: [],
          });

          const game = new Imperial(board);
          initialize(game);
          game.units.get(Nation.AH).get('a').fleets = game.unitLimits.get(Nation.AH).fleets - 1;
          const availableActions = new Set([Action.import({ placements: [] })]);

          availableActions.add(
            Action.import({ placements: [{ province: 'a', type: 'army' }] }),
          );
          availableActions.add(
            Action.import({ placements: [{ province: 'a', type: 'fleet' }] }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'fleet' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
                { province: 'a', type: 'fleet' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(Action.undo({ player: 'player1' }));

          game.tick(
            Action.rondel({ slot: 'import', cost: 0, nation: Nation.AH }),
          );

          expect(game.availableActions).toEqual(availableActions);
          expect(game.nations.get(Nation.AH).rondelPosition).toEqual('import');
          expect(game.importing).toEqual(true);
        });

        test('importing when fleets are 2 below the limit', () => {
          const board = new GameBoard({
            nodes: [
              { name: 'a', nation: Nation.AH, factoryType: 'shipyard' },
              { name: 'b', nation: null },
              { name: 'c', nation: Nation.IT },
            ],
            edges: [],
          });

          const game = new Imperial(board);
          initialize(game);
          game.units.get(Nation.AH).get('a').fleets = game.unitLimits.get(Nation.AH).fleets - 2;
          const availableActions = new Set([Action.import({ placements: [] })]);

          availableActions.add(
            Action.import({ placements: [{ province: 'a', type: 'army' }] }),
          );
          availableActions.add(
            Action.import({ placements: [{ province: 'a', type: 'fleet' }] }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'fleet' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'fleet' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
                { province: 'a', type: 'fleet' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'fleet' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'army' },
                { province: 'a', type: 'fleet' },
              ],
            }),
          );
          availableActions.add(Action.undo({ player: 'player1' }));
          game.tick(
            Action.rondel({ slot: 'import', cost: 0, nation: Nation.AH }),
          );

          expect(game.availableActions).toEqual(availableActions);
          expect(game.nations.get(Nation.AH).rondelPosition).toEqual('import');
          expect(game.importing).toEqual(true);
        });

        test('importing when fleets are 3 below the limit', () => {
          const board = new GameBoard({
            nodes: [
              { name: 'a', nation: Nation.AH, factoryType: 'shipyard' },
              { name: 'b', nation: null },
              { name: 'c', nation: Nation.IT },
            ],
            edges: [],
          });

          const game = new Imperial(board);
          initialize(game);
          game.units.get(Nation.AH).get('a').fleets = game.unitLimits.get(Nation.AH).fleets - 3;
          const availableActions = new Set([Action.import({ placements: [] })]);

          availableActions.add(
            Action.import({ placements: [{ province: 'a', type: 'army' }] }),
          );
          availableActions.add(
            Action.import({ placements: [{ province: 'a', type: 'fleet' }] }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'fleet' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'fleet' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
                { province: 'a', type: 'fleet' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'fleet' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'fleet' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'army' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'army' },
                { province: 'a', type: 'fleet' },
              ],
            }),
          );
          availableActions.add(Action.undo({ player: 'player1' }));

          game.tick(
            Action.rondel({ slot: 'import', cost: 0, nation: Nation.AH }),
          );

          expect(game.availableActions).toEqual(availableActions);
          expect(game.nations.get(Nation.AH).rondelPosition).toEqual('import');
          expect(game.importing).toEqual(true);
        });

        test('importing when armies and fleets are both at the limit', () => {
          const board = new GameBoard({
            nodes: [
              { name: 'a', nation: Nation.AH, factoryType: 'shipyard' },
              { name: 'b', nation: null },
              { name: 'c', nation: Nation.IT },
            ],
            edges: [],
          });

          const game = new Imperial(board);
          initialize(game);
          game.units.get(Nation.AH).get('a').armies = game.unitLimits.get(
            Nation.AH,
          ).armies;
          game.units.get(Nation.AH).get('a').fleets = game.unitLimits.get(
            Nation.AH,
          ).fleets;
          const availableActions = new Set([Action.import({ placements: [] }), Action.undo({ player: 'player1' })]);

          game.tick(
            Action.rondel({ slot: 'import', cost: 0, nation: Nation.AH }),
          );

          expect(game.availableActions).toEqual(availableActions);
          expect(game.nations.get(Nation.AH).rondelPosition).toEqual('import');
          expect(game.importing).toEqual(true);
        });

        test('importing when armies and fleets are both 1 under the limit', () => {
          const board = new GameBoard({
            nodes: [
              { name: 'a', nation: Nation.AH, factoryType: 'shipyard' },
              { name: 'b', nation: null },
              { name: 'c', nation: Nation.IT },
            ],
            edges: [],
          });

          const game = new Imperial(board);
          initialize(game);
          game.units.get(Nation.AH).get('a').armies = game.unitLimits.get(Nation.AH).armies - 1;
          game.units.get(Nation.AH).get('a').fleets = game.unitLimits.get(Nation.AH).fleets - 1;
          const availableActions = new Set([Action.import({ placements: [] })]);

          availableActions.add(
            Action.import({ placements: [{ province: 'a', type: 'army' }] }),
          );
          availableActions.add(
            Action.import({ placements: [{ province: 'a', type: 'fleet' }] }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'army' },
                { province: 'a', type: 'fleet' },
              ],
            }),
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: 'a', type: 'fleet' },
                { province: 'a', type: 'army' },
              ],
            }),
          );
          availableActions.add(Action.undo({ player: 'player1' }));
          game.tick(
            Action.rondel({ slot: 'import', cost: 0, nation: Nation.AH }),
          );

          expect(game.availableActions).toEqual(availableActions);
          expect(game.nations.get(Nation.AH).rondelPosition).toEqual('import');
          expect(game.importing).toEqual(true);
        });

        test('nation can only afford one army', () => {
          const board = new GameBoard({
            nodes: [{ name: 'a', nation: Nation.AH, factoryType: 'shipyard' }],
            edges: [],
          });

          const game = new Imperial(board);
          initialize(game);
          game.nations.get(Nation.AH).treasury = 1;

          const availableActions = new Set([Action.import({ placements: [] })]);
          availableActions.add(
            Action.import({ placements: [{ province: 'a', type: 'army' }] }),
          );
          availableActions.add(
            Action.import({ placements: [{ province: 'a', type: 'fleet' }] }),
          );
          availableActions.add(
            Action.undo({ player: 'player1' }),
          );

          game.tick(
            Action.rondel({ slot: 'import', cost: 0, nation: Nation.AH }),
          );

          expect(game.availableActions).toEqual(availableActions);
          expect(game.nations.get(Nation.AH).rondelPosition).toEqual('import');
          expect(game.importing).toEqual(true);
        });

        test('nation cannot import into an occupied province', () => {
          const board = new GameBoard({
            nodes: [{ name: 'a', nation: Nation.AH }],
            edges: [],
          });

          const game = new Imperial(board);
          initialize(game);
          game.units.get(Nation.IT).get('a').armies += 1;
          game.nations.get(Nation.AH).treasury = 1;

          const availableActions = new Set([Action.import({ placements: [] }), Action.undo({ player: 'player1' })]);

          game.tick(
            Action.rondel({ slot: 'import', cost: 0, nation: Nation.AH }),
          );

          expect(game.availableActions).toEqual(availableActions);
          expect(game.nations.get(Nation.AH).rondelPosition).toEqual('import');
          expect(game.importing).toEqual(true);
        });
      });

      describe('maneuver1 or manuever2', () => {
        const newGame = () => {
          const board = new GameBoard({
            nodes: [
              { name: 'a', nation: null, isOcean: true },
              { name: 'b', nation: null, isOcean: true },
              { name: 'c', nation: null },
              { name: 'd', nation: null },
              { name: 'e', nation: Nation.AH },
              { name: 'f', nation: Nation.AH },
              { name: 'g', nation: Nation.AH },
            ],
            edges: [
              ['a', 'b'],
              ['c', 'd'],
              ['b', 'c'],
              ['e', 'f'],
              ['f', 'g'],
            ],
          });

          const game = new Imperial(board);
          initialize(game);
          return game;
        };

        ['maneuver1', 'maneuver2'].forEach((maneuver) => {
          test('nation has no units', () => {
            const game = newGame();

            game.tick(
              Action.rondel({ slot: maneuver, nation: Nation.AH, cost: 0 }),
            );

            const expected = new Set();
            [
              'factory',
              'production1',
              'maneuver1',
              'investor',
              'import',
              'production2',
              'maneuver2',
              'taxation',
            ].forEach((slot) => {
              expected.add(Action.rondel({ nation: Nation.IT, cost: 0, slot }));
            });
            expected.add(Action.undo({ player: 'player1' }));

            expect(game.availableActions).toEqual(expected);
          });

          test('nation has one fleet that can go to one destination', () => {
            const game = newGame();
            game.units.get(Nation.AH).get('a').fleets += 1;

            game.tick(
              Action.rondel({ slot: maneuver, nation: Nation.AH, cost: 0 }),
            );

            expect(game.availableActions).toEqual(
              new Set([
                Action.endManeuver(),
                Action.maneuver({
                  origin: 'a',
                  destination: 'b',
                }),
                Action.undo({ player: 'player1' }),
              ]),
            );
          });

          test('nation can skip fleets and move armies', () => {
            const game = newGame();
            game.units.get(Nation.AH).get('a').fleets += 1;
            game.units.get(Nation.AH).get('c').armies += 1;

            game.tick(
              Action.rondel({ slot: maneuver, nation: Nation.AH, cost: 0 }),
            );

            expect(game.availableActions).toEqual(
              new Set([
                Action.endManeuver(),
                Action.maneuver({
                  origin: 'a',
                  destination: 'b',
                }),
                Action.maneuver({
                  origin: 'c',
                  destination: 'd',
                }),
                Action.undo({ player: 'player1' }),
              ]),
            );
          });

          test('nation cannot use railroad through occupied province', () => {
            const game = newGame();
            game.units.get(Nation.AH).get('e').armies += 1;
            game.units.get(Nation.IT).get('f').armies += 1;

            game.tick(
              Action.rondel({ slot: maneuver, nation: Nation.AH, cost: 0 }),
            );

            expect(game.availableActions).toEqual(
              new Set([
                Action.endManeuver(),
                Action.maneuver({
                  origin: 'e',
                  destination: 'f',
                }),
                Action.undo({ player: 'player1' }),
              ]),
            );
          });
        });
      });

      describe('production1 or production2', () => {
        const newGame = () => {
          const board = new GameBoard({
            nodes: [{ name: 'a', nation: Nation.AH }],
            edges: [],
          });

          const game = new Imperial(board);
          initialize(game);
          return game;
        };

        ['production1', 'production2'].forEach((production) => {
          describe('units are produced', () => {
            test('a unit is produced in a province that has a factory', () => {
              const game = newGame();
              game.provinces.get('a').factory = 'armaments';

              game.tick(
                Action.rondel({ slot: production, cost: 0, nation: Nation.AH }),
              );

              expect(game.units.get(Nation.AH).get('a').armies).toEqual(1);
            });

            test('a unit is not produced in a province that does not have a factory', () => {
              const game = newGame();

              game.tick(
                Action.rondel({ slot: production, cost: 0, nation: Nation.AH }),
              );

              expect(game.units.get(Nation.AH).get('a').armies).toEqual(0);
            });

            test('a unit is not produced in a province that has an occupied factory', () => {
              const game = newGame();
              game.provinces.get('a').factory = 'armaments';
              game.units.get(Nation.IT).get('a').armies = 1;

              game.tick(
                Action.rondel({ slot: production, cost: 0, nation: Nation.AH }),
              );

              expect(game.units.get(Nation.AH).get('a').armies).toEqual(0);
            });

            test('no more armies are produced when that unit limit is reached', () => {
              const game = newGame();
              game.provinces.get('a').factory = 'armaments';
              game.units.get(Nation.AH).get('a').armies = game.unitLimits.get(
                Nation.AH,
              ).armies;

              game.tick(
                Action.rondel({ slot: production, cost: 0, nation: Nation.AH }),
              );

              expect(game.units.get(Nation.AH).get('a').fleets).toEqual(0);
              expect(game.units.get(Nation.AH).get('a').armies).toEqual(
                game.unitLimits.get(Nation.AH).armies,
              );
            });

            test('no more fleets are produced when that unit limit is reached', () => {
              const game = newGame();
              game.provinces.get('a').factory = 'shipyard';
              game.units.get(Nation.AH).get('a').fleets = game.unitLimits.get(
                Nation.AH,
              ).fleets;

              game.tick(
                Action.rondel({ slot: production, cost: 0, nation: Nation.AH }),
              );
              expect(game.units.get(Nation.AH).get('a').armies).toEqual(0);
              expect(game.units.get(Nation.AH).get('a').fleets).toEqual(
                game.unitLimits.get(Nation.AH).fleets,
              );
            });
          });

          test("it is IT's turn to select a rondel slot", () => {
            const gameCoordinator = newGame();
            const { game } = gameCoordinator;

            const expected = new Set();
            ['factory', 'production1', 'maneuver1'].forEach((slot) => {
              expected.add(Action.rondel({ nation: Nation.IT, cost: 0, slot }));
            });
            expected.add(
              Action.rondel({ nation: Nation.IT, cost: 2, slot: 'investor' }),
            );
            expected.add(
              Action.rondel({ nation: Nation.IT, cost: 4, slot: 'import' }),
            );
            expected.add(
              Action.rondel({ nation: Nation.IT, cost: 6, slot: 'production2' }),
            );
            expected.add(
              Action.undo({ player: 'player1' }),
            );
            gameCoordinator.nations.get(Nation.IT).rondelPosition = 'taxation';
            MoveToRondelSlot.forceMoveNation(game.Italy, gameCoordinator.game.rondel.taxationSlot);
            gameCoordinator.players.player2.cash = 6;

            gameCoordinator.tick(
              Action.rondel({ slot: production, cost: 0, nation: Nation.AH }),
            );

            expect(gameCoordinator.availableActions).toEqual(expected);
          });
        });
      });

      describe('investor', () => {
        const newGame = () => {
          const board = new GameBoard({
            nodes: [],
            edges: [],
          });

          const game = new Imperial(board);
          initialize(game);
          return game;
        };

        describe('1. Nation pays bond-holders interest', () => {
          test('nation pays interest to both players', () => {
            const game = newGame();
            game.players.player2.bonds.clear();
            game.players.player2.bonds.add(Bond(Nation.AH, 2));

            expect(game.players.player1.cash).toEqual(2);
            expect(game.players.player2.cash).toEqual(2);
            expect(game.nations.get(Nation.AH).treasury).toEqual(11);

            game.tick(
              Action.rondel({ slot: 'investor', nation: Nation.AH, cost: 0 }),
            );

            expect(game.players.player1.cash).toEqual(7);
            // NB: player2 has an "extra" 2m because they hold the investor card
            expect(game.players.player2.cash).toEqual(6);
            expect(game.nations.get(Nation.AH).treasury).toEqual(4);
          });

          test('nation pays non-controlling players first when nation does not have enough money', () => {
            const game = newGame();
            game.players.player2.bonds.clear();
            game.players.player2.bonds.add(Bond(Nation.AH, 2));
            game.nations.get(Nation.AH).treasury = 2;

            expect(game.players.player1.cash).toEqual(2);
            expect(game.players.player2.cash).toEqual(2);
            expect(game.nations.get(Nation.AH).treasury).toEqual(2);

            game.tick(
              Action.rondel({ slot: 'investor', nation: Nation.AH, cost: 0 }),
            );

            expect(game.players.player1.cash).toEqual(2);
            // NB: player2 has an "extra" 2m because they hold the investor card
            expect(game.players.player2.cash).toEqual(6);
            expect(game.nations.get(Nation.AH).treasury).toEqual(0);
          });

          test("controlling player must make up shortfall from nation when nation can't pay other investors", () => {
            const game = newGame();
            game.players.player2.bonds.clear();
            game.players.player2.bonds.add(Bond(Nation.AH, 2));
            game.nations.get(Nation.AH).treasury = 0;

            expect(game.players.player1.cash).toEqual(2);
            expect(game.players.player2.cash).toEqual(2);
            expect(game.nations.get(Nation.AH).treasury).toEqual(0);

            game.tick(
              Action.rondel({ slot: 'investor', nation: Nation.AH, cost: 0 }),
            );

            expect(game.players.player1.cash).toEqual(0);
            // NB: player2 has an "extra" 2m because they hold the investor card
            expect(game.players.player2.cash).toEqual(6);
            expect(game.nations.get(Nation.AH).treasury).toEqual(0);
          });

          test('controlling player cannot go into negative cash if they cannot afford to pay other investors', () => {
            const game = newGame();
            game.players.player2.bonds.clear();
            game.players.player2.bonds.add(Bond(Nation.AH, 2));
            game.nations.get(Nation.AH).treasury = 0;

            game.players.player1.cash = 1;
            expect(game.players.player2.cash).toEqual(2);
            expect(game.nations.get(Nation.AH).treasury).toEqual(0);

            game.tick(
              Action.rondel({ slot: 'investor', nation: Nation.AH, cost: 0 }),
            );

            expect(game.players.player1.cash).toEqual(0);
            // player2 has an "extra" 2m because they hold the investor card
            expect(game.players.player2.cash).toEqual(5);
            expect(game.nations.get(Nation.AH).treasury).toEqual(0);
          });
        });

        describe('2. Investor is activated', () => {
          test('investor card holder gets 2m', () => {
            const game = newGame();
            // Make player1 the investor card holder
            game.investorCardHolder = 'player1';
            // Empty out their bonds so that they don't impact player1's cash
            game.players.player1.bonds.clear();

            expect(game.players.player1.cash).toEqual(2);

            game.tick(
              Action.rondel({ slot: 'investor', nation: Nation.AH, cost: 0 }),
            );

            expect(game.players.player1.cash).toEqual(4);
          });

          test('available bonds for sale outright', () => {
            const game = newGame();
            // Empty out their bonds so they can't trade any in (that's tested below)
            game.players.player2.bonds.clear();

            expect(game.players.player2.cash).toEqual(2);

            game.tick(
              Action.rondel({ slot: 'investor', nation: Nation.AH, cost: 0 }),
            );

            expect(game.availableActions).toEqual(
              new Set([
                Action.skipBondPurchase({ player: 'player2', nation: null }),
                Action.bondPurchase({
                  nation: Nation.AH,
                  player: 'player2',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.IT,
                  player: 'player2',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.FR,
                  player: 'player2',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.GB,
                  player: 'player2',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.GE,
                  player: 'player2',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.RU,
                  player: 'player2',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.undo({ player: 'player1' }),
              ]),
            );
          });

          test('available bonds that can be traded up for', () => {
            const gameCoordinator = newGame();
            gameCoordinator.investorCardHolder = 'player2';

            // Give the AH, 1 and the AH, 3 bonds to player2
            gameCoordinator.availableBonds.delete(Bond(Nation.AH, 1));
            gameCoordinator.availableBonds.delete(Bond(Nation.AH, 3));
            gameCoordinator.availableBonds.add(Bond(Nation.AH, 4));

            gameCoordinator.players.player2.bonds.clear();
            gameCoordinator.players.player2.bonds.add(Bond(Nation.AH, 1));
            gameCoordinator.players.player2.bonds.add(Bond(Nation.AH, 3));
            gameCoordinator.players.player2.cash = 0;

            gameCoordinator.tick(
              Action.rondel({ slot: 'investor', nation: Nation.AH, cost: 0 }),
            );

            // player2 can use their own 6m plus the trade-in value of 2m or 6m
            // from their AH, 1 and AH, 3 bonds
            expect(gameCoordinator.availableActions).toEqual(
              new Set([
                Action.bondPurchase({
                  nation: Nation.AH,
                  player: 'player2',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.AH,
                  player: 'player2',
                  tradeInValue: 2,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.AH,
                  player: 'player2',
                  tradeInValue: 6,
                  cost: 12,
                }),
                Action.bondPurchase({
                  nation: Nation.AH,
                  player: 'player2',
                  tradeInValue: 6,
                  cost: 9,
                }),
                Action.bondPurchase({
                  nation: Nation.IT,
                  player: 'player2',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.IT,
                  player: 'player2',
                  tradeInValue: 0,
                  cost: 6,
                }),
                Action.bondPurchase({
                  nation: Nation.FR,
                  player: 'player2',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.FR,
                  player: 'player2',
                  tradeInValue: 0,
                  cost: 6,
                }),
                Action.bondPurchase({
                  nation: Nation.GB,
                  player: 'player2',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.GB,
                  player: 'player2',
                  tradeInValue: 0,
                  cost: 6,
                }),
                Action.bondPurchase({
                  nation: Nation.GE,
                  player: 'player2',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.GE,
                  player: 'player2',
                  tradeInValue: 0,
                  cost: 6,
                }),
                Action.bondPurchase({
                  nation: Nation.RU,
                  player: 'player2',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.RU,
                  player: 'player2',
                  tradeInValue: 0,
                  cost: 6,
                }),
                Action.skipBondPurchase({ player: 'player2', nation: null }),
                Action.undo({ player: 'player1' }),
              ]),
            );
          });
        });
      });

      describe('investor slot is skipped', () => {
        const newGame = () => {
          const board = new GameBoard({
            nodes: [{ name: 'a', nation: Nation.AH }],
            edges: [],
          });

          const game = new Imperial(board);
          game.tick(
            Action.initialize({
              players: [
                { id: 'player1', nation: Nation.AH },
                { id: 'player2', nation: Nation.IT },
                { id: 'player3', nation: Nation.FR },
              ],
              soloMode: false,
              variant: 'standard',
              baseGame: 'imperial',
            }),
          );
          return game;
        };

        describe('2. Investor is activated', () => {
          test('investor card holder gets 2m', () => {
            const gameCoordinator = newGame();
            const { game } = gameCoordinator;

            // Make player2 the investor card holder
            gameCoordinator.investorCardHolder = 'player2';
            // Empty out their bonds so that they don't impact player2's cash
            gameCoordinator.players.player2.bonds.clear();

            // Set AH's rondel position to be something *before* investor
            gameCoordinator.nations.get(Nation.AH).rondelPosition = 'maneuver1';
            MoveToRondelSlot.forceMoveNation(game.AustriaHungary, game.rondel.maneuver1Slot);

            expect(gameCoordinator.players.player2.cash).toEqual(2);

            // The investor slot lies between 'maneuver1' and 'maneuver2'
            gameCoordinator.tick(
              Action.rondel({
                slot: 'production2',
                nation: Nation.AH,
                cost: 0,
              }),
            );

            expect(gameCoordinator.players.player2.cash).toEqual(4);
            expect(gameCoordinator.currentPlayerName).toEqual('player2');
          });

          test('available bonds for sale outright', () => {
            const gameCoordinator = newGame();
            const { game } = gameCoordinator;

            // Make player1 the investor card holder
            gameCoordinator.investorCardHolder = 'player1';
            gameCoordinator.nations.get(Nation.AH).rondelPosition = 'maneuver1';
            MoveToRondelSlot.forceMoveNation(game.AustriaHungary, game.rondel.maneuver1Slot);
            // Clear out player1's bonds so they can't trade any in
            gameCoordinator.players.player1.bonds.clear();

            expect(gameCoordinator.players.player1.cash).toEqual(2);

            gameCoordinator.tick(
              Action.rondel({
                slot: 'production2',
                nation: Nation.AH,
                cost: 0,
              }),
            );

            expect(gameCoordinator.availableActions).toEqual(
              new Set([
                Action.skipBondPurchase({
                  player: 'player1',
                  nation: null,
                }),
                Action.bondPurchase({
                  nation: Nation.AH,
                  player: 'player1',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.IT,
                  player: 'player1',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.FR,
                  player: 'player1',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.GB,
                  player: 'player1',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.GE,
                  player: 'player1',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.RU,
                  player: 'player1',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.undo({ player: 'player1' }),
              ]),
            );
          });

          test('available bonds that can be traded up for', () => {
            const gameCoordinator = newGame();
            const { game } = gameCoordinator;

            gameCoordinator.investorCardHolder = 'player2';
            gameCoordinator.nations.get(Nation.AH).rondelPosition = 'maneuver1';
            MoveToRondelSlot.forceMoveNation(game.AustriaHungary, game.rondel.maneuver1Slot);

            // Give the AH, 2 bond to player2
            gameCoordinator.availableBonds.delete(Bond(Nation.AH, 2));
            gameCoordinator.players.player2.bonds.clear();
            gameCoordinator.players.player2.bonds.add(Bond(Nation.AH, 2));

            expect(gameCoordinator.players.player2.cash).toEqual(2);

            gameCoordinator.tick(
              Action.rondel({
                slot: 'production2',
                nation: Nation.AH,
                cost: 0,
              }),
            );

            // player2 can use their own 2m plus the trade-in value of 4m
            // from their AH, 2 bond to buy the AH, 3 bond
            expect(gameCoordinator.availableActions).toEqual(
              new Set([
                Action.skipBondPurchase({
                  player: 'player2',
                  nation: null,
                }),
                Action.bondPurchase({
                  nation: Nation.AH,
                  player: 'player2',
                  tradeInValue: 4,
                  cost: 6,
                }),
                Action.bondPurchase({
                  nation: Nation.IT,
                  player: 'player2',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.FR,
                  player: 'player2',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.GB,
                  player: 'player2',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.GE,
                  player: 'player2',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.RU,
                  player: 'player2',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.undo({ player: 'player1' }),
              ]),
            );
          });
        });

        describe('3. Investing without a flag', () => {
          test('a player who has a Swiss Bank may invest', () => {
            const gameCoordinator = newGame();
            const { game } = gameCoordinator;

            // player2 has no bond and no investor card but has enough
            // money to buy a bond.
            gameCoordinator.players.player2.cash = 4;
            gameCoordinator.investorCardHolder = 'player1';
            gameCoordinator.players.player1.cash = 4;
            // Make player1 control all countries
            gameCoordinator.nations.get(Nation.AH).controller = 'player1';
            gameCoordinator.nations.get(Nation.IT).controller = 'player1';
            gameCoordinator.nations.get(Nation.FR).controller = 'player1';
            gameCoordinator.nations.get(Nation.GB).controller = 'player1';
            gameCoordinator.nations.get(Nation.GE).controller = 'player1';
            gameCoordinator.nations.get(Nation.RU).controller = 'player1';
            gameCoordinator.players.player2.bonds.clear();
            gameCoordinator.swissBanks = ['player2'];
            // Set AH's rondel position to be something *before* investor
            gameCoordinator.nations.get(Nation.AH).rondelPosition = 'maneuver1';
            MoveToRondelSlot.forceMoveNation(game.AustriaHungary, game.rondel.maneuver1Slot);

            // The investor slot lies between 'maneuver1' and 'production2'
            gameCoordinator.tick(
              Action.rondel({
                slot: 'production2',
                nation: Nation.AH,
                cost: 0,
              }),
            );
            gameCoordinator.tick(Action.skipForceInvestor({ player: 'player2' }));
            // InvestorCardHolder buys a bond first
            gameCoordinator.tick(
              Action.bondPurchase({
                nation: Nation.AH,
                player: 'player1',
                tradeInValue: 0,
                cost: 4,
              }),
            );

            // For testing purposes, we delete the skip bond purchase and undo actions
            gameCoordinator.availableActions.delete(
              Action.skipBondPurchase({ player: 'player2', nation: null }),
            );
            gameCoordinator.availableActions.delete(
              Action.undo({ player: 'player1' }),
            );
            gameCoordinator.availableActions.forEach((action) => {
              expect(action.type).toEqual('bondPurchase');
              expect(action.payload.player).toEqual('player2');
            });
          });

          test('a player who has a Swiss Bank and the investor card may not invest twice', () => {
            const gameCoordinator = newGame();
            const { game } = gameCoordinator;

            // player2 the investor card.
            gameCoordinator.investorCardHolder = 'player2';
            gameCoordinator.players.player1.cash = 4;
            // Make player1 control all countries
            gameCoordinator.nations.get(Nation.AH).controller = 'player1';
            gameCoordinator.nations.get(Nation.IT).controller = 'player1';
            gameCoordinator.nations.get(Nation.FR).controller = 'player1';
            gameCoordinator.nations.get(Nation.GB).controller = 'player3';
            gameCoordinator.nations.get(Nation.GE).controller = 'player3';
            gameCoordinator.nations.get(Nation.RU).controller = 'player3';
            gameCoordinator.players.player2.bonds.clear();
            // Set AH's rondel position to be something *before* investor
            gameCoordinator.nations.get(Nation.AH).rondelPosition = 'maneuver1';
            MoveToRondelSlot.forceMoveNation(game.AustriaHungary, game.rondel.maneuver1Slot);

            // The investor slot lies between 'maneuver1' and 'production2'
            gameCoordinator.tick(
              Action.rondel({
                slot: 'production2',
                nation: Nation.AH,
                cost: 0,
              }),
            );
            // InvestorCardHolder buys a bond first
            gameCoordinator.tick(
              Action.bondPurchase({
                nation: Nation.AH,
                player: 'player2',
                tradeInValue: 0,
                cost: 4,
              }),
            );

            gameCoordinator.availableActions.forEach((action) => {
              expect(['rondel', 'undo']).toContain(action.type);
            });
          });

          test('a player who has a Swiss Bank does not receive 2m', () => {
            const gameCoordinator = newGame();
            const { game } = gameCoordinator;

            gameCoordinator.players.player2.cash = 0;
            gameCoordinator.players.player1.cash = 4;
            gameCoordinator.investorCardHolder = 'player1';
            // Make player1 control all countries
            gameCoordinator.nations.get(Nation.AH).controller = 'player1';
            gameCoordinator.nations.get(Nation.IT).controller = 'player1';
            gameCoordinator.nations.get(Nation.FR).controller = 'player1';
            gameCoordinator.nations.get(Nation.GB).controller = 'player1';
            gameCoordinator.nations.get(Nation.GE).controller = 'player1';
            gameCoordinator.nations.get(Nation.RU).controller = 'player1';
            gameCoordinator.players.player2.bonds.clear();
            // Set AH's rondel position to be something *before* investor
            gameCoordinator.nations.get(Nation.AH).rondelPosition = 'maneuver1';
            MoveToRondelSlot.forceMoveNation(game.AustriaHungary, game.rondel.maneuver1Slot);

            // The investor slot lies between 'maneuver1' and 'maneuver2'
            gameCoordinator.tick(
              Action.rondel({
                slot: 'production2',
                nation: Nation.AH,
                cost: 0,
              }),
            );
            // InvestorCardHolder buys a bond first
            gameCoordinator.tick(
              Action.bondPurchase({
                nation: Nation.AH,
                player: 'player1',
                tradeInValue: 0,
                cost: 4,
              }),
            );

            expect(gameCoordinator.players.player2.cash).toEqual(0);
          });

          test('multiple players with a Swiss Bank may invest in clockwise order, '
            + 'starting with the current bearer of the investor card', () => {
            const gameCoordinator = newGame();
            const { game } = gameCoordinator;

            gameCoordinator.investorCardHolder = 'player2';
            // Make player3 control all countries
            gameCoordinator.nations.get(Nation.AH).controller = 'player2';
            gameCoordinator.nations.get(Nation.IT).controller = 'player2';
            gameCoordinator.nations.get(Nation.FR).controller = 'player2';
            gameCoordinator.nations.get(Nation.GB).controller = 'player2';
            gameCoordinator.nations.get(Nation.GE).controller = 'player2';
            gameCoordinator.nations.get(Nation.RU).controller = 'player2';
            gameCoordinator.players.player1.bonds.clear();
            gameCoordinator.players.player3.bonds.clear();
            gameCoordinator.players.player1.cash = 30;
            gameCoordinator.players.player3.cash = 30;
            gameCoordinator.swissBanks = ['player3', 'player1'];
            // Set AH's rondel position to be something *before* investor
            gameCoordinator.nations.get(Nation.AH).rondelPosition = 'maneuver1';
            MoveToRondelSlot.forceMoveNation(game.AustriaHungary, game.rondel.maneuver1Slot);

            // The investor slot lies between 'maneuver1' and 'maneuver2'
            gameCoordinator.tick(
              Action.rondel({
                slot: 'production2',
                nation: Nation.AH,
                cost: 0,
              }),
            );
            gameCoordinator.tick(Action.skipForceInvestor({ player: 'player3' }));
            gameCoordinator.tick(Action.skipForceInvestor({ player: 'player1' }));
            // InvestorCardHolder buys a bond first
            gameCoordinator.tick(
              Action.bondPurchase({
                nation: Nation.AH,
                player: 'player2',
                tradeInValue: 0,
                cost: 4,
              }),
            );

            // For testing purposes, we delete the skip bond purchase and undo actions
            gameCoordinator.availableActions.delete(
              Action.skipBondPurchase({ player: 'player3', nation: null }),
            );
            gameCoordinator.availableActions.delete(
              Action.undo({ player: 'player2' }),
            );
            gameCoordinator.availableActions.forEach((action) => {
              expect(action.type).toEqual('bondPurchase');
              expect(action.payload.player).toEqual('player3');
            });

            // player3 (a Swiss Bank) buys a bond next
            gameCoordinator.tick(
              Action.bondPurchase({
                nation: Nation.IT,
                player: 'player3',
                tradeInValue: 0,
                cost: 4,
              }),
            );

            // For testing purposes, we delete the skip bond purchase and undo actions
            gameCoordinator.availableActions.delete(
              Action.skipBondPurchase({ player: 'player1', nation: null }),
            );
            gameCoordinator.availableActions.delete(
              Action.undo({ player: 'player3' }),
            );
            gameCoordinator.availableActions.forEach((action) => {
              expect(action.type).toEqual('bondPurchase');
              expect(action.payload.player).toEqual('player1');
            });

            // player1 (a Swiss Bank) buys a bond next
            gameCoordinator.tick(
              Action.bondPurchase({
                nation: Nation.FR,
                player: 'player1',
                tradeInValue: 0,
                cost: 4,
              }),
            );

            gameCoordinator.availableActions.forEach((action) => {
              expect(['rondel', 'undo']).toContain(action.type);
            });
          });

          test('a player who has a Swiss Bank may choose to force the current nation to stay on the Investor slot, '
            + 'if the nation can pay out all the money it owes', () => {
            const gameCoordinator = newGame();
            const { game } = gameCoordinator;

            gameCoordinator.players.player1.cash = 2;
            gameCoordinator.investorCardHolder = 'player1';
            gameCoordinator.provinces.get('a').factory = 'armaments';
            gameCoordinator.swissBanks = ['player2', 'player3'];
            // Make player1 control all countries
            gameCoordinator.nations.get(Nation.AH).controller = 'player1';
            gameCoordinator.nations.get(Nation.IT).controller = 'player1';
            gameCoordinator.nations.get(Nation.FR).controller = 'player1';
            gameCoordinator.nations.get(Nation.GB).controller = 'player1';
            gameCoordinator.nations.get(Nation.GE).controller = 'player1';
            gameCoordinator.nations.get(Nation.RU).controller = 'player1';
            gameCoordinator.players.player2.bonds.clear();
            // Set AH's rondel position to be something *before* investor
            gameCoordinator.nations.get(Nation.AH).rondelPosition = 'maneuver1';
            MoveToRondelSlot.forceMoveNation(game.AustriaHungary, game.rondel.maneuver1Slot);

            // The investor slot lies between "maneuver1" and "production2"
            gameCoordinator.tick(
              Action.rondel({
                slot: 'production2',
                nation: Nation.AH,
                cost: 0,
              }),
            );

            expect(gameCoordinator.availableActions).toEqual(
              new Set([
                Action.forceInvestor({ player: 'player2' }),
                Action.skipForceInvestor({ player: 'player2' }),
                Action.forceInvestor({ player: 'player3' }),
                Action.skipForceInvestor({ player: 'player3' }),
                Action.undo({ player: 'player1' }),
              ]),
            );

            gameCoordinator.tick(
              Action.forceInvestor({
                player: 'player2',
              }),
            );

            // AH was forced to stay on investor so production never got triggered.
            expect(gameCoordinator.units.get(Nation.AH).get('a')).toEqual({
              armies: 0,
              fleets: 0,
              friendly: true,
            });
            expect(gameCoordinator.nations.get(Nation.AH).rondelPosition).toEqual(
              'investor',
            );
            expect(gameCoordinator.availableActions).toEqual(
              new Set([
                Action.skipBondPurchase({
                  player: 'player1',
                  nation: null,
                }),
                Action.bondPurchase({
                  nation: Nation.AH,
                  player: 'player1',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.AH,
                  player: 'player1',
                  tradeInValue: 0,
                  cost: 6,
                }),
                Action.bondPurchase({
                  nation: Nation.AH,
                  player: 'player1',
                  tradeInValue: 9,
                  cost: 12,
                }),
                Action.bondPurchase({
                  nation: Nation.AH,
                  player: 'player1',
                  tradeInValue: 9,
                  cost: 16,
                }),
                Action.bondPurchase({
                  nation: Nation.IT,
                  player: 'player1',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.IT,
                  player: 'player1',
                  tradeInValue: 0,
                  cost: 6,
                }),
                Action.bondPurchase({
                  nation: Nation.FR,
                  player: 'player1',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.FR,
                  player: 'player1',
                  tradeInValue: 0,
                  cost: 6,
                }),
                Action.bondPurchase({
                  nation: Nation.GB,
                  player: 'player1',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.GB,
                  player: 'player1',
                  tradeInValue: 0,
                  cost: 6,
                }),
                Action.bondPurchase({
                  nation: Nation.GB,
                  player: 'player1',
                  tradeInValue: 9,
                  cost: 12,
                }),
                Action.bondPurchase({
                  nation: Nation.GB,
                  player: 'player1',
                  tradeInValue: 9,
                  cost: 16,
                }),
                Action.bondPurchase({
                  nation: Nation.GE,
                  player: 'player1',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.GE,
                  player: 'player1',
                  tradeInValue: 2,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.GE,
                  player: 'player1',
                  tradeInValue: 0,
                  cost: 6,
                }),
                Action.bondPurchase({
                  nation: Nation.GE,
                  player: 'player1',
                  tradeInValue: 2,
                  cost: 6,
                }),
                Action.bondPurchase({
                  nation: Nation.RU,
                  player: 'player1',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.RU,
                  player: 'player1',
                  tradeInValue: 2,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.RU,
                  player: 'player1',
                  tradeInValue: 0,
                  cost: 6,
                }),
                Action.bondPurchase({
                  nation: Nation.RU,
                  player: 'player1',
                  tradeInValue: 2,
                  cost: 6,
                }),
                Action.undo({ player: 'player3' }),
              ]),
            );
          });

          test('a player who has a Swiss Bank may not choose to force the current nation to stay on the Investor slot, '
            + 'if the nation cannot pay out all the money it owes', () => {
            const gameCoordinator = newGame();
            const { game } = gameCoordinator;

            gameCoordinator.players.player1.cash = 2;
            gameCoordinator.investorCardHolder = 'player1';
            gameCoordinator.provinces.get('a').factory = 'armaments';
            // Make player1 control all countries
            gameCoordinator.nations.get(Nation.AH).controller = 'player1';
            gameCoordinator.nations.get(Nation.IT).controller = 'player1';
            gameCoordinator.nations.get(Nation.FR).controller = 'player1';
            gameCoordinator.nations.get(Nation.GB).controller = 'player1';
            gameCoordinator.nations.get(Nation.GE).controller = 'player1';
            gameCoordinator.nations.get(Nation.RU).controller = 'player1';
            gameCoordinator.players.player2.bonds.clear();

            // Set AH's rondel position to be something *before* investor
            gameCoordinator.nations.get(Nation.AH).rondelPosition = 'maneuver1';
            MoveToRondelSlot.forceMoveNation(game.AustriaHungary, game.rondel.maneuver1Slot);
            gameCoordinator.nations.get(Nation.AH).treasury = 0;

            // The investor slot lies between 'maneuver1' and 'maneuver2'
            gameCoordinator.tick(
              Action.rondel({
                slot: 'production2',
                nation: Nation.AH,
                cost: 0,
              }),
            );

            expect(gameCoordinator.availableActions).toEqual(
              new Set([
                Action.skipBondPurchase({
                  player: 'player1',
                  nation: null,
                }),
                Action.bondPurchase({
                  nation: Nation.AH,
                  player: 'player1',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.AH,
                  player: 'player1',
                  tradeInValue: 9,
                  cost: 12,
                }),
                Action.bondPurchase({
                  nation: Nation.IT,
                  player: 'player1',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.FR,
                  player: 'player1',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.GB,
                  player: 'player1',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.GB,
                  player: 'player1',
                  tradeInValue: 9,
                  cost: 12,
                }),
                Action.bondPurchase({
                  nation: Nation.GE,
                  player: 'player1',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.GE,
                  player: 'player1',
                  tradeInValue: 2,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.GE,
                  player: 'player1',
                  tradeInValue: 2,
                  cost: 6,
                }),
                Action.bondPurchase({
                  nation: Nation.RU,
                  player: 'player1',
                  tradeInValue: 0,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.RU,
                  player: 'player1',
                  tradeInValue: 2,
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.RU,
                  player: 'player1',
                  tradeInValue: 2,
                  cost: 6,
                }),
                Action.undo({ player: 'player1' }),
              ]),
            );
          });
        });

        test('holder of investor card only gets money after nation passes investor rondel slot', () => {
          const newRealisticGame = () => {
            const board = new GameBoard({
              nodes: [{ name: 'a', nation: Nation.AH }, { name: 'b' }],
              edges: [['a', 'b']],
            });

            const game = new Imperial(board);
            game.tick(
              Action.initialize({
                players: [
                  { id: 'player1', nation: Nation.AH },
                  { id: 'player2', nation: Nation.IT },
                  { id: 'player3', nation: Nation.FR },
                ],
                soloMode: false,
                variant: 'standard',
                baseGame: 'imperial',
              }),
            );
            return game;
          };

          const gameCoordinator = newRealisticGame();
          const { game } = gameCoordinator;
          // Make player1 the investor card holder
          gameCoordinator.investorCardHolder = 'player1';

          gameCoordinator.nations.get(Nation.AH).rondelPosition = 'production1';
          MoveToRondelSlot.forceMoveNation(game.AustriaHungary, game.rondel.production1Slot);

          // Clear out player1's bonds so they can't trade any in
          gameCoordinator.players.player1.bonds.clear();
          gameCoordinator.units.get(Nation.AH).get('a').armies = 1;
          gameCoordinator.units.get(Nation.IT).get('b').armies = 1;

          gameCoordinator.players.player1.cash = 6;

          gameCoordinator.tick(
            Action.rondel({
              slot: 'maneuver2',
              nation: Nation.AH,
              // the game technically only accepts moves of costs 0 because the available actions were generated in initialize
              // when the nations haven't made a move yet
              // will need to update
              cost: 0,
            }),
          );

          expect(gameCoordinator.players.player1.cash).toEqual(2);

          gameCoordinator.tick(Action.maneuver({ destination: 'b', origin: 'a' }));
          gameCoordinator.tick(Action.fight({
            challenger: Nation.AH, incumbent: Nation.IT, province: 'b', targetType: 'army',
          }));

          // from investor card after moving through investor slot
          expect(gameCoordinator.players.player1.cash).toEqual(4);
          expect(gameCoordinator.availableActions).toEqual(
            new Set([
              Action.skipBondPurchase({
                player: 'player1',
                nation: null,
              }),
              Action.bondPurchase({
                nation: Nation.AH,
                player: 'player1',
                tradeInValue: 0,
                cost: 4,
              }),
              Action.bondPurchase({
                nation: Nation.IT,
                player: 'player1',
                tradeInValue: 0,
                cost: 4,
              }),
              Action.bondPurchase({
                nation: Nation.FR,
                player: 'player1',
                tradeInValue: 0,
                cost: 4,
              }),
              Action.bondPurchase({
                nation: Nation.GB,
                player: 'player1',
                tradeInValue: 0,
                cost: 4,
              }),
              Action.bondPurchase({
                nation: Nation.GE,
                player: 'player1',
                tradeInValue: 0,
                cost: 4,
              }),
              Action.bondPurchase({
                nation: Nation.RU,
                player: 'player1',
                tradeInValue: 0,
                cost: 4,
              }),
              Action.undo({ player: 'player1' }),
            ]),
          );
        });
      });

      describe('taxation', () => {
        const newGame = () => {
          const board = new GameBoard({
            nodes: [
              { name: 'a', nation: Nation.AH },
              { name: 'b', nation: Nation.AH },
              { name: 'c', nation: null },
              { name: 'd', nation: null },
              { name: 'e', nation: Nation.AH },
              { name: 'f', nation: Nation.AH },
              { name: 'g', nation: Nation.AH },
              { name: 'h', nation: null },
              { name: 'i', nation: null },
              { name: 'j', nation: null },
              { name: 'k', nation: null },
              { name: 'l', nation: null },
              { name: 'm', nation: null },
              { name: 'n', nation: null },
              { name: 'o', nation: null },
              { name: 'p', nation: null },
            ],
            edges: [],
          });

          const game = new Imperial(board);
          initialize(game);
          return game;
        };

        describe('tax revenue / success bonus & collecting money', () => {
          test('taxes are paid out even when there is no increase on tax chart', () => {
            const game = newGame();
            // Set taxChartPosition to lowest value, 5
            game.nations.get(Nation.AH).taxChartPosition = 5;
            // Place two AH factories on the board
            game.provinces.get('a').factory = 'armaments';
            game.provinces.get('b').factory = 'armaments';
            // Add a flag for AH
            game.provinces.get('c').flag = Nation.AH;
            // Arbitrarily give AH 5 treasury; we want this to increase by 5
            game.nations.get(Nation.AH).treasury = 5;

            game.tick(
              Action.rondel({ cost: 0, nation: Nation.AH, slot: 'taxation' }),
            );

            expect(game.nations.get(Nation.AH).treasury).toEqual(10);
          });

          test('payment comes when advancement on tax chart happens', () => {
            const game = newGame();
            // Set taxChartPosition to lowest value, 5
            game.nations.get(Nation.AH).taxChartPosition = 5;
            // Place two AH factories on the board
            game.provinces.get('a').factory = 'armaments';
            game.provinces.get('b').factory = 'armaments';
            // Add two flags for AH
            game.provinces.get('c').flag = Nation.AH;
            game.provinces.get('d').flag = Nation.AH;
            // Arbitrarily give AH 5 treasury; we want this to increase by 6
            game.nations.get(Nation.AH).treasury = 5;

            game.tick(
              Action.rondel({ cost: 0, nation: Nation.AH, slot: 'taxation' }),
            );

            expect(game.nations.get(Nation.AH).treasury).toEqual(11);
            expect(game.nations.get(Nation.AH).taxChartPosition).toEqual(6);
          });

          test('occupied factories generate no taxes', () => {
            const game = newGame();
            // Set taxChartPosition to lowest value, 5
            game.nations.get(Nation.AH).taxChartPosition = 5;
            // Place three AH factories on the board
            game.provinces.get('a').factory = 'armaments';
            game.provinces.get('b').factory = 'armaments';
            game.provinces.get('e').factory = 'armaments';
            // Add a flag for AH
            game.provinces.get('c').flag = Nation.AH;
            // Italy is occupying "a"!
            game.units.get(Nation.IT).get('a').armies = 1;
            // Arbitrarily give AH 5 treasury; we want this to increase by 5
            game.nations.get(Nation.AH).treasury = 5;

            game.tick(
              Action.rondel({ cost: 0, nation: Nation.AH, slot: 'taxation' }),
            );

            expect(game.nations.get(Nation.AH).treasury).toEqual(10);
          });

          test('tax revenue cannot exceed 20 and taxChartPosition cannot exceed 15', () => {
            const game = newGame();
            // Set taxChartPosition to lowest value, 5
            game.nations.get(Nation.AH).taxChartPosition = 5;
            // Place five AH factories on the board
            game.provinces.get('a').factory = 'armaments';
            game.provinces.get('b').factory = 'armaments';
            game.provinces.get('e').factory = 'armaments';
            game.provinces.get('f').factory = 'armaments';
            game.provinces.get('g').factory = 'armaments';
            // Add eleven flags for AH
            game.provinces.get('c').flag = Nation.AH;
            game.provinces.get('d').flag = Nation.AH;
            game.provinces.get('h').flag = Nation.AH;
            game.provinces.get('i').flag = Nation.AH;
            game.provinces.get('j').flag = Nation.AH;
            game.provinces.get('k').flag = Nation.AH;
            game.provinces.get('l').flag = Nation.AH;
            game.provinces.get('m').flag = Nation.AH;
            game.provinces.get('n').flag = Nation.AH;
            game.provinces.get('o').flag = Nation.AH;
            game.provinces.get('p').flag = Nation.AH;
            // Arbitrarily give AH 5 treasury; we want this to increase by 20, not 21
            game.nations.get(Nation.AH).treasury = 5;

            game.tick(
              Action.rondel({ cost: 0, nation: Nation.AH, slot: 'taxation' }),
            );

            expect(game.nations.get(Nation.AH).treasury).toEqual(25);
            expect(game.nations.get(Nation.AH).taxChartPosition).toEqual(15);
            expect(game.nations.get(Nation.AH).powerPoints).toEqual(10);
            expect(game.players.player1.cash).toEqual(12);
          });

          test("nation's taxChartPosition cannot fall below 5", () => {
            const game = newGame();
            // Set taxChartPosition to lowest value, 5
            game.nations.get(Nation.AH).taxChartPosition = 5;
            // Place one AH factory on the board
            game.provinces.get('a').factory = 'armaments';
            // Arbitrarily give AH 5 treasury; we want this to increase by 2
            game.nations.get(Nation.AH).treasury = 5;

            game.tick(
              Action.rondel({ cost: 0, nation: Nation.AH, slot: 'taxation' }),
            );

            expect(game.nations.get(Nation.AH).treasury).toEqual(7);
            expect(game.nations.get(Nation.AH).taxChartPosition).toEqual(5);
          });

          test('payment to nation is reduced if they control units', () => {
            const game = newGame();
            // Set taxChartPosition to lowest value, 5
            game.nations.get(Nation.AH).taxChartPosition = 5;
            // Place two AH factories on the board
            game.provinces.get('a').factory = 'armaments';
            game.provinces.get('b').factory = 'armaments';
            // Add two flags for AH
            game.provinces.get('c').flag = Nation.AH;
            game.provinces.get('d').flag = Nation.AH;
            // Arbitrarily give AH 5 treasury; we want this to increase to 10
            game.nations.get(Nation.AH).treasury = 5;
            // AH controls one army
            game.units.get(Nation.AH).get('a').armies = 1;

            game.tick(
              Action.rondel({ cost: 0, nation: Nation.AH, slot: 'taxation' }),
            );

            expect(game.nations.get(Nation.AH).treasury).toEqual(10);
            expect(game.nations.get(Nation.AH).taxChartPosition).toEqual(6);
          });

          test('nations cannot be paid less than 0 if they control many units', () => {
            const game = newGame();
            // Set taxChartPosition to lowest value, 5
            game.nations.get(Nation.AH).taxChartPosition = 5;
            // Arbitrarily give AH 5 treasury; we want this to increase by 1
            game.nations.get(Nation.AH).treasury = 5;
            // AH controls one army
            game.units.get(Nation.AH).get('a').armies = 1;

            game.tick(
              Action.rondel({ cost: 0, nation: Nation.AH, slot: 'taxation' }),
            );

            expect(game.nations.get(Nation.AH).treasury).toEqual(5);
          });
        });

        describe('adding power points', () => {
          test('nation earns no power points', () => {
            const gameCoordinator = newGame();
            // Arbitrarily give AH 3 power points
            gameCoordinator.nations.get(Nation.AH).powerPoints = 3;
            gameCoordinator.game.AustriaHungary.powerPoints = 3;

            gameCoordinator.tick(
              Action.rondel({ cost: 0, nation: Nation.AH, slot: 'taxation' }),
            );

            expect(gameCoordinator.nations.get(Nation.AH).powerPoints).toEqual(3);
          });

          test('nation earns one power point', () => {
            const gameCoordinator = newGame();
            // Arbitrarily give AH 3 power points
            gameCoordinator.nations.get(Nation.AH).powerPoints = 3;
            gameCoordinator.game.AustriaHungary.powerPoints = 3;
            // Give AH factories and flags for 6 taxes
            gameCoordinator.provinces.get('a').factory = 'armaments';
            gameCoordinator.provinces.get('b').factory = 'armaments';
            gameCoordinator.provinces.get('c').flag = Nation.AH;
            gameCoordinator.provinces.get('d').flag = Nation.AH;

            gameCoordinator.tick(
              Action.rondel({ cost: 0, nation: Nation.AH, slot: 'taxation' }),
            );

            expect(gameCoordinator.nations.get(Nation.AH).powerPoints).toEqual(4);
          });

          test('achieving 25 power points (or more) triggers game end', () => {
            const gameCoordinator = newGame();
            // Arbitrarily give AH 3 power points
            gameCoordinator.nations.get(Nation.AH).powerPoints = 24;
            gameCoordinator.game.AustriaHungary.powerPoints = 24;
            // Give AH stuff to put AH's power points over 25
            gameCoordinator.provinces.get('a').factory = 'armaments';
            gameCoordinator.provinces.get('b').factory = 'armaments';
            gameCoordinator.provinces.get('c').flag = Nation.AH;
            gameCoordinator.provinces.get('d').flag = Nation.AH;
            gameCoordinator.provinces.get('e').flag = Nation.AH;

            gameCoordinator.tick(
              Action.rondel({ cost: 0, nation: Nation.AH, slot: 'taxation' }),
            );

            expect(gameCoordinator.nations.get(Nation.AH).powerPoints).toEqual(25);
            expect(gameCoordinator.log[gameCoordinator.log.length - 1]).toEqual(Action.endGame());
          });

          test('based on a real-life example!', () => {
            const gameCoordinator = newGame();
            // Arbitrarily give AH 3 power points
            gameCoordinator.nations.get(Nation.AH).powerPoints = 6;
            gameCoordinator.game.AustriaHungary.powerPoints = 6;

            gameCoordinator.nations.get(Nation.AH).taxChartPosition = 11;
            // Give AH stuff to put AH's power points over 25
            gameCoordinator.provinces.get('a').factory = 'armaments';
            gameCoordinator.provinces.get('b').factory = 'armaments';
            gameCoordinator.provinces.get('c').flag = Nation.AH;
            gameCoordinator.provinces.get('d').flag = Nation.AH;
            gameCoordinator.provinces.get('e').factory = 'armaments';
            gameCoordinator.provinces.get('h').flag = Nation.AH;
            gameCoordinator.provinces.get('i').flag = Nation.AH;
            gameCoordinator.provinces.get('j').flag = Nation.AH;
            gameCoordinator.provinces.get('k').flag = Nation.AH;

            gameCoordinator.tick(
              Action.rondel({ cost: 0, nation: Nation.AH, slot: 'taxation' }),
            );

            expect(gameCoordinator.nations.get(Nation.AH).powerPoints).toEqual(13);
            expect(gameCoordinator.players.player1.cash).toEqual(3);
          });
        });
      });

      describe('factory', () => {
        const newGame = () => {
          const board = new GameBoard({
            nodes: [
              { name: 'a', nation: Nation.AH },
              { name: 'b', nation: Nation.AH },
            ],
            edges: [],
          });

          const game = new Imperial(board);
          initialize(game);
          return game;
        };

        test('nation may choose where to build the factory', () => {
          const game = newGame();

          game.tick(
            Action.rondel({ slot: 'factory', cost: 0, nation: Nation.AH }),
          );

          expect(game.availableActions).toEqual(
            new Set([
              Action.buildFactory({
                province: 'a', player: 'player1', nationCosts: 5, playerCosts: 0,
              }),
              Action.buildFactory({
                province: 'b', player: 'player1', nationCosts: 5, playerCosts: 0,
              }),
              Action.skipBuildFactory({ nation: Nation.AH, player: 'player1' }),
              Action.undo({ player: 'player1' }),
            ]),
          );
          expect(game.buildingFactory).toEqual(true);
        });

        test('nation may not build a factory where one is already built', () => {
          const game = newGame();
          game.provinces.get('a').factory = 'armaments';

          game.tick(
            Action.rondel({ slot: 'factory', cost: 0, nation: Nation.AH }),
          );

          expect(game.availableActions).toEqual(
            new Set([
              Action.buildFactory({
                province: 'b', player: 'player1', nationCosts: 5, playerCosts: 0,
              }),
              Action.skipBuildFactory({ nation: Nation.AH, player: 'player1' }),
              Action.undo({ player: 'player1' }),
            ]),
          );
          expect(game.buildingFactory).toEqual(true);
        });

        test('player may fund nation to build factory if deficit', () => {
          // Arrange
          const game = newGame();
          game.nations.get(Nation.AH).treasury = 3;

          // Act
          game.tick(
            Action.rondel({ slot: 'factory', cost: 0, nation: Nation.AH }),
          );

          // Assert
          expect(game.availableActions).toEqual(
            new Set([
              Action.buildFactory({
                province: 'a', player: 'player1', nationCosts: 3, playerCosts: 2,
              }),
              Action.buildFactory({
                province: 'b', player: 'player1', nationCosts: 3, playerCosts: 2,
              }),
              Action.skipBuildFactory({ nation: Nation.AH, player: 'player1' }),
              Action.undo({ player: 'player1' }),
            ]),
          );
          expect(game.buildingFactory).toEqual(true);
        });

        test('nation may not build a factory where a foreign unit is present', () => {
          const game = newGame();
          game.units.get(Nation.IT).get('a').armies = 1;

          game.tick(
            Action.rondel({ slot: 'factory', cost: 0, nation: Nation.AH }),
          );

          expect(game.availableActions).toEqual(
            new Set([
              Action.buildFactory({
                province: 'b', player: 'player1', nationCosts: 5, playerCosts: 0,
              }),
              Action.skipBuildFactory({ nation: Nation.AH, player: 'player1' }),
              Action.undo({ player: 'player1' }),
            ]),
          );
          expect(game.buildingFactory).toEqual(true);
        });
      });
    });

    describe('maneuver', () => {
      const newGame = () => {
        const board = new GameBoard({
          nodes: [
            { name: 'a', nation: null, isOcean: true },
            { name: 'b', nation: null, isOcean: true },
            { name: 'c', nation: Nation.AH },
            { name: 'd', nation: Nation.AH, egress: 'a' },
            { name: 'e', nation: null },
            { name: 'f', nation: Nation.IT },
            { name: 'g', nation: null },
            { name: 'h', nation: Nation.IT },
          ],
          // "g" - "a" - "e"
          //     /   \  /
          //   "b"   "d" - "c" - "f"
          edges: [
            ['a', 'b'],
            ['c', 'd'],
            ['a', 'd'],
            ['a', 'e'],
            ['c', 'f'],
            ['d', 'e'],
            ['a', 'g'],
          ],
        });

        const game = new Imperial(board);
        initialize(game);
        // Allow Italy to be able to afford a factory
        game.nations.get(Nation.IT).treasury = 5;
        return game;
      };

      describe('nation controls one fleet', () => {
        test('maneuver fleet to vacant destination moves the fleet', () => {
          const game = newGame();
          game.units.get(Nation.AH).get('a').fleets += 1;
          const expected = new Set(
            [
              'factory',
              'production1',
              'maneuver1',
              'investor',
              'import',
              'production2',
              'maneuver2',
              'taxation',
            ].map((slot) => Action.rondel({ nation: Nation.IT, cost: 0, slot })),
          );
          expected.add(Action.undo({ player: 'player1' }));

          game.tick(
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          );
          game.tick(Action.maneuver({ origin: 'a', destination: 'b' }));

          expect(game.units.get(Nation.AH).get('a').fleets).toEqual(0);
          expect(game.units.get(Nation.AH).get('b').fleets).toEqual(1);
          expect(game.currentNation).toEqual(Nation.IT);
          expect(game.availableActions).toEqual(expected);
        });

        test('maneuver fleet to occupied destination allows occupier to decide whether to fight', () => {
          const game = newGame();
          game.units.get(Nation.AH).get('a').fleets += 1;
          game.units.get(Nation.IT).get('b').fleets += 1;

          game.tick(
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          );
          game.tick(Action.maneuver({ origin: 'a', destination: 'b' }));

          expect(game.availableActions).toEqual(
            new Set([
              Action.fight({
                province: 'b',
                incumbent: Nation.IT,
                challenger: Nation.AH,
                targetType: 'fleet',
              }),
              Action.coexist({
                province: 'b',
                incumbent: Nation.IT,
                challenger: Nation.AH,
              }),
              Action.undo({ player: 'player1' }),
            ]),
          );
          expect(game.currentPlayerName).toEqual('player1');
        });
      });

      describe('nation controls two fleets', () => {
        test('maneuver one fleet allows the other to be maneuvered', () => {
          const game = newGame();
          game.units.get(Nation.AH).get('a').fleets += 1;
          game.units.get(Nation.AH).get('b').fleets += 1;

          game.tick(
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          );
          game.tick(Action.maneuver({ origin: 'a', destination: 'b' }));

          expect(game.units.get(Nation.AH).get('a').fleets).toEqual(0);
          expect(game.units.get(Nation.AH).get('b').fleets).toEqual(2);
          expect(game.availableActions).toEqual(
            new Set([
              Action.endManeuver(),
              Action.maneuver({ origin: 'b', destination: 'a' }),
              Action.undo({ player: 'player1' }),
            ]),
          );
        });
      });

      describe('nation controls one army', () => {
        test('maneuver army to vacant destination moves the army', () => {
          const game = newGame();
          game.units.get(Nation.AH).get('c').armies += 1;
          const expected = new Set(
            [
              'factory',
              'production1',
              'maneuver1',
              'investor',
              'import',
              'production2',
              'maneuver2',
              'taxation',
            ].map((slot) => Action.rondel({ nation: Nation.IT, cost: 0, slot })),
          );
          expected.add(Action.undo({ player: 'player1' }));

          game.tick(
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          );
          game.tick(Action.maneuver({ origin: 'c', destination: 'd' }));

          expect(game.units.get(Nation.AH).get('c').armies).toEqual(0);
          expect(game.units.get(Nation.AH).get('d').armies).toEqual(1);
          expect(game.currentNation).toEqual(Nation.IT);
          expect(game.availableActions).toEqual(expected);
        });

        test('maneuver army to occupied destination allows occupier to decide whether to fight', () => {
          const game = newGame();
          game.units.get(Nation.AH).get('c').armies += 1;
          game.units.get(Nation.IT).get('d').armies += 1;

          game.tick(
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          );
          game.tick(Action.maneuver({ origin: 'c', destination: 'd' }));

          expect(game.availableActions).toEqual(
            new Set([
              Action.coexist({
                province: 'd',
                incumbent: Nation.IT,
                challenger: Nation.AH,
              }),
              Action.fight({
                province: 'd',
                incumbent: Nation.IT,
                challenger: Nation.AH,
                targetType: 'army',
              }),
              Action.undo({ player: 'player1' }),
            ]),
          );
          expect(game.currentPlayerName).toEqual('player1');
        });

        test('maneuver army to destination occupied by two others allows occupier to decide who to fight', () => {
          const game = newGame();
          game.units.get(Nation.AH).get('c').armies += 1;
          game.units.get(Nation.IT).get('d').armies += 1;
          game.units.get(Nation.FR).get('d').armies += 1;

          game.tick(
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          );
          game.tick(Action.maneuver({ origin: 'c', destination: 'd' }));

          expect(game.availableActions).toEqual(
            new Set([
              Action.coexist({
                province: 'd',
                incumbent: Nation.IT,
                challenger: Nation.AH,
              }),
              Action.fight({
                province: 'd',
                incumbent: Nation.IT,
                challenger: Nation.AH,
                targetType: 'army',
              }),
              Action.fight({
                province: 'd',
                incumbent: Nation.FR,
                challenger: Nation.AH,
                targetType: 'army',
              }),
              Action.undo({ player: 'player1' }),
            ]),
          );
          expect(game.currentPlayerName).toEqual('player1');
        });

        test('maneuver army to home province of another nation allows challenger to decide whether to be friendly or not', () => {
          const game = newGame();
          game.units.get(Nation.AH).get('d').armies += 1;

          game.tick(
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          );
          game.tick(Action.maneuver({ origin: 'd', destination: 'f' }));

          expect(game.availableActions).toEqual(
            new Set([
              Action.friendlyEntrance({
                province: 'f',
                incumbent: Nation.IT,
                challenger: Nation.AH,
              }),
              Action.unfriendlyEntrance({
                province: 'f',
                incumbent: Nation.IT,
                challenger: Nation.AH,
              }),
              Action.undo({ player: 'player1' }),
            ]),
          );
        });

        test('maneuver army to home province of another nation that also contains an army'
          + 'belonging to the other nation sets army to friendly if they agree to be friendly', () => {
          const game = newGame();
          game.units.get(Nation.AH).get('d').armies += 1;
          game.units.get(Nation.IT).get('f').armies += 1;

          game.tick(
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          );
          game.tick(Action.maneuver({ origin: 'd', destination: 'f' }));
          game.tick(
            Action.coexist({
              province: 'f',
              incumbent: Nation.IT,
              challenger: Nation.AH,
            }),
          );
          game.tick(
            Action.coexist({
              province: 'f',
              incumbent: Nation.AH,
              challenger: Nation.IT,
            }),
          );

          expect(game.units.get(Nation.AH).get('f').friendly).toEqual(true);
        });
      });

      describe('nation controls two armies', () => {
        test('maneuver one army allows the other to be maneuvered', () => {
          const game = newGame();
          game.units.get(Nation.AH).get('c').armies += 1;
          game.units.get(Nation.AH).get('d').armies += 1;

          game.tick(
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          );
          game.tick(Action.maneuver({ origin: 'c', destination: 'd' }));

          expect(game.units.get(Nation.AH).get('c').armies).toEqual(0);
          expect(game.units.get(Nation.AH).get('d').armies).toEqual(2);
          expect(game.availableActions).toEqual(
            new Set([
              Action.endManeuver(),
              Action.maneuver({ origin: 'd', destination: 'c' }),
              Action.maneuver({ origin: 'd', destination: 'e' }),
              Action.maneuver({ origin: 'd', destination: 'f' }),
              Action.undo({ player: 'player1' }),
            ]),
          );
        });

        test('both armies are in the same origin province', () => {
          const game = newGame();
          game.units.get(Nation.AH).get('c').armies += 1;
          game.units.get(Nation.AH).get('c').armies += 1;

          game.tick(
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          );
          game.tick(Action.maneuver({ origin: 'c', destination: 'd' }));

          expect(game.units.get(Nation.AH).get('c').armies).toEqual(1);
          expect(game.units.get(Nation.AH).get('d').armies).toEqual(1);
          expect(game.availableActions).toEqual(
            new Set([
              Action.endManeuver(),
              Action.maneuver({ origin: 'c', destination: 'd' }),
              Action.maneuver({ origin: 'c', destination: 'e' }),
              Action.maneuver({ origin: 'c', destination: 'f' }),
              Action.undo({ player: 'player1' }),
            ]),
          );
        });
      });

      describe('nation controls one fleet and one army', () => {
        test('fleet maneuver allows the army to maneuver', () => {
          const game = newGame();
          game.units.get(Nation.AH).get('a').fleets += 1;
          game.units.get(Nation.AH).get('c').armies += 1;

          game.tick(
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          );
          game.tick(Action.maneuver({ origin: 'a', destination: 'b' }));

          expect(game.availableActions).toEqual(
            new Set([
              Action.endManeuver(),
              Action.maneuver({ origin: 'c', destination: 'd' }),
              Action.maneuver({ origin: 'c', destination: 'e' }),
              Action.maneuver({ origin: 'c', destination: 'f' }),
              Action.undo({ player: 'player1' }),
            ]),
          );
        });

        test('army maneuver does not allow the fleet to maneuver', () => {
          const game = newGame();
          game.units.get(Nation.AH).get('a').fleets += 1;
          game.units.get(Nation.AH).get('c').armies += 1;

          game.tick(
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          );
          game.tick(Action.maneuver({ origin: 'c', destination: 'd' }));
          const expected = new Set(
            [
              'factory',
              'production1',
              'maneuver1',
              'investor',
              'import',
              'production2',
              'maneuver2',
              'taxation',
            ].map((slot) => Action.rondel({ nation: Nation.IT, cost: 0, slot })),
          );
          expected.add(Action.undo({ player: 'player1' }));

          expect(game.currentNation).toEqual(Nation.IT);
          expect(game.availableActions).toEqual(expected);
        });

        test('fleet can convoy the army', () => {
          const game = newGame();
          game.units.get(Nation.AH).get('b').fleets += 1;
          game.units.get(Nation.AH).get('d').armies += 1;

          game.tick(
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          );

          expect(game.availableActions).toEqual(
            new Set([
              Action.endManeuver(),
              Action.maneuver({ origin: 'b', destination: 'a' }),
              Action.maneuver({ origin: 'd', destination: 'e' }),
              Action.maneuver({ origin: 'd', destination: 'c' }),
              Action.maneuver({ origin: 'd', destination: 'f' }),
              Action.undo({ player: 'player1' }),
            ]),
          );

          game.tick(Action.maneuver({ origin: 'b', destination: 'a' }));

          expect(game.availableActions).toEqual(
            new Set([
              Action.endManeuver(),
              Action.maneuver({ origin: 'd', destination: 'e' }),
              Action.maneuver({ origin: 'd', destination: 'c' }),
              Action.maneuver({ origin: 'd', destination: 'f' }),
              Action.maneuver({ origin: 'd', destination: 'g' }),
              Action.undo({ player: 'player1' }),
            ]),
          );
        });

        test('fleet can convoy only one army', () => {
          const game = newGame();
          game.units.get(Nation.AH).get('b').fleets += 1;
          game.units.get(Nation.AH).get('c').armies += 1;
          game.units.get(Nation.AH).get('c').armies += 1;

          game.tick(
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          );

          expect(game.availableActions).toEqual(
            new Set([
              Action.endManeuver(),
              Action.maneuver({ origin: 'b', destination: 'a' }),
              Action.maneuver({ origin: 'c', destination: 'd' }),
              Action.maneuver({ origin: 'c', destination: 'e' }),
              Action.maneuver({ origin: 'c', destination: 'f' }),
              Action.undo({ player: 'player1' }),
            ]),
          );

          game.tick(Action.maneuver({ origin: 'b', destination: 'a' }));

          expect(game.availableActions).toEqual(
            new Set([
              Action.endManeuver(),
              Action.maneuver({ origin: 'c', destination: 'd' }),
              Action.maneuver({ origin: 'c', destination: 'e' }),
              Action.maneuver({ origin: 'c', destination: 'g' }),
              Action.maneuver({ origin: 'c', destination: 'f' }),
              Action.undo({ player: 'player1' }),
            ]),
          );

          game.tick(Action.maneuver({ origin: 'c', destination: 'g' }));

          expect(game.availableActions).toEqual(
            new Set([
              Action.endManeuver(),
              Action.maneuver({ origin: 'c', destination: 'd' }),
              Action.maneuver({ origin: 'c', destination: 'e' }),
              Action.maneuver({ origin: 'c', destination: 'f' }),
              Action.undo({ player: 'player1' }),
            ]),
          );
        });

        test('fleet can convoy army even after a naval fight', () => {
          const game = newGame();
          game.units.get(Nation.AH).get('d').fleets += 1;
          game.units.get(Nation.AH).get('d').fleets += 1;
          game.units.get(Nation.AH).get('d').armies += 1;
          game.units.get(Nation.IT).get('a').fleets += 1;

          game.tick(
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          );

          expect(game.availableActions).toEqual(
            new Set([
              Action.endManeuver(),
              Action.maneuver({ origin: 'd', destination: 'c' }),
              Action.maneuver({ origin: 'd', destination: 'f' }),
              Action.maneuver({ origin: 'd', destination: 'e' }),
              Action.maneuver({ origin: 'd', destination: 'a' }),
              Action.undo({ player: 'player1' }),
            ]),
          );

          game.tick(Action.maneuver({ origin: 'd', destination: 'a' }));

          expect(game.availableActions).toEqual(
            new Set([
              Action.fight({
                province: 'a', challenger: Nation.AH, incumbent: Nation.IT, targetType: 'fleet',
              }),
              Action.coexist({ province: 'a', challenger: Nation.AH, incumbent: Nation.IT }),
              Action.undo({ player: 'player1' }),
            ]),
          );

          game.tick(Action.fight({
            province: 'a', challenger: Nation.AH, incumbent: Nation.IT, targetType: 'fleet',
          }));

          expect(game.availableActions).toEqual(
            new Set([
              Action.endManeuver(),
              Action.maneuver({ origin: 'd', destination: 'c' }),
              Action.maneuver({ origin: 'd', destination: 'f' }),
              Action.maneuver({ origin: 'd', destination: 'e' }),
              Action.maneuver({ origin: 'd', destination: 'a' }),
              Action.undo({ player: 'player1' }),
            ]),
          );

          game.tick(Action.maneuver({ origin: 'd', destination: 'a' }));

          expect(game.availableActions).toEqual(
            new Set([
              Action.endManeuver(),
              Action.maneuver({ origin: 'd', destination: 'c' }),
              Action.maneuver({ origin: 'd', destination: 'f' }),
              Action.maneuver({ origin: 'd', destination: 'e' }),
              Action.maneuver({ origin: 'd', destination: 'g' }),
              Action.undo({ player: 'player1' }),
            ]),
          );
        });
      });

      describe('destroying a factory', () => {
        test('3 armies may destroy a foreign factory', () => {
          const game = newGame();
          game.provinces.get('f').factory = 'armaments';
          game.provinces.get('h').factory = 'armaments';
          game.units.get(Nation.AH).get('f').armies += 1;
          game.units.get(Nation.AH).get('f').armies += 1;
          game.units.get(Nation.AH).get('c').armies += 1;
          const availableActions = new Set([
            Action.destroyFactory({ province: 'f' }),
            Action.skipDestroyFactory({ province: 'f' }),
            Action.undo({ player: 'player1' }),
          ]);

          game.tick(
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          );
          game.tick(Action.maneuver({ origin: 'c', destination: 'f' }));
          game.tick(
            Action.unfriendlyEntrance({
              challenger: Nation.AH,
              incumbent: Nation.IT,
              province: 'f',
            }),
          );

          expect(game.availableActions).toEqual(availableActions);
        });

        test('3 armies may choose not to destroy a foreign factory', () => {
          const game = newGame();
          game.provinces.get('f').factory = 'armaments';
          game.provinces.get('h').factory = 'armaments';
          game.units.get(Nation.AH).get('f').armies += 1;
          game.units.get(Nation.AH).get('f').armies += 1;
          game.units.get(Nation.AH).get('c').armies += 1;
          game.units.get(Nation.AH).get('c').armies += 1;
          const availableActions = new Set([
            Action.maneuver({ origin: 'c', destination: 'd' }),
            Action.maneuver({ origin: 'c', destination: 'e' }),
            Action.maneuver({ origin: 'c', destination: 'f' }),
            Action.maneuver({ origin: 'f', destination: 'c' }),
            Action.maneuver({ origin: 'f', destination: 'd' }),
            Action.endManeuver(),
            Action.undo({ player: 'player1' }),
          ]);

          game.tick(
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          );
          game.tick(Action.maneuver({ origin: 'c', destination: 'f' }));
          game.tick(
            Action.unfriendlyEntrance({
              challenger: Nation.AH,
              incumbent: Nation.IT,
              province: 'f',
            }),
          );
          game.tick(Action.skipDestroyFactory({ province: 'f' }));

          expect(game.availableActions).toEqual(availableActions);
        });

        test('an army cannot unfriendly enter a province with the last factory', () => {
          const game = newGame();
          game.provinces.get('f').factory = 'armaments';
          game.units.get(Nation.AH).get('c').armies += 1;

          game.tick(
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          );
          game.tick(Action.maneuver({ origin: 'c', destination: 'f' }));

          expect(game.log[game.log.length - 1]).toEqual(
            Action.friendlyEntrance({
              challenger: Nation.AH,
              incumbent: Nation.IT,
              province: 'f',
            }),
          );
          for (const action of game.availableActions) {
            expect(action).not.toEqual(
              Action.unfriendlyEntrance({
                challenger: Nation.AH,
                incumbent: Nation.IT,
                province: 'f',
              }),
            );
          }
        });

        test('an army cannot unfriendly enter a provice with only one unoccupied factory', () => {
          const game = newGame();
          game.provinces.get('f').factory = 'armaments';
          game.provinces.get('h').factory = 'armaments';
          game.units.get(Nation.AH).get('h').armies += 1;
          game.units.get(Nation.AH).get('h').friendly = false;
          game.units.get(Nation.AH).get('c').armies += 1;

          game.tick(
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          );
          game.tick(Action.maneuver({ origin: 'c', destination: 'f' }));

          expect(game.log[game.log.length - 1]).toEqual(
            Action.friendlyEntrance({
              challenger: Nation.AH,
              incumbent: Nation.IT,
              province: 'f',
            }),
          );
          for (const action of game.availableActions) {
            expect(action).not.toEqual(
              Action.unfriendlyEntrance({
                challenger: Nation.AH,
                incumbent: Nation.IT,
                province: 'f',
              }),
            );
          }
        });
      });

      describe('updating the province flag', () => {
        test('maneuver army to neutral province adds a flag to the province', () => {
          const game = newGame();
          game.units.get(Nation.AH).get('c').armies += 1;

          game.tick(
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          );
          game.tick(Action.maneuver({ origin: 'c', destination: 'e' }));

          expect(game.provinces.get('e').flag).toEqual(Nation.AH);
        });

        test("maneuver army to other nation's province does not add a flag", () => {
          const game = newGame();
          game.units.get(Nation.AH).get('c').armies += 1;

          game.tick(
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          );
          game.tick(Action.maneuver({ origin: 'c', destination: 'f' }));

          expect(game.provinces.get('f').flag).toEqual(undefined);
        });

        test('maneuver away from coexisting province switches flag to other nation at the end of the turn', () => {
          const game = newGame();
          game.units.get(Nation.AH).get('f').armies += 1;
          // This army on g is only there so that AH's turn doesn't
          // automatically end after its one maneuver
          game.units.get(Nation.AH).get('g').armies += 1;
          game.units.get(Nation.IT).get('f').armies += 1;
          game.provinces.get('f').flag = Nation.AH;

          game.tick(
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          );
          game.tick(Action.maneuver({ origin: 'f', destination: 'd' }));

          // The turn isn't over yet so the flag should still be Austrian
          expect(game.provinces.get('f').flag).toEqual(Nation.AH);

          game.tick(Action.endManeuver());

          // The turn is over now and the flag should switch to Italy
          expect(game.provinces.get('f').flag).toEqual(Nation.IT);
        });

        test('without endManeuver(), maneuver away from coexisting province switches flag '
          + 'to other nation at the end of the turn', () => {
          const game = newGame();
          game.units.get(Nation.AH).get('f').armies += 1;
          game.units.get(Nation.AH).get('c').armies += 1;
          game.units.get(Nation.IT).get('f').armies += 1;
          game.provinces.get('f').flag = Nation.AH;

          game.tick(
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          );
          game.tick(Action.maneuver({ origin: 'f', destination: 'd' }));
          game.tick(Action.maneuver({ origin: 'c', destination: 'd' }));

          // The turn is over now and the flag should switch to Italy
          expect(game.provinces.get('f').flag).toEqual(Nation.IT);
        });

        test('maneuver away from coexisting province keeps flag on original nation, if province is still contested', () => {
          const game = newGame();
          game.units.get(Nation.AH).get('f').armies += 1;
          game.units.get(Nation.IT).get('f').armies += 1;
          game.units.get(Nation.FR).get('f').armies += 1;
          game.provinces.get('f').flag = Nation.AH;

          game.tick(
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          );
          game.tick(Action.maneuver({ origin: 'f', destination: 'c' }));

          expect(game.provinces.get('f').flag).toEqual(Nation.AH);
        });
      });
    });

    describe('fight', () => {
      const newGame = () => {
        const board = new GameBoard({
          nodes: [
            { name: 'a', nation: null },
            { name: 'b', nation: null, isOcean: true },
            { name: 'c', nation: null },
          ],
          edges: [
            ['a', 'b'],
            ['a', 'c'],
          ],
        });

        const game = new Imperial(board);
        initialize(game);
        // Allow Italy to be able to afford a factory
        game.nations.get(Nation.IT).treasury = 5;
        return game;
      };

      describe('nations have the same number of units', () => {
        test('flag remains for the incumbent', () => {
          const game = newGame();
          game.provinces.get('a').flag = Nation.AH;
          game.units.get(Nation.AH).get('a').armies += 1;
          game.units.get(Nation.IT).get('a').armies += 1;

          game.tick(
            Action.rondel({
              nation: Nation.AH,
              cost: 0,
              slot: 'maneuver1',
            }),
          );
          game.tick(
            Action.fight({
              province: 'a',
              incumbent: Nation.IT,
              challenger: Nation.AH,
              targetType: 'army',
            }),
          );

          expect(game.provinces.get('a').flag).toEqual(Nation.AH);
        });

        test('flag transfers to a third party if present', () => {
          const game = newGame();
          game.provinces.get('a').flag = Nation.AH;
          game.units.get(Nation.AH).get('b').armies += 1;
          game.units.get(Nation.IT).get('a').armies += 1;
          game.units.get(Nation.FR).get('a').armies += 1;
          game.provinces.get('a').flag = Nation.IT;

          game.tick(
            Action.rondel({
              nation: Nation.AH,
              cost: 0,
              slot: 'maneuver1',
            }),
          );
          game.tick(Action.maneuver({ origin: 'b', destination: 'a' }));
          game.tick(
            Action.fight({
              province: 'a',
              incumbent: Nation.IT,
              challenger: Nation.AH,
              targetType: 'army',
            }),
          );

          expect(game.provinces.get('a').flag).toEqual(Nation.FR);
        });

        test('nobody has flag if multiple third parties contest it', () => {
          const game = newGame();
          game.provinces.get('a').flag = Nation.AH;
          game.units.get(Nation.AH).get('b').armies += 1;
          game.units.get(Nation.IT).get('a').armies += 1;
          game.units.get(Nation.FR).get('a').armies += 1;
          game.units.get(Nation.GE).get('a').armies += 1;
          game.provinces.get('a').flag = Nation.IT;

          game.tick(
            Action.rondel({
              nation: Nation.AH,
              cost: 0,
              slot: 'maneuver1',
            }),
          );
          game.tick(Action.maneuver({ origin: 'b', destination: 'a' }));
          game.tick(
            Action.fight({
              province: 'a',
              incumbent: Nation.IT,
              challenger: Nation.AH,
              targetType: 'army',
            }),
          );

          expect(game.provinces.get('a').flag).toEqual(null);
        });

        test('both nations lose an army', () => {
          const game = newGame();
          game.units.get(Nation.AH).get('c').armies += 1;
          game.units.get(Nation.IT).get('a').armies += 1;

          game.tick(
            Action.rondel({ nation: Nation.AH, cost: 0, slot: 'maneuver1' }),
          );
          game.tick(Action.maneuver({ origin: 'c', destination: 'a' }));
          game.tick(
            Action.fight({
              province: 'a',
              incumbent: Nation.IT,
              challenger: Nation.AH,
              targetType: 'army',
            }),
          );

          expect(game.units.get(Nation.AH).get('a')).toEqual({
            armies: 0,
            fleets: 0,
            friendly: false,
          });
          expect(game.units.get(Nation.IT).get('a')).toEqual({
            armies: 0,
            fleets: 0,
            friendly: false,
          });
        });

        test('both nations lose a fleet', () => {
          const game = newGame();
          game.units.get(Nation.AH).get('a').fleets += 1;
          game.units.get(Nation.IT).get('b').fleets += 1;

          game.tick(
            Action.rondel({ nation: Nation.AH, cost: 0, slot: 'maneuver1' }),
          );
          game.tick(Action.maneuver({ origin: 'a', destination: 'b' }));
          game.tick(
            Action.fight({
              province: 'b',
              incumbent: Nation.IT,
              challenger: Nation.AH,
              targetType: 'fleet',
            }),
          );

          expect(game.units.get(Nation.AH).get('b')).toEqual({
            armies: 0,
            fleets: 0,
            friendly: false,
          });
          expect(game.units.get(Nation.IT).get('b')).toEqual({
            armies: 0,
            fleets: 0,
            friendly: false,
          });
        });
      });

      describe('one nation has more armies than another', () => {
        test('flag changes to the challenger', () => {
          const game = newGame();
          game.units.get(Nation.AH).get('b').armies += 1;
          game.units.get(Nation.IT).get('a').armies += 1;
          game.units.get(Nation.IT).get('a').armies += 1;
          game.provinces.get('a').flag = Nation.IT;

          game.tick(
            Action.rondel({ nation: Nation.AH, cost: 0, slot: 'maneuver1' }),
          );
          game.tick(Action.maneuver({ origin: 'b', destination: 'a' }));
          game.tick(
            Action.fight({
              province: 'a',
              incumbent: Nation.IT,
              challenger: Nation.AH,
              targetType: 'army',
            }),
          );

          expect(game.provinces.get('a').flag).toEqual(Nation.IT);
        });

        test('both nations lose one army but another remains', () => {
          const game = newGame();
          game.units.get(Nation.IT).get('a').armies += 1;
          game.units.get(Nation.IT).get('a').armies += 1;
          game.units.get(Nation.AH).get('b').armies += 1;

          game.tick(
            Action.rondel({ nation: Nation.AH, cost: 0, slot: 'maneuver1' }),
          );
          game.tick(Action.maneuver({ origin: 'b', destination: 'a' }));
          game.tick(
            Action.fight({
              province: 'a',
              incumbent: Nation.IT,
              challenger: Nation.AH,
              targetType: 'army',
            }),
          );

          expect(game.units.get(Nation.IT).get('a')).toEqual({
            armies: 1,
            fleets: 0,
            friendly: false,
          });
          expect(game.units.get(Nation.AH).get('a')).toEqual({
            armies: 0,
            fleets: 0,
            friendly: false,
          });
        });
      });

      describe('a coastal province with a mixture of armies and fleets', () => {
        test('challenger chose to attack the fleet', () => {
          const game = newGame();
          game.units.get(Nation.IT).get('a').armies += 1;
          game.units.get(Nation.IT).get('a').fleets += 1;
          game.units.get(Nation.AH).get('b').armies += 1;

          game.tick(
            Action.rondel({ nation: Nation.AH, cost: 0, slot: 'maneuver1' }),
          );
          game.tick(Action.maneuver({ origin: 'b', destination: 'a' }));
          game.tick(
            Action.fight({
              province: 'a',
              incumbent: Nation.IT,
              challenger: Nation.AH,
              targetType: 'fleet',
            }),
          );

          expect(game.units.get(Nation.IT).get('a')).toEqual({
            armies: 1,
            fleets: 0,
            friendly: false,
          });
          expect(game.units.get(Nation.AH).get('b')).toEqual({
            armies: 0,
            fleets: 0,
            friendly: false,
          });
          expect(game.units.get(Nation.AH).get('a')).toEqual({
            armies: 0,
            fleets: 0,
            friendly: false,
          });
        });

        test('challenger chose to attack the army', () => {
          const game = newGame();
          game.units.get(Nation.IT).get('a').armies += 1;
          game.units.get(Nation.IT).get('a').fleets += 1;
          game.units.get(Nation.AH).get('b').armies += 1;

          game.tick(
            Action.rondel({ nation: Nation.AH, cost: 0, slot: 'maneuver1' }),
          );
          game.tick(Action.maneuver({ origin: 'b', destination: 'a' }));
          game.tick(
            Action.fight({
              province: 'a',
              incumbent: Nation.IT,
              challenger: Nation.AH,
              targetType: 'army',
            }),
          );

          expect(game.units.get(Nation.IT).get('a')).toEqual({
            armies: 0,
            fleets: 1,
            friendly: false,
          });
          expect(game.units.get(Nation.AH).get('b')).toEqual({
            armies: 0,
            fleets: 0,
            friendly: false,
          });
          expect(game.units.get(Nation.AH).get('a')).toEqual({
            armies: 0,
            fleets: 0,
            friendly: false,
          });
        });
      });

      describe('after fight is adjudicated', () => {
        test('availalableActions are updated if challenger has no more units to move', () => {
          const game = newGame();
          game.units.get(Nation.AH).get('b').armies += 1;
          game.units.get(Nation.IT).get('a').armies += 1;
          const expected = new Set(
            [
              'factory',
              'production1',
              'maneuver1',
              'investor',
              'import',
              'production2',
              'maneuver2',
              'taxation',
            ].map((slot) => Action.rondel({ nation: Nation.IT, cost: 0, slot })),
          );
          expected.add(Action.undo({ player: 'player1' }));

          game.tick(
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          );
          game.tick(Action.maneuver({ origin: 'b', destination: 'a' }));
          game.tick(
            Action.fight({
              province: 'a',
              incumbent: Nation.IT,
              challenger: Nation.AH,
              targetType: 'army',
            }),
          );

          expect(game.availableActions).toEqual(expected);
        });

        test('challenger can maneuver if challenger has more units to move', () => {
          const game = newGame();
          game.units.get(Nation.AH).get('b').armies += 1;
          game.units.get(Nation.AH).get('b').armies += 1;
          game.units.get(Nation.IT).get('a').armies += 1;

          game.tick(
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          );
          game.tick(Action.maneuver({ origin: 'b', destination: 'a' }));
          game.tick(
            Action.fight({
              province: 'a',
              incumbent: Nation.IT,
              challenger: Nation.AH,
              targetType: 'army',
            }),
          );

          expect(game.availableActions).toEqual(
            new Set([
              Action.maneuver({ origin: 'b', destination: 'a' }),
              Action.endManeuver(),
              Action.undo({ player: 'player1' }),
            ]),
          );
        });

        test('challenger can maneuver after a fight, if the fight used to be a coexist', () => {
          const game = newGame();
          game.units.get(Nation.AH).get('a').armies += 1;
          game.units.get(Nation.AH).get('c').armies += 1;
          game.units.get(Nation.IT).get('c').armies += 1;

          game.tick(
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          );
          game.tick(
            Action.fight({
              province: 'c',
              incumbent: Nation.IT,
              challenger: Nation.AH,
              targetType: 'army',
            }),
          );

          expect(game.currentPlayerName).toEqual('player1');
          expect(game.availableActions).toEqual(
            new Set([
              Action.maneuver({ origin: 'a', destination: 'c' }),
              Action.endManeuver(),
              Action.undo({ player: 'player1' }),
            ]),
          );
        });
      });
    });

    describe('coexist', () => {
      const newGame = () => {
        const board = new GameBoard({
          nodes: [
            { name: 'a', nation: null },
            { name: 'b', nation: null },
          ],
          edges: [['a', 'b']],
        });

        const game = new Imperial(board);
        initialize(game);
        // Allow Italy to be able to afford a factory
        game.nations.get(Nation.IT).treasury = 5;
        return game;
      };

      test('other nation can choose to fight', () => {
        const game = newGame();
        game.units.get(Nation.AH).get('a').armies += 1;
        game.units.get(Nation.AH).get('a').armies += 1;
        game.units.get(Nation.IT).get('b').armies += 1;
        game.units.get(Nation.IT).get('b').armies += 1;
        game.availableActions = new Set([
          Action.rondel({
            slot: 'maneuver1',
            cost: 0,
            nation: Nation.IT,
          }),
        ]);

        game.tick(
          Action.rondel({
            slot: 'maneuver1',
            cost: 0,
            nation: Nation.IT,
          }),
        );
        game.tick(
          Action.maneuver({
            destination: 'a',
            origin: 'b',
          }),
        );
        game.tick(
          Action.coexist({
            province: 'a',
            incumbent: Nation.AH,
            challenger: Nation.IT,
          }),
        );

        expect(game.availableActions).toEqual(
          new Set([
            Action.fight({
              province: 'a',
              incumbent: Nation.IT,
              challenger: Nation.AH,
              targetType: 'army',
            }),
            Action.coexist({
              province: 'a',
              incumbent: Nation.IT,
              challenger: Nation.AH,
            }),
          ]),
        );
        expect(game.currentPlayerName).toEqual('player1');

        game.tick(
          Action.fight({
            province: 'a',
            incumbent: Nation.IT,
            challenger: Nation.AH,
            targetType: 'army',
          }),
        );
        expect(game.currentPlayerName).toEqual('player2');
      });

      test('multiple other nations can choose to fight', () => {
        const game = newGame();
        game.units.get(Nation.AH).get('a').armies += 1;
        game.units.get(Nation.IT).get('a').armies += 1;
        game.units.get(Nation.FR).get('a').armies += 1;
        game.availableActions = new Set([
          Action.coexist({
            province: 'a',
            incumbent: Nation.AH,
            challenger: Nation.IT,
          }),
        ]);

        game.tick(
          Action.coexist({
            province: 'a',
            incumbent: Nation.AH,
            challenger: Nation.IT,
          }),
        );

        expect(game.currentPlayerName).toEqual(
          game.nations.get(Nation.AH).controller,
        );
        expect(game.availableActions).toEqual(
          new Set([
            Action.fight({
              province: 'a',
              incumbent: Nation.IT,
              challenger: Nation.AH,
              targetType: 'army',
            }),
            Action.coexist({
              province: 'a',
              incumbent: Nation.IT,
              challenger: Nation.AH,
            }),
          ]),
        );
      });

      test('both units remain', () => {
        const game = newGame();
        game.units.get(Nation.AH).get('a').armies += 1;
        game.units.get(Nation.IT).get('a').armies += 1;
        game.availableActions = new Set([
          Action.coexist({
            province: 'a',
            incumbent: Nation.AH,
            challenger: Nation.IT,
          }),
        ]);

        game.tick(
          Action.coexist({
            province: 'a',
            incumbent: Nation.AH,
            challenger: Nation.IT,
          }),
        );

        expect(game.units.get(Nation.AH).get('a')).toEqual({
          armies: 1,
          fleets: 0,
          friendly: false,
        });
        expect(game.units.get(Nation.IT).get('a')).toEqual({
          armies: 1,
          fleets: 0,
          friendly: false,
        });
      });

      test("incumbent's flag remains, even if they are outnumbered", () => {
        const game = newGame();
        game.provinces.get('a').flag = Nation.AH;
        game.units.get(Nation.AH).get('a').armies += 1;
        game.units.get(Nation.IT).get('a').armies += 1;
        game.units.get(Nation.IT).get('a').armies += 1;
        game.availableActions = new Set([
          Action.coexist({
            province: 'a',
            incumbent: Nation.AH,
            challenger: Nation.IT,
          }),
        ]);

        game.tick(
          Action.coexist({
            province: 'a',
            incumbent: Nation.AH,
            challenger: Nation.IT,
          }),
        );

        expect(game.provinces.get('a').flag).toEqual(Nation.AH);
      });

      describe('after coexistence is adjudicated', () => {
        test('availableActions are updated if challenger has no more units to move', () => {
          const game = newGame();
          game.units.get(Nation.AH).get('b').armies += 1;
          game.units.get(Nation.IT).get('a').armies += 1;
          game.availableActions = new Set([
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          ]);
          const expected = new Set(
            [
              'factory',
              'production1',
              'maneuver1',
              'investor',
              'import',
              'production2',
              'maneuver2',
              'taxation',
            ].map((slot) => Action.rondel({ nation: Nation.IT, cost: 0, slot })),
          );
          expected.add(Action.undo({ player: 'player2' }));

          game.tick(
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          );
          game.tick(Action.maneuver({ origin: 'b', destination: 'a' }));
          game.tick(
            Action.coexist({
              province: 'a',
              incumbent: Nation.IT,
              challenger: Nation.AH,
            }),
          );
          game.tick(
            Action.coexist({
              province: 'a',
              incumbent: Nation.AH,
              challenger: Nation.IT,
            }),
          );

          expect(game.availableActions).toEqual(expected);
          expect(game.currentPlayerName).toEqual('player2');
        });

        test('challenger can maneuver if challenger has more units to move', () => {
          const game = newGame();
          game.units.get(Nation.AH).get('b').armies += 1;
          game.units.get(Nation.AH).get('b').armies += 1;
          game.units.get(Nation.IT).get('a').armies += 1;
          game.availableActions = new Set([
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          ]);

          game.tick(
            Action.rondel({ slot: 'maneuver1', nation: Nation.AH, cost: 0 }),
          );
          game.tick(Action.maneuver({ origin: 'b', destination: 'a' }));
          game.tick(
            Action.coexist({
              province: 'a',
              incumbent: Nation.IT,
              challenger: Nation.AH,
            }),
          );
          game.tick(
            Action.coexist({
              province: 'a',
              incumbent: Nation.AH,
              challenger: Nation.IT,
            }),
          );

          expect(game.availableActions).toEqual(
            new Set([
              Action.endManeuver(),
              Action.maneuver({ origin: 'b', destination: 'a' }),
              Action.undo({ player: 'player2' }),
            ]),
          );
        });
      });
    });

    describe('currentPlayerName on new turn', () => {
      const newGame = () => {
        const board = new GameBoard({
          nodes: [
            { name: 'a', nation: Nation.AH },
            { name: 'b', nation: Nation.AH },
          ],
          edges: [],
        });

        const game = new Imperial(board);
        initialize(game);
        return game;
      };

      test('when nobody controls a nation, that nation skips their turn', () => {
        const game = newGame();
        // Remove player2 from controlling Italy
        game.nations.get(Nation.IT).controller = null;

        // End maneuver just because it is simple; the action is unimportant
        game.tick(
          Action.rondel({ nation: Nation.AH, cost: 0, slot: 'production1' }),
        );

        expect(game.currentNation).toEqual(Nation.FR);
        expect(game.currentPlayerName).toEqual('player1');
      });
    });

    describe('undo', () => {
      const newGame = () => {
        const board = new GameBoard({
          nodes: [
            { name: 'a', nation: Nation.AH },
            { name: 'b', nation: Nation.IT },
            { name: 'c', nation: Nation.FR },
          ],
          edges: [['a', 'b']],
        });

        const game = new Imperial(board);
        initialize(game);
        return game;
      };

      test('player can undo their last move', () => {
        const game = newGame();

        game.tick(
          Action.rondel({ nation: Nation.AH, cost: 0, slot: 'production1' }),
        );
        game.tick(Action.undo({ player: 'player1' }));

        expect(game.currentNation).toEqual(Nation.AH);
        expect(game.currentPlayerName).toEqual('player1');
      });

      test('multiple undos work', () => {
        const game = newGame();

        game.tick(
          Action.rondel({ nation: Nation.AH, cost: 0, slot: 'production1' }),
        );
        game.tick(Action.undo({ player: 'player1' }));
        game.tick(
          Action.rondel({ nation: Nation.AH, cost: 0, slot: 'production1' }),
        );
        game.tick(
          Action.rondel({ nation: Nation.IT, cost: 0, slot: 'production1' }),
        );
        game.tick(
          Action.rondel({ nation: Nation.FR, cost: 0, slot: 'production1' }),
        );
        game.tick(Action.undo({ player: 'player1' }));

        expect(game.currentNation).toEqual(Nation.FR);
        expect(game.currentPlayerName).toEqual('player1');
      });

      test('undo after maneuver works', () => {
        const game = newGame();
        game.units.get(Nation.AH).get('a').armies = 1;

        game.tick(
          Action.rondel({ nation: Nation.AH, cost: 0, slot: 'maneuver1' }),
        );
        game.tick(
          Action.maneuver({ origin: 'a', destination: 'b' }),
        );
        game.tick(Action.undo({ player: 'player1' }));
        game.tick(
          Action.rondel({ nation: Nation.AH, cost: 0, slot: 'production1' }),
        );
        game.tick(Action.undo({ player: 'player1' }));

        expect(game.currentNation).toEqual(Nation.AH);
        expect(game.currentPlayerName).toEqual('player1');
      });

      test('undo after an automated action', () => {
        const game = newGame();
        game.availableBonds = new Set([Bond(Nation.IT, 1)]);
        game.swissBanks = ['player1'];

        game.tick(
          Action.rondel({ nation: Nation.AH, cost: 0, slot: 'investor' }),
        );
        game.tick(
          Action.bondPurchase({
            player: 'player2',
            cost: 2,
            nation: Nation.IT,
            tradeInValue: 0,
          }),
        );
        game.tick(Action.undo({ player: 'player2' }));

        expect(game.availableActions).toEqual(
          new Set([
            Action.bondPurchase({
              player: 'player2',
              cost: 2,
              nation: Nation.IT,
              tradeInValue: 0,
            }),
            Action.skipBondPurchase({ player: 'player2', nation: null }),
            Action.undo({ player: 'player1' }),
          ]),
        );
      });
    });

    describe('invalid moves', () => {
      const newGame = () => {
        const board = new GameBoard({
          nodes: [
            { name: 'a', nation: null },
            { name: 'b', nation: null },
            { name: 'c', nation: null },
          ],
          edges: [['a', 'c']],
        });

        const logger = new Logger('silent');
        const game = new Imperial(board, logger);
        initialize(game);
        return game;
      };

      test('when impossible maneuver is attempted, maneuver is rejected', () => {
        const game = newGame();
        game.units.get(Nation.AH).get('a').armies = 1;

        game.tick(
          Action.rondel({ nation: Nation.AH, cost: 0, slot: 'maneuver1' }),
        );
        game.tick(Action.maneuver({ origin: 'a', destination: 'b' }));

        expect(game.log).toEqual([
          Action.initialize({
            players: [
              { id: 'player1', nation: Nation.AH },
              { id: 'player2', nation: Nation.IT },
            ],
            soloMode: false,
            variant: 'standard',
            baseGame: 'imperial',
          }),
          Action.rondel({ nation: Nation.AH, cost: 0, slot: 'maneuver1' }),
        ]);
      });
    });
  });

  describe('#toJSONWithLatestAction', () => {
    const newGame = () => {
      const board = new GameBoard({
        nodes: [
          { name: 'a', nation: Nation.AH },
          { name: 'b', nation: Nation.AH },
        ],
        edges: [],
      });

      const gameCoordinator = new Imperial(board);
      initialize(gameCoordinator);
      return gameCoordinator;
    };

    test('returns complete game state in JSON', () => {
      const gameCoordinator = newGame();
      const expectedNations = [
        {
          AH: {
            controller: 'player1',
            flagCount: 0,
            powerPoints: 0,
            rondelPosition: 'production1',
            taxChartPosition: 5,
            treasury: 11,
          },
        }, {
          IT: {
            controller: 'player2',
            flagCount: 0,
            powerPoints: 0,
            rondelPosition: null,
            taxChartPosition: 5,
            treasury: 11,
          },
        }, {
          FR: {
            controller: 'player1',
            flagCount: 0,
            powerPoints: 0,
            rondelPosition: null,
            taxChartPosition: 5,
            treasury: 11,
          },
        }, {
          GB: {
            controller: 'player2',
            flagCount: 0,
            powerPoints: 0,
            rondelPosition: null,
            taxChartPosition: 5,
            treasury: 11,
          },
        }, {
          GE: {
            controller: 'player1',
            flagCount: 0,
            powerPoints: 0,
            rondelPosition: null,
            taxChartPosition: 5,
            treasury: 11,
          },
        }, {
          RU: {
            controller: 'player2',
            flagCount: 0,
            powerPoints: 0,
            rondelPosition: null,
            taxChartPosition: 5,
            treasury: 11,
          },
        },
      ];
      const expectedPlayers = {
        player1: {
          bonds: [
            {
              cost: 9,
              nation: 'AH',
              number: 4,
            },
            {
              cost: 2,
              nation: 'GE',
              number: 1,
            },
            {
              cost: 9,
              nation: 'FR',
              number: 4,
            },
            {
              cost: 2,
              nation: 'AH',
              number: 1,
            },
            {
              cost: 9,
              nation: 'GE',
              number: 4,
            },
            {
              cost: 2,
              nation: 'IT',
              number: 1,
            },
          ],
          cash: 2,
          score: 0,
          uuid: '',
        },
        player2: {
          bonds: [
            {
              cost: 9,
              nation: 'IT',
              number: 4,
            },
            {
              cost: 2,
              nation: 'GB',
              number: 1,
            },
            {
              cost: 9,
              nation: 'RU',
              number: 4,
            },
            {
              cost: 2,
              nation: 'FR',
              number: 1,
            },
            {
              cost: 9,
              nation: 'GB',
              number: 4,
            },
            {
              cost: 2,
              nation: 'RU',
              number: 1,
            },
          ],
          cash: 2,
          score: 0,
          uuid: '',
        },
      };
      const expectedProvinces = {
        a: { factory: null },
        b: { factory: null },
      };
      const expectedUnits = {
        AH: {
          a: { armies: 0, fleets: 0, friendly: true },
          b: { armies: 0, fleets: 0, friendly: true },
        },
        FR: {
          a: { armies: 0, fleets: 0, friendly: false },
          b: { armies: 0, fleets: 0, friendly: false },
        },
        GB: {
          a: { armies: 0, fleets: 0, friendly: false },
          b: { armies: 0, fleets: 0, friendly: false },
        },
        GE: {
          a: { armies: 0, fleets: 0, friendly: false },
          b: { armies: 0, fleets: 0, friendly: false },
        },
        IT: {
          a: { armies: 0, fleets: 0, friendly: false },
          b: { armies: 0, fleets: 0, friendly: false },
        },
        RU: {
          a: { armies: 0, fleets: 0, friendly: false },
          b: { armies: 0, fleets: 0, friendly: false },
        },
      };

      const json = gameCoordinator.toJSONWithLatestAction(Action.rondel({ nation: Nation.AH, slot: 'production1', cost: 0 }));

      expect(json).toEqual({
        baseGame: 'imperial',
        currentNation: 'IT',
        nations: expectedNations,
        players: expectedPlayers,
        provinces: expectedProvinces,
        units: expectedUnits,
        variant: 'standard',
        winner: '',
      });
    });
  });

  describe('.loadFromJSON', () => {
    test('returns game with correct state', () => {
      const nations = [
        {
          AH: {
            controller: 'player1',
            flagCount: 0,
            powerPoints: 0,
            rondelPosition: null,
            taxChartPosition: 5,
            treasury: 11,
          },
        }, {
          IT: {
            controller: 'player2',
            flagCount: 0,
            powerPoints: 0,
            rondelPosition: null,
            taxChartPosition: 5,
            treasury: 11,
          },
        }, {
          FR: {
            controller: 'player1',
            flagCount: 0,
            powerPoints: 0,
            rondelPosition: null,
            taxChartPosition: 5,
            treasury: 11,
          },
        }, {
          GB: {
            controller: 'player2',
            flagCount: 0,
            powerPoints: 0,
            rondelPosition: null,
            taxChartPosition: 5,
            treasury: 11,
          },
        }, {
          GE: {
            controller: 'player1',
            flagCount: 0,
            powerPoints: 0,
            rondelPosition: null,
            taxChartPosition: 5,
            treasury: 11,
          },
        }, {
          RU: {
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
              nation: 'AH',
              number: 4,
            },
            {
              cost: 2,
              nation: 'GE',
              number: 1,
            },
            {
              cost: 9,
              nation: 'FR',
              number: 4,
            },
            {
              cost: 2,
              nation: 'AH',
              number: 1,
            },
            {
              cost: 9,
              nation: 'GE',
              number: 4,
            },
            {
              cost: 2,
              nation: 'IT',
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
              nation: 'IT',
              number: 4,
            },
            {
              cost: 2,
              nation: 'GB',
              number: 1,
            },
            {
              cost: 9,
              nation: 'RU',
              number: 4,
            },
            {
              cost: 2,
              nation: 'FR',
              number: 1,
            },
            {
              cost: 9,
              nation: 'GB',
              number: 4,
            },
            {
              cost: 2,
              nation: 'RU',
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
        AH: {
          a: { armies: 0, fleets: 0, friendly: false },
          b: { armies: 0, fleets: 0, friendly: false },
        },
        FR: {
          a: { armies: 0, fleets: 0, friendly: false },
          b: { armies: 0, fleets: 0, friendly: false },
        },
        GB: {
          a: { armies: 0, fleets: 0, friendly: false },
          b: { armies: 0, fleets: 0, friendly: false },
        },
        GE: {
          a: { armies: 0, fleets: 0, friendly: false },
          b: { armies: 0, fleets: 0, friendly: false },
        },
        IT: {
          a: { armies: 0, fleets: 0, friendly: false },
          b: { armies: 0, fleets: 0, friendly: false },
        },
        RU: {
          a: { armies: 0, fleets: 0, friendly: false },
          b: { armies: 0, fleets: 0, friendly: false },
        },
      };
      const stateAsJSON = {
        baseGame: 'imperial',
        currentNation: 'AH',
        nations,
        players,
        provinces,
        units,
        variant: 'standard',
        winner: '',
      };

      const expectedNations = new Set();
      [
        [Nation.AH, 'player1'],
        [Nation.IT, 'player2'],
        [Nation.FR, 'player1'],
        [Nation.GB, 'player2'],
        [Nation.GE, 'player1'],
        [Nation.RU, 'player2'],
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
              nation: Nation.AH,
              number: 4,
            },
            {
              cost: 2,
              nation: Nation.GE,
              number: 1,
            },
            {
              cost: 9,
              nation: Nation.FR,
              number: 4,
            },
            {
              cost: 2,
              nation: Nation.AH,
              number: 1,
            },
            {
              cost: 9,
              nation: Nation.GE,
              number: 4,
            },
            {
              cost: 2,
              nation: Nation.IT,
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
              nation: Nation.IT,
              number: 4,
            },
            {
              cost: 2,
              nation: Nation.GB,
              number: 1,
            },
            {
              cost: 9,
              nation: Nation.RU,
              number: 4,
            },
            {
              cost: 2,
              nation: Nation.FR,
              number: 1,
            },
            {
              cost: 9,
              nation: Nation.GB,
              number: 4,
            },
            {
              cost: 2,
              nation: Nation.RU,
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
        expectedUnits.set(Nation[nation], expectedUnitsByProvince);
      }

      const game = Imperial.loadFromJSON(stateAsJSON);

      expect(game.baseGame).toEqual('imperial');
      expect(game.currentNation).toEqual(Nation.AH);
      expect(game.nations).toEqual(expectedNations);
      expect(game.players).toEqual(expectedPlayers);
      expect(game.provinces).toEqual(expectedProvinces);
      expect(game.units).toEqual(expectedUnits);
      expect(game.variant).toEqual('standard');
      expect(game.winner).toEqual('');
    });
  });
});

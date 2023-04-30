import Action from '../action';

import Imperial from '../ImperialGameCoordinator';
import Auction from '../auction';
import auctionSetup from '../auctionSetup';
import { Bond, Nation, Nation2030 } from '../constants';

import BoardEurope from '../board';

const ImperialFromLog = (log) => {
  const game = new Imperial(BoardEurope);

  game.tickFromLog(log);

  return game;
};

describe('auction', () => {
  describe('initialize', () => {
    test("it is player1's turn to buy an AH bond", () => {
      const auction = new Auction();
      const game = new Imperial();
      const expectedActions = new Set([
        Action.skipBondPurchase({ player: 'player1', nation: Nation.AH }),
      ]);
      [2, 4, 6, 9, 12, 16, 20, 25, 30].forEach((cost) => {
        expectedActions.add(
          Action.bondPurchase({
            nation: Nation.AH,
            cost,
            tradeInValue: 0,
            player: 'player1',
          }),
        );
      });

      auction.tick(
        Action.initialize({
          players: [
            { id: 'player1' },
            { id: 'player2' },
          ],
          soloMode: false,
          variant: 'auction',
          baseGame: 'imperial',
        }),
        game,
        auctionSetup,
      );

      expect(game.availableActions).toEqual(expectedActions);
    });
  });

  describe('bondPurchase', () => {
    const newGame = () => {
      const game = new Imperial();
      game.tick(
        Action.initialize({
          players: [
            { id: 'player1' },
            { id: 'player2' },
          ],
          soloMode: false,
          variant: 'auction',
          baseGame: 'imperial',
        }),
      );
      return game;
    };

    test('player purchases a bond', () => {
      const game = newGame();
      const { auction } = game;
      const expectedActions = new Set([
        Action.skipBondPurchase({ player: 'player2', nation: Nation.AH }),
        Action.undo({ player: 'player1' }),
      ]);
      [2, 6, 9, 12, 16, 20, 25, 30].forEach((cost) => {
        expectedActions.add(
          Action.bondPurchase({
            nation: Nation.AH,
            cost,
            tradeInValue: 0,
            player: 'player2',
          }),
        );
      });

      auction.tick(
        Action.bondPurchase({
          player: 'player1', cost: 4, nation: Nation.AH, tradeInValue: 0,
        }),
        game,
      );

      expect(game.players.player1.bonds).toEqual(
        new Set([Bond(Nation.AH, 2)]),
      );
      expect(game.availableActions).toEqual(expectedActions);
    });

    test('player skips purchasing a bond', () => {
      const game = newGame();
      const { auction } = game;
      const expectedActions = new Set([
        Action.skipBondPurchase({ player: 'player2', nation: Nation.AH }),
        Action.undo({ player: 'player1' }),
      ]);
      [2, 4, 6, 9, 12, 16, 20, 25, 30].forEach((cost) => {
        expectedActions.add(
          Action.bondPurchase({
            nation: Nation.AH,
            cost,
            tradeInValue: 0,
            player: 'player2',
          }),
        );
      });

      auction.tick(
        Action.skipBondPurchase({ player: 'player1', nation: Nation.AH }),
        game,
      );

      expect(game.players.player1.bonds).toEqual(new Set());
      expect(game.availableActions).toEqual(expectedActions);
    });

    test('all players have had an opportunity to buy an AH bond', () => {
      const game = newGame();
      const { auction } = game;
      const expectedActions = new Set([
        Action.skipBondPurchase({ player: 'player2', nation: Nation.IT }),
        Action.undo({ player: 'player2' }),
      ]);
      [2, 4, 6, 9, 12, 16, 20, 25, 30].forEach((cost) => {
        expectedActions.add(
          Action.bondPurchase({
            nation: Nation.IT,
            cost,
            tradeInValue: 0,
            player: 'player2',
          }),
        );
      });

      auction.tick(
        Action.bondPurchase({
          player: 'player1', cost: 4, nation: Nation.AH, tradeInValue: 0,
        }),
        game,
      );
      auction.tick(
        Action.bondPurchase({
          player: 'player2', cost: 2, nation: Nation.AH, tradeInValue: 0,
        }),
        game,
      );

      expect(game.players.player1.bonds).toEqual(
        new Set([Bond(Nation.AH, 2)]),
      );
      expect(game.players.player2.bonds).toEqual(
        new Set([Bond(Nation.AH, 1)]),
      );
      expect(game.availableActions).toEqual(expectedActions);
    });

    test('last player buys a final bond and swiss bank is assigned', () => {
      const log = [
        Action.initialize({
          players: [
            { id: 'player1' },
            { id: 'player2' },
          ],
          soloMode: false,
          variant: 'auction',
          baseGame: 'imperial',
        }),
        Action.bondPurchase({
          player: 'player1', cost: 4, nation: Nation.AH, tradeInValue: 0,
        }),
        Action.bondPurchase({
          player: 'player2', cost: 2, nation: Nation.AH, tradeInValue: 0,
        }),
        Action.bondPurchase({
          player: 'player2', cost: 2, nation: Nation.IT, tradeInValue: 0,
        }),
        Action.bondPurchase({
          player: 'player1', cost: 4, nation: Nation.IT, tradeInValue: 0,
        }),
        Action.bondPurchase({
          player: 'player1', cost: 4, nation: Nation.FR, tradeInValue: 0,
        }),
        Action.bondPurchase({
          player: 'player2', cost: 2, nation: Nation.FR, tradeInValue: 0,
        }),
        Action.bondPurchase({
          player: 'player2', cost: 2, nation: Nation.GB, tradeInValue: 0,
        }),
        Action.bondPurchase({
          player: 'player1', cost: 4, nation: Nation.GB, tradeInValue: 0,
        }),
        Action.bondPurchase({
          player: 'player1', cost: 4, nation: Nation.GE, tradeInValue: 0,
        }),
        Action.bondPurchase({
          player: 'player2', cost: 2, nation: Nation.GE, tradeInValue: 0,
        }),
        Action.bondPurchase({
          player: 'player2', cost: 2, nation: Nation.RU, tradeInValue: 0,
        }),
        Action.bondPurchase({
          player: 'player1', cost: 4, nation: Nation.RU, tradeInValue: 0,
        }),
      ];
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
        ].map((slot) => Action.rondel({ nation: Nation.AH, cost: 0, slot })),
      );
      expected.add(Action.undo({ player: 'player1' }));

      const game = ImperialFromLog(log);

      expect(game.availableActions).toEqual(expected);
      expect(game.swissBanks).toEqual(['player2']);
    });

    test('it auto-skips players who cannot afford any bond', () => {
      const expectedActions = new Set([
        Action.skipBondPurchase({ player: 'player2', nation: Nation.FR }),
        Action.undo({ player: 'player1' }),
      ]);
      [2, 4, 6, 9, 12, 16, 20, 25, 30].forEach((cost) => {
        expectedActions.add(
          Action.bondPurchase({
            nation: Nation.FR,
            cost,
            tradeInValue: 0,
            player: 'player2',
          }),
        );
      });
      const log = [
        Action.initialize({
          players: [
            { id: 'player1' },
            { id: 'player2' },
          ],
          soloMode: false,
          variant: 'auction',
          baseGame: 'imperial',
        }),
        Action.bondPurchase({
          player: 'player1', cost: 30, nation: Nation.AH, tradeInValue: 0,
        }),
        Action.bondPurchase({
          player: 'player2', cost: 2, nation: Nation.AH, tradeInValue: 0,
        }),
        Action.bondPurchase({
          player: 'player2', cost: 2, nation: Nation.IT, tradeInValue: 0,
        }),
        Action.bondPurchase({
          player: 'player1', cost: 9, nation: Nation.IT, tradeInValue: 0,
        }),
      ];

      const game = ImperialFromLog(log);

      expect(game.availableActions).toEqual(expectedActions);
    });

    test('auto-skip can handle more than 2 players with insufficient funds', () => {
      const expectedActions = new Set([
        Action.skipBondPurchase({ player: 'player3', nation: Nation.GB }),
        Action.undo({ player: 'player3' }),
      ]);
      [2, 4, 6, 9, 12, 16].forEach((cost) => {
        expectedActions.add(
          Action.bondPurchase({
            nation: Nation.GB,
            cost,
            tradeInValue: 0,
            player: 'player3',
          }),
        );
      });
      const log = [
        Action.initialize({
          players: [
            { id: 'player1' },
            { id: 'player2' },
            { id: 'player3' },
          ],
          soloMode: false,
          variant: 'auction',
          baseGame: 'imperial',
        }),
        Action.bondPurchase({
          player: 'player1', cost: 25, nation: Nation.AH, tradeInValue: 0,
        }),
        Action.bondPurchase({
          player: 'player2', cost: 2, nation: Nation.AH, tradeInValue: 0,
        }),
        Action.bondPurchase({
          player: 'player3', cost: 4, nation: Nation.AH, tradeInValue: 0,
        }),
        Action.bondPurchase({
          player: 'player2', cost: 25, nation: Nation.IT, tradeInValue: 0,
        }),
        Action.bondPurchase({
          player: 'player3', cost: 6, nation: Nation.IT, tradeInValue: 0,
        }),
        Action.bondPurchase({
          player: 'player1', cost: 2, nation: Nation.IT, tradeInValue: 0,
        }),
        Action.bondPurchase({
          player: 'player3', cost: 2, nation: Nation.FR, tradeInValue: 0,
        }),
      ];

      const game = ImperialFromLog(log);

      expect(game.availableActions).toEqual(expectedActions);
    });
  });

  describe('real game example', () => {
    const newGame = () => {
      const game = new Imperial();
      game.tick(
        Action.initialize({
          players: [
            { id: 'm' },
            { id: 't' },
            { id: 'j' },
            { id: 'w' },
          ],
          soloMode: false,
          variant: 'auction',
          baseGame: 'imperial2030',
        }),
      );
      return game;
    };

    test('whole auction', () => {
      const game = newGame();
      const expectedActions = new Set([
        Action.skipBondPurchase({ player: 'j', nation: Nation2030.BR }),
        Action.undo({ player: 't' }),
        Action.bondPurchase({
          player: 'j', cost: 2, nation: Nation2030.BR, tradeInValue: 0,
        }),
      ]);

      // Russia
      // m
      game.tick(
        Action.bondPurchase({
          player: 'm', cost: 6, nation: Nation2030.RU, tradeInValue: 0,
        }),
      );

      // t
      game.tick(
        Action.bondPurchase({
          player: 't', cost: 4, nation: Nation2030.RU, tradeInValue: 0,
        }),
      );
      game.tick(
        Action.undo({ player: 't' }),
      );
      game.tick(
        Action.bondPurchase({
          player: 't', cost: 4, nation: Nation2030.RU, tradeInValue: 0,
        }),
      );
      game.tick(
        Action.undo({ player: 't' }),
      );
      game.tick(
        Action.skipBondPurchase({ player: 't', nation: Nation2030.RU }),
      );
      game.tick(
        Action.undo({ player: 't' }),
      );
      game.tick(
        Action.bondPurchase({
          player: 't', cost: 4, nation: Nation2030.RU, tradeInValue: 0,
        }),
      );
      game.tick(
        Action.undo({ player: 't' }),
      );
      game.tick(
        Action.bondPurchase({
          player: 't', cost: 4, nation: Nation2030.RU, tradeInValue: 0,
        }),
      );

      // j
      game.tick(
        Action.skipBondPurchase({ player: 'j', nation: Nation2030.RU }),
      );

      // w
      game.tick(
        Action.skipBondPurchase({ player: 'w', nation: Nation2030.RU }),
      );

      // China
      // t
      game.tick(
        Action.skipBondPurchase({ player: 't', nation: Nation2030.CN }),
      );

      // j
      game.tick(
        Action.bondPurchase({
          player: 'j', cost: 6, nation: Nation2030.CN, tradeInValue: 0,
        }),
      );

      // w
      game.tick(
        Action.bondPurchase({
          player: 'w', cost: 4, nation: Nation2030.CN, tradeInValue: 0,
        }),
      );
      game.tick(
        Action.undo({ player: 'w' }),
      );
      game.tick(
        Action.skipBondPurchase({ player: 'w', nation: Nation2030.CN }),
      );

      // m
      game.tick(
        Action.skipBondPurchase({ player: 'm', nation: Nation2030.CN }),
      );

      // India
      // j
      game.tick(
        Action.bondPurchase({
          player: 'j', cost: 6, nation: Nation2030.IN, tradeInValue: 0,
        }),
      );

      // w
      game.tick(
        Action.skipBondPurchase({ player: 'w', nation: Nation2030.IN }),
      );

      // m
      game.tick(
        Action.bondPurchase({
          player: 'm', cost: 9, nation: Nation2030.IN, tradeInValue: 0,
        }),
      );
      game.tick(
        Action.bondPurchase({
          player: 't', cost: 4, nation: Nation2030.IN, tradeInValue: 0,
        }),
      );

      // Brazil
      // w
      game.tick(
        Action.skipBondPurchase({ player: 'w', nation: Nation2030.BR }),
      );
      game.tick(
        Action.undo({ player: 'w' }),
      );
      game.tick(
        Action.bondPurchase({
          player: 'w', cost: 4, nation: Nation2030.BR, tradeInValue: 0,
        }),
      );

      // m
      game.tick(
        Action.skipBondPurchase({ player: 'm', nation: Nation2030.BR }),
      );

      // t
      game.tick(
        Action.bondPurchase({
          player: 't', cost: 6, nation: Nation2030.BR, tradeInValue: 0,
        }),
      );

      expect(game.availableActions).toEqual(expectedActions);
    });
  });
});

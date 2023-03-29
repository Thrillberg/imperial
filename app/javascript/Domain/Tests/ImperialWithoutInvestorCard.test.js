import Action from '../action';

import Imperial from '../ImperialGameCoordinator';

import BoardEurope from '../board';
import { Nation } from '../constants';

const ImperialFromLog = (log) => {
  const game = new Imperial(BoardEurope);

  game.tickFromLog(log);

  return game;
};

const log = [
  Action.initialize({
    players: [
      { id: 'player1' },
      { id: 'player2' },
    ],
    soloMode: false,
    variant: 'withoutInvestorCard',
    baseGame: 'imperial',
  }),
  Action.bondPurchase({
    player: 'player1', cost: 4, nation: Nation.AH, tradeInValue: 0,
  }),
  Action.bondPurchase({
    player: 'player2', cost: 2, nation: Nation.AH, tradeInValue: 0,
  }),
  Action.bondPurchase({
    player: 'player2', cost: 4, nation: Nation.IT, tradeInValue: 0,
  }),
  Action.bondPurchase({
    player: 'player1', cost: 2, nation: Nation.IT, tradeInValue: 0,
  }),
  Action.bondPurchase({
    player: 'player1', cost: 4, nation: Nation.FR, tradeInValue: 0,
  }),
  Action.bondPurchase({
    player: 'player2', cost: 2, nation: Nation.FR, tradeInValue: 0,
  }),
  Action.bondPurchase({
    player: 'player2', cost: 4, nation: Nation.GB, tradeInValue: 0,
  }),
  Action.bondPurchase({
    player: 'player1', cost: 2, nation: Nation.GB, tradeInValue: 0,
  }),
  Action.bondPurchase({
    player: 'player1', cost: 4, nation: Nation.GE, tradeInValue: 0,
  }),
  Action.bondPurchase({
    player: 'player2', cost: 2, nation: Nation.GE, tradeInValue: 0,
  }),
  Action.bondPurchase({
    player: 'player2', cost: 4, nation: Nation.RU, tradeInValue: 0,
  }),
  Action.bondPurchase({
    player: 'player1', cost: 2, nation: Nation.RU, tradeInValue: 0,
  }),
];

describe('round of investment', () => {
  test('each player can invest in one country', () => {
    const firstExpectedActions = new Set([
      Action.skipBondPurchase({ player: 'player1', nation: Nation.AH }),
      Action.undo({ player: 'player1' }),
    ]);
    [6, 9, 12, 16, 20].forEach((cost) => {
      firstExpectedActions.add(
        Action.bondPurchase({
          nation: Nation.AH,
          cost,
          tradeInValue: 0,
          player: 'player1',
        }),
      );
      firstExpectedActions.add(
        Action.bondPurchase({
          nation: Nation.AH,
          cost,
          tradeInValue: 4,
          player: 'player1',
        }),
      );
    });
    firstExpectedActions.add(
      Action.bondPurchase({
        nation: Nation.AH,
        cost: 25,
        tradeInValue: 4,
        player: 'player1',
      }),
    );
    const secondExpectedActions = new Set([
      Action.skipBondPurchase({ player: 'player2', nation: Nation.AH }),
      Action.undo({ player: 'player1' }),
    ]);
    [9, 12, 16, 20].forEach((cost) => {
      secondExpectedActions.add(
        Action.bondPurchase({
          nation: Nation.AH,
          cost,
          tradeInValue: 0,
          player: 'player2',
        }),
      );
      secondExpectedActions.add(
        Action.bondPurchase({
          nation: Nation.AH,
          cost,
          tradeInValue: 2,
          player: 'player2',
        }),
      );
    });
    secondExpectedActions.add(
      Action.bondPurchase({
        nation: Nation.AH,
        cost: 25,
        tradeInValue: 2,
        player: 'player2',
      }),
    );

    const game = ImperialFromLog(log);

    game.tick(Action.rondel({ nation: Nation.AH, cost: 0, slot: 'investor' }));

    expect(game.availableActions).toEqual(firstExpectedActions);

    game.tick(Action.bondPurchase({
      nation: Nation.AH, cost: 6, player: 'player1', tradeInValue: 0,
    }));

    expect(game.availableActions).toEqual(secondExpectedActions);
  });

  test('it auto-skips a player who cannot afford to invest', () => {
    const game = ImperialFromLog(log);
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
      ].map((slot) => Action.rondel({ nation: Nation.GB, cost: 0, slot })),
    );
    expected.add(Action.undo({ player: 'player1' }));

    game.tick(Action.rondel({ nation: Nation.AH, cost: 0, slot: 'investor' }));
    game.tick(Action.bondPurchase({
      nation: Nation.AH, cost: 25, player: 'player1', tradeInValue: 4,
    }));
    game.tick(Action.bondPurchase({
      nation: Nation.AH, cost: 20, player: 'player2', tradeInValue: 0,
    }));
    game.tick(Action.rondel({ nation: Nation.IT, cost: 0, slot: 'investor' }));
    game.tick(Action.bondPurchase({
      nation: Nation.IT, cost: 9, player: 'player2', tradeInValue: 4,
    }));
    game.tick(Action.bondPurchase({
      nation: Nation.IT, cost: 6, player: 'player1', tradeInValue: 2,
    }));
    game.tick(Action.rondel({ nation: Nation.FR, cost: 0, slot: 'investor' }));
    game.tick(Action.bondPurchase({
      nation: Nation.FR, cost: 6, player: 'player1', tradeInValue: 4,
    }));

    expect(game.currentPlayerName).toEqual('player2');
    expect(game.availableActions).toEqual(expected);
  });

  test('a more elaborate auto-skipping example', () => {
    const gameLog = [
      Action.initialize({
        players: [
          { id: 'player1' },
          { id: 'player2' },
          { id: 'player3' },
        ],
        soloMode: false,
        variant: 'withoutInvestorCard',
        baseGame: 'imperial',
      }),
      Action.bondPurchase({
        player: 'player1', cost: 6, nation: Nation.AH, tradeInValue: 0,
      }),
      Action.bondPurchase({
        player: 'player2', cost: 4, nation: Nation.AH, tradeInValue: 0,
      }),
      Action.bondPurchase({
        player: 'player3', cost: 2, nation: Nation.AH, tradeInValue: 0,
      }),
      Action.bondPurchase({
        player: 'player2', cost: 6, nation: Nation.IT, tradeInValue: 0,
      }),
      Action.bondPurchase({
        player: 'player3', cost: 4, nation: Nation.IT, tradeInValue: 0,
      }),
      Action.bondPurchase({
        player: 'player1', cost: 2, nation: Nation.IT, tradeInValue: 0,
      }),
      Action.bondPurchase({
        player: 'player3', cost: 6, nation: Nation.FR, tradeInValue: 0,
      }),
      Action.bondPurchase({
        player: 'player1', cost: 4, nation: Nation.FR, tradeInValue: 0,
      }),
      Action.bondPurchase({
        player: 'player2', cost: 2, nation: Nation.FR, tradeInValue: 0,
      }),
      Action.bondPurchase({
        player: 'player1', cost: 6, nation: Nation.GB, tradeInValue: 0,
      }),
      Action.bondPurchase({
        player: 'player2', cost: 4, nation: Nation.GB, tradeInValue: 0,
      }),
      Action.bondPurchase({
        player: 'player3', cost: 2, nation: Nation.GB, tradeInValue: 0,
      }),
      Action.bondPurchase({
        player: 'player2', cost: 6, nation: Nation.GE, tradeInValue: 0,
      }),
      Action.bondPurchase({
        player: 'player3', cost: 4, nation: Nation.GE, tradeInValue: 0,
      }),
      Action.bondPurchase({
        player: 'player1', cost: 2, nation: Nation.GE, tradeInValue: 0,
      }),
      Action.bondPurchase({
        player: 'player3', cost: 6, nation: Nation.RU, tradeInValue: 0,
      }),
      Action.bondPurchase({
        player: 'player1', cost: 4, nation: Nation.RU, tradeInValue: 0,
      }),
      Action.bondPurchase({
        player: 'player2', cost: 2, nation: Nation.RU, tradeInValue: 0,
      }),
    ];

    const game = ImperialFromLog(gameLog);

    game.tick(Action.rondel({ nation: Nation.AH, cost: 0, slot: 'investor' }));
    game.tick(Action.skipBondPurchase({ player: 'player1', nation: Nation.AH }));
    game.tick(Action.skipBondPurchase({ player: 'player2', nation: Nation.AH }));
    game.tick(Action.rondel({ nation: Nation.IT, cost: 0, slot: 'investor' }));
    game.tick(Action.bondPurchase({
      player: 'player2', cost: 9, nation: Nation.IT, tradeInValue: 0,
    }));
    game.tick(Action.skipBondPurchase({ player: 'player3', nation: Nation.IT }));
    game.tick(Action.rondel({ nation: Nation.FR, cost: 0, slot: 'investor' }));
    game.tick(Action.bondPurchase({
      player: 'player3', cost: 9, nation: Nation.FR, tradeInValue: 0,
    }));
    game.tick(Action.skipBondPurchase({ player: 'player1', nation: Nation.FR }));
    game.tick(Action.rondel({ nation: Nation.GB, cost: 0, slot: 'investor' }));

    expect(game.currentPlayerName).toEqual('player1');
  });
});

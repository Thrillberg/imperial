import Action from "./action.js";
import Imperial from "./imperial.js";
import { Bond, Nation } from "./constants.js";

const log = [
  Action.initialize({
    players: [
      { id: "player1" },
      { id: "player2" }
    ],
    soloMode: false,
    variant: "withoutInvestorCard"
  }),
  Action.bondPurchase({ player: "player1", cost: 4, nation: Nation.AH }),
  Action.bondPurchase({ player: "player2", cost: 2, nation: Nation.AH }),
  Action.bondPurchase({ player: "player2", cost: 4, nation: Nation.IT }),
  Action.bondPurchase({ player: "player1", cost: 2, nation: Nation.IT }),
  Action.bondPurchase({ player: "player1", cost: 4, nation: Nation.FR }),
  Action.bondPurchase({ player: "player2", cost: 2, nation: Nation.FR }),
  Action.bondPurchase({ player: "player2", cost: 4, nation: Nation.GB }),
  Action.bondPurchase({ player: "player1", cost: 2, nation: Nation.GB }),
  Action.bondPurchase({ player: "player1", cost: 4, nation: Nation.GE }),
  Action.bondPurchase({ player: "player2", cost: 2, nation: Nation.GE }),
  Action.bondPurchase({ player: "player2", cost: 4, nation: Nation.RU }),
  Action.bondPurchase({ player: "player1", cost: 2, nation: Nation.RU }),
]

describe("round of investment", () => {
  test("each player can invest in one country", () => {
    let firstExpectedActions = new Set([
      Action.skipBondPurchase({ player: "player1", nation: Nation.AH })
    ]);
    [6, 9, 12, 16, 20, 25].map(cost => {
      firstExpectedActions.add(
        Action.bondPurchase({
          nation: Nation.AH,
          cost,
          player: "player1"
        })
      )
    })
    let secondExpectedActions = new Set([
      Action.skipBondPurchase({ player: "player2", nation: Nation.AH })
    ]);
    [9, 12, 16, 20, 25].map(cost => {
      secondExpectedActions.add(
        Action.bondPurchase({
          nation: Nation.AH,
          cost,
          player: "player2"
        })
      )
    })
    const game = Imperial.fromLog(log);

    game.tick(Action.rondel({ nation: Nation.AH, cost: 0, slot: "investor" }))

    expect(game.availableActions).toEqual(firstExpectedActions);

    game.tick(Action.bondPurchase({ nation: Nation.AH, cost: 6, player: "player1" }))

    expect(game.availableActions).toEqual(secondExpectedActions);
  });

  test("it auto-skips a player who cannot afford to invest", () => {
    const game = Imperial.fromLog(log);

    game.tick(Action.rondel({ nation: Nation.AH, cost: 0, slot: "investor" }))
    game.tick(Action.bondPurchase({ nation: Nation.AH, cost: 25, player: "player1" }))
    game.tick(Action.bondPurchase({ nation: Nation.AH, cost: 20, player: "player2" }))
    game.tick(Action.rondel({ nation: Nation.IT, cost: 0, slot: "investor" }))
    game.tick(Action.bondPurchase({ nation: Nation.IT, cost: 9, player: "player2" }))
    game.tick(Action.bondPurchase({ nation: Nation.IT, cost: 6, player: "player1" }))
    game.tick(Action.rondel({ nation: Nation.FR, cost: 0, slot: "investor" }))
    game.tick(Action.bondPurchase({ nation: Nation.FR, cost: 6, player: "player1" }))

    expect(game.currentPlayerName).toEqual("player2");
    expect(game.availableActions).toEqual(
      new Set(
        [
          "factory",
          "production1",
          "maneuver1",
          "investor",
          "import",
          "production2",
          "maneuver2",
          "taxation"
        ].map(slot => Action.rondel({ nation: Nation.GB, cost: 0, slot }))
      )
    )
  });

  test("a more elaborate auto-skipping example", () => {
    const log = [
      Action.initialize({
        players: [
          { id: "player1" },
          { id: "player2" },
          { id: "player3" }
        ],
        soloMode: false,
        variant: "withoutInvestorCard"
      }),
      Action.bondPurchase({ player: "player1", cost: 6, nation: Nation.AH }),
      Action.bondPurchase({ player: "player2", cost: 4, nation: Nation.AH }),
      Action.bondPurchase({ player: "player3", cost: 2, nation: Nation.AH }),
      Action.bondPurchase({ player: "player2", cost: 6, nation: Nation.IT }),
      Action.bondPurchase({ player: "player3", cost: 4, nation: Nation.IT }),
      Action.bondPurchase({ player: "player1", cost: 2, nation: Nation.IT }),
      Action.bondPurchase({ player: "player3", cost: 6, nation: Nation.FR }),
      Action.bondPurchase({ player: "player1", cost: 4, nation: Nation.FR }),
      Action.bondPurchase({ player: "player2", cost: 2, nation: Nation.FR }),
      Action.bondPurchase({ player: "player1", cost: 6, nation: Nation.GB }),
      Action.bondPurchase({ player: "player2", cost: 4, nation: Nation.GB }),
      Action.bondPurchase({ player: "player3", cost: 2, nation: Nation.GB }),
      Action.bondPurchase({ player: "player2", cost: 6, nation: Nation.GE }),
      Action.bondPurchase({ player: "player3", cost: 4, nation: Nation.GE }),
      Action.bondPurchase({ player: "player1", cost: 2, nation: Nation.GE }),
      Action.bondPurchase({ player: "player3", cost: 6, nation: Nation.RU }),
      Action.bondPurchase({ player: "player1", cost: 4, nation: Nation.RU }),
      Action.bondPurchase({ player: "player2", cost: 2, nation: Nation.RU }),
    ]

    const game = Imperial.fromLog(log);

    game.tick(Action.rondel({ nation: Nation.AH, cost: 0, slot: "investor" }))
    game.tick(Action.skipBondPurchase({ player: "player1", nation: Nation.AH }))
    game.tick(Action.skipBondPurchase({ player: "player2", nation: Nation.AH }))
    game.tick(Action.rondel({ nation: Nation.IT, cost: 0, slot: "investor" }))
    game.tick(Action.bondPurchase({ player: "player2", cost: 9, nation: Nation.IT }))
    game.tick(Action.rondel({ nation: Nation.FR, cost: 0, slot: "investor" }))
    game.tick(Action.bondPurchase({ player: "player3", cost: 9, nation: Nation.FR }))
    game.tick(Action.skipBondPurchase({ player: "player1", nation: Nation.FR }))
    game.tick(Action.rondel({ nation: Nation.GB, cost: 0, slot: "investor" }))
  });
});

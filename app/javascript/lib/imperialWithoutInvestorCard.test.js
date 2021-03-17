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
});

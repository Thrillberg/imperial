import Action from "./action.js";
import Auction from "./auction.js";
import GameBoard from "./gameBoard.js";
import Imperial from "./imperial.js";
import { Bond, Nation } from "./constants.js";

describe("auction", () => {
  describe("initialize", () => {
    test("it is AH's turn to select a rondel slot", () => {
      const auction = new Auction();
      const game = new Imperial();
      let expectedActions = new Set([
        Action.skipBondPurchase({ player: "player1", nation: Nation.AH })
      ]);
      [2, 4, 6, 9, 12, 16, 20, 25, 30].map(cost => {
        expectedActions.add(
          Action.bondPurchase({
            nation: Nation.AH,
            cost,
            player: "player1"
          })
        )
      })

      auction.tick(
        Action.initialize({
          players: [
            { id: "player1" },
            { id: "player2" }
          ],
          soloMode: false,
          variant: "auction"
        }),
        game
      );

      expect(game.availableActions).toEqual(expectedActions);
    });
  });

  describe("bondPurchase", () => {
    const newGame = () => {
      const game = new Imperial();
      game.tick(
        Action.initialize({
          players: [
            { id: "player1" },
            { id: "player2" }
          ],
          soloMode: false,
          variant: "auction"
        })
      );
      return game;
    }

    test("player purchases a bond", () => {
      const game = newGame();
      const auction = game.auction;
      let expectedActions = new Set([
        Action.skipBondPurchase({ player: "player2", nation: Nation.AH })
      ]);
      [2, 6, 9, 12, 16, 20, 25, 30].map(cost => {
        expectedActions.add(
          Action.bondPurchase({
            nation: Nation.AH,
            cost,
            player: "player2"
          })
        )
      })

      auction.tick(
        Action.bondPurchase({ player: "player1", cost: 4, nation: Nation.AH }),
        game
      );

      expect(game.players["player1"].bonds).toEqual(
        new Set([Bond(Nation.AH, 2)])
      );
      expect(game.availableActions).toEqual(expectedActions);
    });

    test("all players have had an opportunity to buy an AH bond", () => {
      const game = newGame();
      const auction = game.auction;
      let expectedActions = new Set([
        Action.skipBondPurchase({ player: "player2", nation: Nation.IT })
      ]);
      [2, 4, 6, 9, 12, 16, 20, 25, 30].map(cost => {
        expectedActions.add(
          Action.bondPurchase({
            nation: Nation.IT,
            cost,
            player: "player2"
          })
        )
      })

      auction.tick(
        Action.bondPurchase({ player: "player1", cost: 4, nation: Nation.AH }),
        game
      );
      auction.tick(
        Action.bondPurchase({ player: "player2", cost: 2, nation: Nation.AH }),
        game
      );

      expect(game.players["player1"].bonds).toEqual(
        new Set([Bond(Nation.AH, 2)])
      );
      expect(game.players["player2"].bonds).toEqual(
        new Set([Bond(Nation.AH, 1)])
      );
      expect(game.availableActions).toEqual(expectedActions);
    });

    test("last player buys a final bond and swiss bank is assigned", () => {
      const log = [
        Action.initialize({
          players: [
            { id: "player1" },
            { id: "player2" }
          ],
          soloMode: false,
          variant: "auction"
        }),
        Action.bondPurchase({ player: "player1", cost: 4, nation: Nation.AH }),
        Action.bondPurchase({ player: "player2", cost: 2, nation: Nation.AH }),
        Action.bondPurchase({ player: "player2", cost: 2, nation: Nation.IT }),
        Action.bondPurchase({ player: "player1", cost: 4, nation: Nation.IT }),
        Action.bondPurchase({ player: "player1", cost: 4, nation: Nation.FR }),
        Action.bondPurchase({ player: "player2", cost: 2, nation: Nation.FR }),
        Action.bondPurchase({ player: "player2", cost: 2, nation: Nation.GB }),
        Action.bondPurchase({ player: "player1", cost: 4, nation: Nation.GB }),
        Action.bondPurchase({ player: "player1", cost: 4, nation: Nation.GE }),
        Action.bondPurchase({ player: "player2", cost: 2, nation: Nation.GE }),
        Action.bondPurchase({ player: "player2", cost: 2, nation: Nation.RU }),
        Action.bondPurchase({ player: "player1", cost: 4, nation: Nation.RU })
      ];

      const game = Imperial.fromLog(log);
      const auction = game.auction;

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
          ].map(slot => Action.rondel({ nation: Nation.AH, cost: 0, slot }))
        )
      );
      expect(game.swissBanks).toEqual(["player2"]);
    });
  });
});

import Action from "./action.js";
import Auction from "./auction.js";
import GameBoard from "./gameBoard.js";
import Imperial from "./imperial.js";
import { Bond, Nation } from "./constants.js";

describe("auction", () => {
  describe("initialize", () => {
    test("it is AH's turn to select a rondel slot", () => {
      const auction = new Auction();

      auction.tick(
        Action.initialize({
          players: [
            { id: "player1" },
            { id: "player2" }
          ],
          soloMode: false,
          variant: "auction"
        })
      );

      expect(auction.availableActions).toEqual(
        new Set(
          [2, 4, 6, 9, 12, 16, 20, 25, 30].map(cost => {
            return Action.bondPurchase({
              nation: Nation.AH,
              cost,
              player: "player1"
            })
          })
        )
      );
    });
  });

  describe("bondPurchase", () => {
    const newAuction = () => {
      const auction = new Auction();
      auction.tick(
        Action.initialize({
          players: [
            { id: "player1" },
            { id: "player2" }
          ],
          soloMode: false,
          variant: "auction"
        })
      );
      return auction;
    };

    test("player purchases a bond", () => {
      const auction = newAuction();

      auction.tick(
        Action.bondPurchase({ player: "player1", cost: 4, nation: Nation.AH })
      );

      expect(auction.players["player1"].bonds).toEqual(
        new Set([Bond(Nation.AH, 2)])
      );
      expect(auction.availableActions).toEqual(
        new Set(
          [2, 6, 9, 12, 16, 20, 25, 30].map(cost => {
            return Action.bondPurchase({
              nation: Nation.AH,
              cost,
              player: "player2"
            })
          })
        )
      );
    });

    test("all players have had an opportunity to buy an AH bond", () => {
      const auction = newAuction();

      auction.tick(
        Action.bondPurchase({ player: "player1", cost: 4, nation: Nation.AH })
      );
      auction.tick(
        Action.bondPurchase({ player: "player2", cost: 2, nation: Nation.AH })
      );

      expect(auction.players["player1"].bonds).toEqual(
        new Set([Bond(Nation.AH, 2)])
      );
      expect(auction.players["player2"].bonds).toEqual(
        new Set([Bond(Nation.AH, 1)])
      );
      expect(auction.availableActions).toEqual(
        new Set(
          [2, 4, 6, 9, 12, 16, 20, 25, 30].map(cost => {
            return Action.bondPurchase({
              nation: Nation.IT,
              cost,
              player: "player1"
            })
          })
        )
      );
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
        Action.bondPurchase({ player: "player1", cost: 4, nation: Nation.IT }),
        Action.bondPurchase({ player: "player2", cost: 2, nation: Nation.IT }),
        Action.bondPurchase({ player: "player1", cost: 4, nation: Nation.FR }),
        Action.bondPurchase({ player: "player2", cost: 2, nation: Nation.FR }),
        Action.bondPurchase({ player: "player1", cost: 4, nation: Nation.GB }),
        Action.bondPurchase({ player: "player2", cost: 2, nation: Nation.GB }),
        Action.bondPurchase({ player: "player1", cost: 4, nation: Nation.GE }),
        Action.bondPurchase({ player: "player2", cost: 2, nation: Nation.GE }),
        Action.bondPurchase({ player: "player1", cost: 4, nation: Nation.RU }),
        Action.bondPurchase({ player: "player2", cost: 2, nation: Nation.RU })
      ];
      const game = new Imperial();

      const auction = Auction.fromLog(log, game);

      expect(auction.availableActions).toEqual(
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

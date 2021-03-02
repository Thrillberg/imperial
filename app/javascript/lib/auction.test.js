import Action from "./action.js";
import Auction from "./auction.js";
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

    test.skip("all players have had an opportunity to buy an AH bond", () => {
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
  });
});

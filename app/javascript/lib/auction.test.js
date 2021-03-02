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
});

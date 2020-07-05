import Imperial from "./imperial.js";
import Action from "./action.js";
import { Nation } from "./constants.js";

var app = new Vue({
  el: "#app",
  data: {
    tickText: "Start Game",
    players: [],
  },
  methods: {
    tick: () => {
      app.tickText = "Tick";
      const log = [
        Action.playerSeating({ order: ["Daniel", "Claudia", "Bert", "Anton"] }),
        Action.assignStartingNation({ nation: Nation.RU, player: "Daniel" }),
        Action.assignStartingNation({ nation: Nation.FR, player: "Claudia" }),
        Action.assignStartingNation({ nation: Nation.GB, player: "Bert" }),
        Action.assignStartingNation({ nation: Nation.IT, player: "Anton" }),
        Action.bondPurchase({ nation: Nation.AH, player: "Claudia", cost: 2 }),
        Action.bondPurchase({ nation: Nation.IT, player: "Anton", cost: 9 }),
        Action.bondPurchase({ nation: Nation.FR, player: "Claudia", cost: 9 }),
        Action.bondPurchase({ nation: Nation.FR, player: "Daniel", cost: 2 }),
        Action.bondPurchase({ nation: Nation.GB, player: "Anton", cost: 2 }),
        Action.bondPurchase({ nation: Nation.GB, player: "Bert", cost: 9 }),
        Action.bondPurchase({ nation: Nation.RU, player: "Bert", cost: 2 }),
        Action.bondPurchase({ nation: Nation.RU, player: "Daniel", cost: 9 }),
        Action.startFirstRound(),
      ];

      var game = Imperial.fromLog(log);
      game.order.map((player) => {
        app.players.push(player);
      });
    },
  },
});

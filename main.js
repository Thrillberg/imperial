import Imperial from "./imperial.js";
import log from "./schnelleinsteigLog.js";

var app = new Vue({
  el: "#app",
  data: {
    game: {},
    gameStarted: false,
    players: [],
  },
  methods: {
    startGame: () => {
      app.game = Imperial.fromLog([]);
      app.game.tick(log[0]);
      app.game.order.map((player) => {
        app.players.push(player);
      });
      app.gameStarted = true;
    },
    tick: () => {},
  },
});

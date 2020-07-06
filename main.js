import Imperial from "./imperial.js";
import log from "./schnelleinsteigLog.js";

Vue.component("player", {
  props: ["name", "cash"],
  template: "<li>{{ name }} has {{ cash }} million in cash!</li>",
});

var app = new Vue({
  el: "#app",
  data: {
    game: {},
    gameStarted: false,
    gameLog: [],
    logIndex: 0,
  },
  methods: {
    startGame: function () {
      this.gameLog.push(log[0]);
      this.game = Imperial.fromLog(this.gameLog);
      this.logIndex += 1;
      this.gameStarted = true;
    },
    tick: function () {
      this.logIndex += 1;
      this.gameLog.push(log[this.logIndex]);
      this.game = Imperial.fromLog(this.gameLog);
    },
  },
});

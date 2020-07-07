import Imperial from "./imperial.js";
import log from "./schnelleinsteigLog.js";

Vue.component("player", {
  props: ["name", "cash", "bonds"],
  template: `
  <li class="player">
    <div class="contents">
      <h3>{{ name }}</h3>
      <div>Cash: {{ cash }} million</div>
      <div>
        Bonds:
        <ul class="bonds">
          <bond
            v-for="bond in bonds"
            v-bind:nation="bond.nation.value"
            v-bind:cost="bond.cost"
            v-bind:key="bond.nation"
          ></bond>
        </ul>
      </div>
    </div>
  </li>
  `,
});

Vue.component("bond", {
  props: ["nation", "cost"],
  template: `<li class="bond">{{ nation }}{{ cost }}</li>`,
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
      this.gameLog.push(log[this.logIndex]);
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

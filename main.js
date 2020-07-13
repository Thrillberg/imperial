import Imperial from "./imperial.js";
import log from "./schnelleinsteigLog.js";

Vue.component("player", {
  props: ["name", "cash", "bonds", "current_player"],
  template: `
  <li class="player">
    <div v-if="name === current_player" class="current_player">
      🤩
    </div>
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
            v-bind:key="bond.nation.value"
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

Vue.component("rondel-slot", {
  props: ["name", "nations"],
  template: `
    <li>
      <div class="rondel-slot">{{ name }}</div>
      <nation
        v-for="nation in nations"
        v-bind:nation="nation"
        v-bind:key="nation"
      ></nation>
    </li>
  `,
});

Vue.component("nation", {
  props: ["nation"],
  template: `<li class="flag">{{ flag() }}</li>`,
  methods: {
    flag: function () {
      switch (this.nation) {
        case "AH":
          return "🇦🇹";
        case "IT":
          return "🇮🇹";
        case "FR":
          return "🇫🇷";
        case "GB":
          return "🇬🇧";
        case "GE":
          return "🇩🇪";
        case "RU":
          return "🇷🇺";
      }
    },
  },
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

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
  props: ["current_nation", "name", "nations"],
  template: `
    <li>
      <div class="rondel-slot">{{ name }}</div>
      <nation
        v-for="nation in nations"
        v-bind:current_nation="current_nation"
        v-bind:key="nation"
        v-bind:nation="nation"
      ></nation>
    </li>
  `,
});

Vue.component("nation", {
  props: ["current_nation", "nation"],
  template: `<li :class="flagClass()">{{ flag() }}</li>`,
  methods: {
    flagClass: function () {
      return this.current_nation === this.nation
        ? "flag current_nation"
        : "flag";
    },
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

Vue.component("current-turn", {
  props: ["type", "payload"],
  template: `<div>{{ type }}{{ payload }}</div>`,
});

Vue.component("action", {
  props: ["action", "dispatch", "text"],
  template: `<button v-on:click="dispatch(action)">{{ text }}</button>`,
});

var app = new Vue({
  el: "#app",
  data: {
    game: {},
    gameStarted: false,
  },
  methods: {
    startGame: function () {
      this.game = Imperial.fromLog(log.slice(0, 2));
      this.gameStarted = true;
    },
    tickWithAction: function (action) {
      this.game.tick(action);
    },
    actionToText: function (action) {
      if (action.type === "rondel") {
        return action.payload.slot;
      } else if (action.type === "import") {
        return `Import ${action.payload.unit} in ${action.payload.province}`;
      } else if (action.type === "buildFactory") {
        return `Build factory in ${action.payload.province}`;
      }
    },
  },
});

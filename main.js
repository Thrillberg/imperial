import Imperial from "./imperial.js";
import Action from "./action.js";
import { Nation } from "./constants.js";

Vue.component("waiting-player", {
  props: ["name"],
  template: `<li>{{ name }}</li>`,
});

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
    rondel: "",
    name: "",
    waitingPlayers: [],
    websocket: new WebSocket("ws://localhost:8080/ws"),
  },
  mounted() {
    this.websocket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data["type"] === "registerPlayers") {
        this.waitingPlayers = data["payload"]["players"];
      }
      console.log(data, data["payload"]["players"].length);
      if (this.waitingPlayers.length === 2) {
        const init = Action.initialize({
          players: [
            { id: data["payload"]["players"][0], nation: Nation.AH },
            { id: data["payload"]["players"][1], nation: Nation.IT },
          ],
        });
        this.game = Imperial.fromLog([init]);
        this.gameStarted = true;
      }
    };

    this.websocket.onerror = (event) => {
      console.log("error!", event);
    };

    fetch("rondel.svg")
      .then((response) => response.text())
      .then((text) => {
        this.rondel = text;
      });
  },
  methods: {
    registerPlayer: function () {
      this.websocket.send(JSON.stringify(this.name));
    },
    flag: function (nation) {
      switch (nation) {
        case "AH":
          return "flags/ah.svg";
        case "IT":
          return "flags/it.svg";
        case "FR":
          return "flags/fr.svg";
        case "GB":
          return "flags/gb.svg";
        case "GE":
          return "flags/ge.svg";
        case "RU":
          return "flags/ru.svg";
      }
    },
    tickWithAction: function (action) {
      this.game.tick(action);
      this.updateRondel();
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
    updateRondel: function () {
      for (const [nation, { rondelPosition }] of this.game.nations) {
        if (rondelPosition === null) continue;
        const el = document.getElementById(rondelPosition);
        const bBox = el.getBBox();
        const flag = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "image"
        );
        flag.setAttribute("height", "20");

        // This is a really rough way to get the center of the SVG path
        const step = el.getTotalLength() / 100;
        let totalX = 0;
        let totalY = 0;
        for (let dist = 0; dist < el.getTotalLength(); dist += step) {
          const pt = el.getPointAtLength(dist);
          totalX += pt.x;
          totalY += pt.y;
        }

        flag.setAttribute("x", totalX / 100);
        flag.setAttribute("y", totalY / 100);

        flag.setAttribute("href", this.flag(nation.value));
        el.parentNode.append(flag);
      }
    },
  },
});

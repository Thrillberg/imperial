<template>
  <div v-if="gameStarted">
    <ul class="players">
      <Player
        v-for="player in game.players"
        v-bind:name="player.name"
        v-bind:cash="player.cash"
        v-bind:bonds="player.bonds"
        v-bind:current_player="game.currentPlayerName"
        v-bind:key="player.name"
      ></Player>
    </ul>
    <div class="rondel" v-html="rondel"></div>
    <CurrentTurn
      v-bind:type="game.log[game.log.length - 1].type"
      v-bind:payload="game.log[game.log.length - 1].payload"
    ></CurrentTurn>
    <div>It is {{ game.currentNation.value }}'s turn</div>
    <div class="buttons">
      <Action
        v-for="action in game.availableActions"
        v-bind:key="JSON.stringify(action)"
        v-bind:action="action"
        v-bind:text="actionToText(action)"
        v-bind:dispatch="tickWithAction"
      ></Action>
    </div>
  </div>
  <div v-else class="buttons">
    <button v-on:click="startGame">
      Start Game
    </button>
  </div>
</template>

<script>
import Action from "./components/Action.vue";
import CurrentTurn from "./components/CurrentTurn.vue";
import Player from "./components/Player.vue";
import Imperial from "./../../imperial.js";
import log from "./../../schnelleinsteigLog";

export default {
  name: "App",
  data() {
    return { game: {}, gameStarted: false, rondel: "" };
  },
  mounted() {
    fetch("rondel.svg")
      .then((response) => response.text())
      .then((text) => {
        this.rondel = text;
      });
  },
  methods: {
    startGame: function () {
      this.game = Imperial.fromLog(log.slice(0, 2));
      this.gameStarted = true;
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
        // const bBox = el.getBBox();
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
  components: {
    Action,
    CurrentTurn,
    Player,
  },
};
</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>

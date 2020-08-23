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
    <div class="rondel">
      <Rondel />
    </div>
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

import AHFlag from "./assets/flags/ah.vue";
import FRFlag from "./assets/flags/fr.vue";
import GBFlag from "./assets/flags/gb.vue";
import GEFlag from "./assets/flags/ge.vue";
import ITFlag from "./assets/flags/it.vue";
import RUFlag from "./assets/flags/ru.vue";
import Rondel from "./assets/Rondel.vue";

import Imperial from "./../../imperial.js";
import log from "./../../schnelleinsteigLog";

export default {
  name: "App",
  data() {
    return {
      game: {},
      gameStarted: false,
    };
  },
  methods: {
    startGame: function () {
      this.game = Imperial.fromLog(log.slice(0, 2));
      this.gameStarted = true;
    },
    flag: function (nation) {
      switch (nation) {
        case "AH":
          return AHFlag;
        case "IT":
          return ITFlag;
        case "FR":
          return FRFlag;
        case "GB":
          return GBFlag;
        case "GE":
          return GEFlag;
        case "RU":
          return RUFlag;
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
    Rondel,
  },
};
</script>

<style>
button {
  background: #224f4a;
  border: none;
  color: white;
  font-size: 1.5rem;
  margin: 0 auto;
  padding: 2rem;
}

.buttons {
  display: flex;
  justify-content: space-around;
}

ul {
  display: flex;
  justify-content: space-around;
  list-style: none;
  padding-left: 0;
}

.rondel {
  text-align: center;
}
</style>

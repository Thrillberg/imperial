<template>
  <div id="app">
    <div v-if="gameStarted">
      <div class="container mx-auto">
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
        <Board v-bind:board="board"></Board>
        <Rondel
          v-bind:nations="game.nations"
          v-bind:select_action="selectAction"
          v-bind:valid_slots="validSlots()"
        ></Rondel>
      </div>
      <ul class="nations">
        <NationComponent
          v-for="[nation] of game.nations"
          v-bind:current_nation="
            game.currentNation === nation ? 'current_nation' : ''
          "
          v-bind:nation="nation.value"
          v-bind:treasury="game.nations.get(nation).treasury"
          v-bind:key="nation.value"
        ></NationComponent>
      </ul>
      <CurrentTurn
        v-bind:type="game.log[game.log.length - 1].type"
        v-bind:payload="game.log[game.log.length - 1].payload"
      ></CurrentTurn>
      <div class="buttons">
        <ActionComponent
          v-if="importStatus.active"
          v-bind:action="importStatus.endImport"
          v-bind:text="'End import'"
          v-bind:dispatch="runImport"
        ></ActionComponent>
        <ActionComponent
          v-else-if="maneuverStatus.active"
          v-bind:action="maneuverStatus.endManeuver"
          v-bind:text="'End maneuver'"
          v-bind:dispatch="endManeuver"
        ></ActionComponent>
        <ActionComponent
          v-else-if="purchasingBond || buildingFactory"
          v-for="action in game.availableActions"
          v-bind:key="JSON.stringify(action)"
          v-bind:action="action"
          v-bind:text="actionToText(action)"
          v-bind:dispatch="tickWithAction"
        ></ActionComponent>
      </div>
    </div>
    <div v-else class="flex items-center">
      <PlayerCount
        v-for="count in playerCounts"
        v-bind:key="count"
        v-bind:count="count"
        v-bind:start_game="startGame"
      ></PlayerCount>
    </div>
  </div>
</template>

<script>
import Imperial from "../lib/imperial.js";
import Action from "../lib/action.js";
import { Nation } from "../lib/constants.js";

import ActionComponent from "./components/ActionComponent.vue";
import Board from "./components/Board.vue";
import CurrentTurn from "./components/CurrentTurn.vue";
import NationComponent from "./components/NationComponent.vue";
import Player from "./components/Player.vue";
import PlayerCount from "./components/PlayerCount.vue";
import Rondel from "./components/Rondel.vue";

export default {
  name: "App",
  components: {
    ActionComponent,
    Board,
    CurrentTurn,
    NationComponent,
    Player,
    PlayerCount,
    Rondel,
  },
  data: () => {
    return {
      board: "",
      buildingFactory: false,
      game: {},
      gameStarted: false,
      importStatus: {
        active: false,
        endImport: Action.import({ placements: new Set() }),
        placements: [],
        targets: [],
      },
      maneuverStatus: {
        active: false,
        endManeuver: Action.endManeuver(),
        origin: "",
      },
      playerCounts: [2, 3, 4, 5, 6],
      players: new Set(),
      purchasingBond: false,
      webSocket: new WebSocket("ws://localhost:8080/ws"),
    };
  },
  mounted() {
    this.webSocket.onmessage = (message) => {
      const envelope = JSON.parse(message.data);
      switch (envelope.kind) {
        case "setId":
          this.setWebsocketId(envelope.data.id);
          break;
        case "updatePlayers":
          // TODO: I'm not a fan of JSON.parse after we've already JSON.parsed already
          this.players = new Set(JSON.parse(envelope.data.players));
          for (const player of this.players) {
            if (localStorage.imperialId === player.id) {
              this.name = player.name;
            }
          }
          if (this.players.size == 2) {
            this.startGame();
          }
          break;
      }
    };
  },
  methods: {
    setWebsocketId: function (newId) {
      const oldId = localStorage.getItem("imperialId");
      if (oldId) {
        this.webSocket.send(
          JSON.stringify({
            kind: "updateId",
            data: { oldId, newId },
          })
        );
      }
      localStorage.setItem("imperialId", newId);
    },
    registerPlayer: function () {
      this.webSocket.send(
        JSON.stringify({
          kind: "updateName",
          data: { name: this.name, id: localStorage.imperialId },
        })
      );
    },
    startGame: function (playerCount) {
      const players = this.getPlayers(playerCount);
      this.game = Imperial.fromLog([Action.initialize({ players })]);
      this.gameStarted = true;
    },
    selectAction(_, slot) {
      for (const action of this.game.availableActions) {
        if (action.payload.slot === slot) {
          this.tickWithAction(action);
        }
      }
    },
    validSlots() {
      let slots = [];
      for (const action of this.game.availableActions) {
        if (action.type === "rondel") {
          slots.push(action.payload.slot);
        }
      }
      return slots;
    },
    getPlayers: function (playerCount) {
      switch (playerCount) {
        case 2:
          return [
            { id: "Henry Davison", nation: Nation.AH },
            { id: "Georg Siemens", nation: Nation.IT },
          ];
        case 3:
          return [
            { id: "Henry Davison", nation: Nation.AH },
            { id: "Georg Siemens", nation: Nation.IT },
            { id: "John Baring", nation: Nation.FR },
          ];
        case 4:
          return [
            { id: "Henry Davison", nation: Nation.AH },
            { id: "Georg Siemens", nation: Nation.IT },
            { id: "John Baring", nation: Nation.FR },
            { id: "Henri Germain", nation: Nation.GE },
          ];
        case 5:
          return [
            { id: "Henry Davison", nation: Nation.AH },
            { id: "Georg Siemens", nation: Nation.IT },
            { id: "John Baring", nation: Nation.FR },
            { id: "Henri Germain", nation: Nation.GE },
            { id: "Johann Heinrich Schröder", nation: Nation.RU },
          ];
        case 6:
          return [
            { id: "Henry Davison", nation: Nation.AH },
            { id: "Georg Siemens", nation: Nation.IT },
            { id: "John Baring", nation: Nation.FR },
            { id: "Henri Germain", nation: Nation.GE },
            { id: "Johann Heinrich Schröder", nation: Nation.RU },
            { id: "Gerson von Bleichröder", nation: Nation.GB },
          ];
      }
    },
    assignNations: function (players) {
      return [
        { id: players[0].name, nation: Nation.AH },
        { id: players[1].name, nation: Nation.IT },
      ];
    },
    tickWithAction: function (action) {
      if (action.type === "rondel" && action.payload.slot === "import") {
        this.importStatus.active = true;
      }
      if (action.type === "rondel" && action.payload.slot === "investor") {
        this.purchasingBond = true;
      }
      if (action.type === "bondPurchase") {
        this.purchasingBond = false;
      }
      if (action.type === "rondel" && action.payload.slot === "factory") {
        this.buildingFactory = true;
      }
      if (action.type === "buildFactory") {
        this.buildingFactory = false;
      }
      this.game.tick(action);
      if (
        action.type === "rondel" &&
        (action.payload.slot === "maneuver1" ||
          action.payload.slot === "maneuver2")
      ) {
        this.maneuverStatus.active = true;
      }
      if (action.type === "maneuver") {
        const el = document.getElementById(action.payload.origin);
        el.removeAttribute("filter");
      }
    },
    actionToText: function (action) {
      if (action.type === "buildFactory") {
        return `Build factory in ${action.payload.province}`;
      } else if (action.type === "bondPurchase") {
        return `Purchase a ${action.payload.nation.value} bond for ${action.payload.cost}`;
      } else if (action.type === "endManeuver") {
        return `End maneuver`;
      } else if (action.type === "coexist") {
        return `Coexist`;
      } else if (action.type === "fight") {
        return `Fight`;
      }
    },
    // TODO: runImport and endManeuver are no longer meaningful but they remain here so that the game is somewhat playable.
    // You can import and maneuver but can only submit empty actions for each. Resolve this when we do the full map.
    runImport: function () {
      for (const { payload } of this.game.availableActions) {
        const allowedCombo = payload.placements.map(({ province }) => province);
        const allPlacementsAreAllowed = allowedCombo.sort().every((item) => {
          return this.importStatus.placements.includes(item);
        });
        if (
          allowedCombo.length === this.importStatus.placements.length &&
          allPlacementsAreAllowed
        ) {
          this.importStatus.active = false;
          this.tickWithAction(Action.import(payload));
          this.importStatus.placements = [];
          this.importStatus.targets.forEach((target) => {
            target.parentNode.children[1].removeAttribute("filter");
          });
          this.importStatus.targets = [];
          return;
        }
      }

      this.importStatus.placements = [];
      this.importStatus.targets.forEach((target) => {
        target.parentNode.children[1].removeAttribute("filter");
      });
      this.importStatus.targets = [];
    },
    endManeuver: function (action) {
      this.tickWithAction(action);
      this.maneuverStatus.active = false;
      this.maneuverStatus.origin = "";
    },
  },
};
</script>

<style src="./assets/tailwind.css">
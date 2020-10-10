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
        <Board
          v-bind:select_province="selectProvince"
          v-bind:units="boardUnits()"
          v-bind:valid_provinces="validProvinces()"
        ></Board>
        <Rondel
          v-bind:soloMode="soloMode"
          v-bind:game="game"
          v-bind:name="name"
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
    <div v-else>
      <ul v-for="player in players" v-bind:key="player.name">
        <li v-if="player.name === name">
          <strong>{{ player.name }}</strong>
        </li>
        <li v-else>
          {{ player.name }}
        </li>
      </ul>
      <div v-if="alreadyRegistered()">
        <h3>Waiting for other players...</h3>
      </div>
      <div v-else class="flex flex-col">
        <input
          class="mx-auto m-6 border-black border-solid border-2 p-3 rounded"
          v-model="name"
          placeholder="name"
        />
        <button v-on:click="registerPlayer(name)">Play</button>
      </div>

      <hr class="mt-40" />
      <p class="text-center">Solo mode</p>
      <div class="flex">
        <PlayerCount
          v-for="count in playerCounts"
          v-bind:key="count"
          v-bind:count="count"
          v-bind:start_game="startGame"
        ></PlayerCount>
      </div>
    </div>
  </div>
</template>

<script>
import Imperial from "../lib/imperial.js";
import Action from "../lib/action.js";
import { Nation } from "../lib/constants.js";

import ActionComponent from "./components/ActionComponent.vue";
import Board from "./components/board/Board.vue";
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
      buildingFactory: false,
      soloMode: false,
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
      name: "",
      playerCounts: [2, 3, 4, 5, 6],
      players: new Set(),
      purchasingBond: false,
      webSocket: new WebSocket(process.env.VUE_APP_IMPERIAL_WEBSOCKETS_URL),
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
        case "updateGameLog": {
          // TODO: Find a better way to relay the game log between here and the Go server?
          const rawGameLog = JSON.parse(JSON.parse(envelope.data.gameLog)[0]);
          // The following map only exists because of our custom Nation type, which
          // has weirdness when we attempt nation.when() in the setup file.
          const gameLog = rawGameLog.map((action) => {
            if (action.type === "initialize") {
              action.payload.players = action.payload.players.map((player) => {
                return {
                  id: player.id,
                  nation: Nation[player.nation.value],
                };
              });
            } else if (action.type === "rondel") {
              action.payload.nation = Nation[action.payload.nation.value];
            }
            return action;
          });
          this.game = Imperial.fromLog(gameLog);
        }
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
    alreadyRegistered: function () {
      return [...this.players].map((p) => p.name).includes(this.name);
    },
    startGame: function (playerCount) {
      let players;
      if (playerCount) {
        players = this.getPlayers(playerCount);
      } else {
        players = this.assignNations([...this.players]);
      }
      this.game = Imperial.fromLog([Action.initialize({ players })]);
      this.gameStarted = true;
      this.soloMode = true;
    },
    selectProvince(province) {
      // If the game is in a maneuver and an origin is specified,
      // then the next specified province is the destination
      if (this.maneuverStatus.active && this.maneuverStatus.origin) {
        const maneuver = Action.maneuver({
          origin: this.maneuverStatus.origin,
          destination: province,
        });
        // Reset maneuverStatus
        this.maneuverStatus.origin = "";
        this.tickWithAction(maneuver);
        // If the game is in a maneuver with no origin specified,
        // then the next specified province is the origin
      } else if (this.maneuverStatus.active) {
        this.maneuverStatus.origin = province;
      }
    },
    selectAction(_, slot) {
      if (this.game.currentPlayerName === this.name || this.soloMode) {
        for (const action of this.game.availableActions) {
          if (action.payload.slot === slot) {
            this.tickWithAction(action);
          }
        }
      }
    },
    boardUnits() {
      // This function returns all units on the board.
      // TODO: Distinguish between armies and fleets, and numbers of units.
      let boardUnits = new Map();
      for (const [nation, allUnits] of this.game.units) {
        for (const [province, units] of allUnits) {
          let allUnitsInProvince = new Map();
          if (units.armies > 0 || units.fleets > 0) {
            allUnitsInProvince.set(nation.value, units);
            boardUnits.set(province, allUnitsInProvince);
          }
        }
      }
      return boardUnits;
    },
    validProvinces() {
      // This function returns all provinces that a unit can move to.
      let provinces = new Set();
      for (const action of this.game.availableActions) {
        if (action.type === "maneuver" && this.maneuverStatus.active) {
          if (this.maneuverStatus.origin) {
            provinces.add(action.payload.destination);
          } else {
            provinces.add(action.payload.origin);
          }
        }
      }
      return Array.from(provinces);
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
    // TODO: Don't hardcode the nation assignment, figure out how to accept 2-6 players
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
      this.webSocket.send(
        JSON.stringify({
          kind: "tick",
          data: { gameLog: JSON.stringify(this.game.log) },
        })
      );
      if (
        action.type === "rondel" &&
        (action.payload.slot === "maneuver1" ||
          action.payload.slot === "maneuver2")
      ) {
        this.maneuverStatus.active = true;
      }
      for (const action of this.game.availableActions) {
        if (action.type === "rondel") {
          this.maneuverStatus.active = false;
        }
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
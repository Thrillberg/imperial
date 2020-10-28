<template>
  <div id="app">
    <div v-if="gameStarted">
      <div class="container">
        <ul class="players">
          <Player
            v-for="player in game.players"
            v-bind:player="player"
            v-bind:current_player="controllingPlayerName"
            v-bind:game="game"
            v-bind:key="player.name"
          ></Player>
        </ul>
        <div class="relative">
          <Board
            v-bind:game="game"
            v-bind:select_province="selectProvince"
            v-bind:valid_provinces="validProvinces()"
          ></Board>
          <TaxChart v-bind:taxes="taxes()"></TaxChart>
        </div>
        <PowerPointsChart
          v-bind:power_points="powerPoints()"
        ></PowerPointsChart>
        <Rondel
          v-bind:soloMode="soloMode"
          v-bind:game="game"
          v-bind:name="name"
          v-on:tick-with-action="tickWithAction"
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
      <ul v-for="(game, id) in games" v-bind:key="id">
        <li>
          {{ game.host }} wants to play! ({{ id }})
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
import NationComponent from "./components/NationComponent.vue";
import Player from "./components/Player.vue";
import PlayerCount from "./components/PlayerCount.vue";
import PowerPointsChart from "./components/PowerPointsChart.vue";
import Rondel from "./components/Rondel.vue";
import TaxChart from "./components/TaxChart.vue";

export default {
  name: "App",
  components: {
    ActionComponent,
    Board,
    NationComponent,
    Player,
    PlayerCount,
    PowerPointsChart,
    Rondel,
    TaxChart,
  },
  data: () => {
    return {
      buildingFactory: false,
      controllingPlayerName: "",
      soloMode: false,
      game: {},
      gameId: "",
      games: new Set(),
      gameStarted: false,
      importStatus: {
        active: false,
        endImport: Action.import({ placements: new Set() }),
        placements: [],
      },
      leader: false,
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
  created() {
    this.webSocket.onmessage = (message) => {
      const envelope = JSON.parse(message.data);
      switch (envelope.kind) {
        case "setId":
          this.setWebsocketId(envelope.data.id);
          break;
        case "updatePlayers":
          this.players = new Set(JSON.parse(envelope.data.players));
          for (const player of this.players) {
            if (localStorage.imperialId === player.id) {
              this.name = player.name;
            }
          }
          break;
        case "openGame":
          this.games.add({
            gameId: envelope.data.gameId,
            host: envelope.data.host,
          })
          break;
        case "startGame":
          this.players = new Set(JSON.parse(envelope.data.players));
          this.gameId = envelope.data.gameId
          this.startGame();
          break;
        case "updateGamesList":
          this.games = JSON.parse(envelope.data.games)
          break;
        case "updateGameLog": {
          const rawGameLog = JSON.parse(envelope.data.gameLog);
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
          this.gameStarted = true;
        }
      }
    };
  },
  methods: {
    validProvinces() {
      // This function returns all provinces that a unit can move
      // or be imported to.
      let provinces = new Set();
      for (const action of this.game.availableActions) {
        if (action.type === "maneuver" && this.maneuverStatus.active) {
          if (this.maneuverStatus.origin) {
            provinces.add(action.payload.destination);
          } else {
            provinces.add(action.payload.origin);
          }
        } else if (action.type === "import" && this.importStatus.active) {
          action.payload.placements.forEach((placement) => {
            provinces.add(placement.province);
          });
        }
      }
      return Array.from(provinces);
    },
    taxes() {
      return [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5].map((slot) => {
        let nations = [];
        for (const [nation, data] of this.game.nations) {
          if (data.taxChartPosition === slot) {
            nations.push(nation.value);
          }
        }
        return { slot, nations };
      });
    },
    powerPoints() {
      return [...Array(26).keys()].map((slot) => {
        let nations = [];
        for (const [nation, data] of this.game.nations) {
          if (data.powerPoints === slot) {
            nations.push(nation.value);
          }
        }
        return { slot, nations };
      });
    },
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
          kind: "openGame",
          data: { name: this.name, id: localStorage.imperialId },
        })
      );
      if (this.players.size === 0) {
        this.leader = true;
      }
    },
    alreadyRegistered: function () {
      let out = false
      Object.values(this.games).forEach((game) => {
        Object.keys(game.players).forEach((id) => {
          if (id === localStorage.getItem("imperialId")) {
            console.log('here')
            out = true
          }
        })
      })

      return out
    },
    startGame: function (playerCount) {
      let players;
      if (playerCount) {
        players = this.getPlayers(playerCount);
        this.soloMode = true;
      } else {
        players = this.assignNations([...this.players]);
      }
      const action = Action.initialize({ players });
      this.game = Imperial.fromLog([action]);
      this.gameStarted = true;
      this.controllingPlayerName = this.game.currentPlayerName;
      if (this.leader === true) {
        this.webSocket.send(
          JSON.stringify({
            kind: "tick",
            data: { action: JSON.stringify(action), gameId: JSON.stringify(this.gameId) },
          })
        );
      }
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
        // If the game is in an import, then each specified province
        // gets added to the placements.
      } else if (this.importStatus.active) {
        this.importStatus.placements.push(province);
      }
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
            { id: "Daniel", nation: Nation.RU },
            { id: "Claudia", nation: Nation.FR },
            { id: "Bert", nation: Nation.GB },
            { id: "Anton", nation: Nation.IT },
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
      this.game.tick(action);
      this.controllingPlayerName = this.game.currentPlayerName;
      if (!this.soloMode) {
        this.webSocket.send(
          JSON.stringify({
            kind: "tick",
            data: { action: JSON.stringify(action), gameId: JSON.stringify(this.gameId) },
          })
        );
      }
      if (action.type === "rondel" && action.payload.slot === "import") {
        this.importStatus.active = true;
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
      if (action.type === "rondel" && action.payload.slot === "investor") {
        if (this.game.investorCardActive) {
          this.controllingPlayerName = this.game.investorCardHolder;
        }
        this.purchasingBond = true;
      }
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
    runImport: function () {
      // This function looks for a match between the provided provinces from the UI and the validated
      // provinces from the game logic (this.game.availableActions).
      for (const { payload } of this.game.availableActions) {
        const allowedCombo = payload.placements.map(({ province }) => province);
        // It's not a match if the lengths are different.
        if (payload.placements.length === this.importStatus.placements.length) {
          // JavaScript can't directly compare arrays so we test for equality by looping through both arrays.
          let comboMatches = true;
          for (let i = 0; i < allowedCombo.length; i++) {
            if (allowedCombo[i] !== this.importStatus.placements[i]) {
              comboMatches = false;
            }
          }

          if (comboMatches) {
            this.importStatus.active = false;
            this.tickWithAction(Action.import(payload));
            this.importStatus.placements = [];
            return;
          }
        }
      }
      this.importStatus.placements = [];
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

<template>
  <div>
    <router-link to="/">
      <p class="bg-green-200 cursor-pointer border border-green-200 rounded px-1 m-2 inline-block">Back</p>
    </router-link>
    <div v-if="gameStarted" class="flex justify-between">
      <div class="w-2/3 border border-gray-500 rounded">
        <Board
          :game="game"
          :gameStarted="gameStarted"
          :select_province="selectProvince"
          :valid_provinces="validProvinces()"
          :importing_units="importPlacements"
        ></Board>
      </div>
      <div class="w-1/3 mx-2 border border-gray-500 rounded">
        <GameDetails
          :game="game"
          :controllingPlayerName="controllingPlayerName"
          :profile="profile"
          :importPlacements="importPlacements"
          v-on:tick="tickWithAction"
          v-on:endManeuver="endManeuver"
          v-on:runImport="runImport"
        ></GameDetails>
      </div>
    </div>
    <div v-else class="flex justify-between">
      <div class="w-2/3 border border-gray-500 rounded">
        <Board
          v-bind:game="game"
          v-bind:select_province="() => {}"
          v-bind:valid_provinces="[]"
        ></Board>
      </div>
      <div class="w-1/3 mx-2 border border-gray-500 rounded">
        <div class="text-2xl">
          Game not yet started!
        </div>
      </div>
    </div>
    <GameLogEntry
      v-for="(action, index) in reversedGameLog"
      :action="action"
      :key="index"
    />
  </div>
</template>

<script>
import Action from "../../lib/action.js";
import Imperial from "../../lib/imperial.js";
import { Nation } from "../../lib/constants.js";
import { apiClient } from "../router/index.js";

import Board from "../components/board/Board.vue";
import Flag from "../components/flags/Flag.vue";
import GameDetails from "../components/GameDetails.vue";
import GameLogEntry from "../components/GameLogEntry.vue";

import getGameLog from "../getGameLog.js";

export default {
  name: "Game",
  components: {
    Board,
    Flag,
    GameDetails,
    GameLogEntry
  },
  props: ["profile", "users", "games"],
  data: () => {
    return {
      controllingPlayerName: "",
      currentPlayer: {},
      game: {},
      gameStarted: false,
      importPlacements: [],
      maneuverOrigin: ""
    };
  },
  beforeDestroy() {
    apiClient.clearHandlers();
  },
  mounted() {
    apiClient.onUpdateGameLog(({ gameId, log }) => {
      if (gameId === this.$route.params.id) {
        const gameLog = getGameLog(log);
        this.game = Imperial.fromLog(gameLog);
        if (this.game.players) {
          this.gameStarted = true;
          this.currentPlayer = this.game.players[this.profile.username] || {};
          this.controllingPlayerName = this.game.currentPlayerName;
        }
      }
    });
    apiClient.getGameLog(this.$route.params.id);
  },
  computed: {
    reversedGameLog: function () {
      if (this.game.log) {
        return this.game.log.slice().reverse();
      } else {
        return [];
      }
    }
  },
  methods: {
    validProvinces() {
      // This function returns all provinces that a unit can move
      // or be imported to.
      let provinces = new Set();
      if (this.game.currentPlayerName === this.profile.username || this.game.soloMode) {
        for (const action of this.game.availableActions) {
          if (action.type === "maneuver" && this.game.maneuvering) {
            if (this.maneuverOrigin === action.payload.origin) {
              provinces.add(action.payload.destination);
            } else if (!this.maneuverOrigin) {
              provinces.add(action.payload.origin);
            }
          } else if (action.type === "import" && this.game.importing) {
            action.payload.placements.forEach(placement => {
              provinces.add(placement.province);
            });
          } else if (
            action.type === "buildFactory" &&
            this.game.buildingFactory
          ) {
            provinces.add(action.payload.province);
          }
        }
      }
      return Array.from(provinces);
    },
    selectProvince(province) {
      if (this.game.currentPlayerName === this.profile.username || this.game.soloMode) {
        // If the game is in a maneuver and an origin is specified,
        // then the next specified province is the destination
        if (this.game.maneuvering && this.maneuverOrigin) {
          const maneuver = Action.maneuver({
            origin: this.maneuverOrigin,
            destination: province
          });
          // Reset maneuverStatus
          this.maneuverOrigin = "";
          this.tickWithAction(maneuver);
          // If the game is in a maneuver with no origin specified,
          // then the next specified province is the origin
        } else if (this.game.maneuvering) {
          this.maneuverOrigin = province;
          // If the game is in an import, then each specified province
          // gets added to the placements.
        } else if (this.game.importing) {
          this.importPlacements.push(province);
          if (this.importPlacements.length === 3) {
            this.runImport();
          }
        } else if (this.game.buildingFactory) {
          let factory = {};
          for (const action of this.game.availableActions) {
            if (action.payload.province === province) {
              factory = action;
            }
          }
          this.tickWithAction(factory);
        }
      }
    },
    tickWithAction: function(action) {
      this.controllingPlayerName = this.game.currentPlayerName;
      apiClient.tick(this.$route.params.id, action);
    },
    runImport: function() {
      // TODO: Allow imports of fleets too.
      const placements = this.importPlacements.map(placement => {
        return { province: placement, type: "army" };
      });
      this.tickWithAction(Action.import({ placements }));
      this.importPlacements = [];
      return;
    },
    endManeuver: function() {
      this.tickWithAction(Action.endManeuver());
      this.maneuverOrigin = "";
    }
  }
};
</script>

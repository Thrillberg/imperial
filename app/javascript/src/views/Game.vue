<template>
  <div>
    <EndGame :game="game" />
    <div class="p-2"><b>{{ gameName() }}</b></div>
    <div v-if="gameStarted" class="flex flex-col">
      <div class="flex">
        <NationComponent
          v-for="[nation] of game.nations"
          :current_nation="game.currentNation.value"
          :nation="nation.value"
          :treasury="game.nations.get(nation).treasury"
          :power_points="game.nations.get(nation).powerPoints"
          :tax_chart_position="game.nations.get(nation).taxChartPosition"
          :controller="game.nations.get(nation).controller"
          :current_player="profile.username"
          :key="nation.value"
        ></NationComponent>
      </div>
      <div class="flex justify-between">
        <div class="w-2/3 border border-gray-500 rounded">
          <Board
            :game="game"
            :profile="profile"
            :gameStarted="gameStarted"
            :select_province="selectProvince"
            :valid_provinces="validProvinces()"
            :importing_units="importPlacements"
          ></Board>
        </div>
        <div class="w-1/3 mx-2 border border-gray-500 rounded">
          <GameDetails
            :game="game"
            :chooseImportType="importProvince"
            :controllingPlayerName="controllingPlayerName"
            :profile="profile"
            :importPlacements="importPlacements"
            :online_users="users"
            v-on:tick="tickWithAction"
            v-on:chooseImportType="makeImportTypeChoice"
            v-on:endManeuver="endManeuver"
            v-on:runImport="runImport"
          ></GameDetails>
        </div>
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
    <GameLog
      :log="game.annotatedLog"
    />
  </div>
</template>

<script>
import Action from "../../lib/action.js";
import Imperial from "../../lib/imperial.js";
import { Nation } from "../../lib/constants.js";
import { apiClient } from "../router/index.js";

import Board from "../components/board/Board.vue";
import EndGame from "../components/EndGame.vue";
import Flag from "../components/flags/Flag.vue";
import GameDetails from "../components/GameDetails.vue";
import GameLog from "../components/GameLog.vue";
import NationComponent from "../components/NationComponent.vue";

import getGameLog from "../getGameLog.js";

export default {
  name: "Game",
  components: {
    Board,
    EndGame,
    Flag,
    GameDetails,
    GameLog,
    NationComponent
  },
  props: ["profile", "users", "games"],
  data: () => {
    return {
      importProvince: "",
      controllingPlayerName: "",
      currentPlayer: {},
      game: {},
      gameStarted: false,
      importPlacements: [],
      maneuverOrigin: ""
    };
  },
  created() {
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
    gameName() {
      if (this.games.length > 0) {
        return this.games.find(game => game.id === this.$route.params.id).name
      } else {
        return ""
      }
    },
    updateGameLog(log) {
      const gameLog = getGameLog(log);
      this.game = Imperial.fromLog(gameLog);
      if (this.game.players) {
        this.gameStarted = true;
        this.currentPlayer = this.game.players[this.profile.username] || {};
        this.controllingPlayerName = this.game.currentPlayerName;
      }
    },
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
          if (this.game.board.graph.get(province).factoryType === "shipyard") {
            this.importProvince = province;
          } else {
            this.importPlacements.push({ province, type: "army" });
          }
          if (this.importPlacements.length === this.game.maxImports) {
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
    makeImportTypeChoice: function(type) {
      this.importPlacements.push({ province: this.importProvince, type });
      this.importProvince = "";
      if (this.importPlacements.length === this.game.maxImports) {
        this.runImport();
      }
    },
    runImport: function() {
      const placements = this.importPlacements;
      this.tickWithAction(Action.import({ placements }));
      this.importPlacements = [];
      return;
    },
    endManeuver: function() {
      this.tickWithAction(Action.endManeuver());
      this.maneuverOrigin = "";
    },
  }
};
</script>

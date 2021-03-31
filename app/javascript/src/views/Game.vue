<template>
  <div>
    <div v-if="this.gameLoaded">
      <EndGame :game="game" />
      <div class="p-2"><b>{{ gameName }}</b></div>
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
        <TurnStatus :game="game" :profile="profile" :controllingPlayerName="controllingPlayerName"></TurnStatus>
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
            <div class="flex justify-center my-2">
              <div
                v-if="this.game.log.length > 1"
                class="rounded p-2 mx-2 bg-green-800 text-white cursor-pointer"
                @click="back"
              >
                ◀
              </div>
              <div
                v-else
                class="rounded p-2 mx-2 bg-gray-600 text-white cursor-not-allowed"
              >
                ◀
              </div>
              <div
                v-if="poppedTurns.length > 0"
                class="rounded p-2 mx-2 bg-green-800 text-white cursor-pointer"
                @click="forward"
              >
                ▶
              </div>
              <div
                v-else
                class="rounded p-2 mx-2 bg-gray-600 text-white cursor-not-allowed"
              >
                ▶
              </div>
            </div>
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
        <GameLog
          :log="game.annotatedLog"
        />
      </div>
      <div v-else-if="gameCancelled()">
        This game was cancelled by the host
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
          <div v-if="hostingThisGame">
            <div class="mx-auto p-2 text-center">
              <b>Players:</b>
              <span>{{ playersInGame(game.id).join(", ") }}</span>
            </div>
            <button
              @click="startGame('standard')"
              class="rounded bg-green-800 text-white cursor-pointer block text-2xl hover:bg-green-900 p-10 m-10 mx-auto"
            >
              Start Standard Game
            </button>
            <button
              @click="startGame('auction')"
              class="rounded bg-green-800 text-white cursor-pointer block text-2xl hover:bg-green-900 p-10 m-10 mx-auto"
            >
              Start Auction Variant Game
            </button>
            <button
              @click="startGame('withoutInvestorCard')"
              class="rounded bg-green-800 text-white cursor-pointer block text-2xl hover:bg-green-900 p-10 m-10 mx-auto"
            >
              Start Game Without Investor Card
            </button>
            <button
              @click="cancelGame"
              class="rounded bg-red-500 text-white cursor-pointer block text-2xl hover:bg-red-600 p-5 m-5 mx-auto"
            >
              Cancel Game
            </button>
          </div>
          <div v-else-if="playingInThisGame" class="text-2xl m-2">
            Game not yet started!
          </div>
          <div v-else>
            <div class="mx-auto p-2 text-center">
              <b>Players:</b>
              <span>{{ playersInGame(game.id).join(", ") }}</span>
            </div>
            <button
              @click="joinGame"
              class="rounded bg-green-800 text-white cursor-pointer block text-2xl hover:bg-green-900 p-10 m-10 mx-auto"
            >
              Join This Game
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-2xl mt-8">
      Loading game
    </div>
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
import TurnStatus from "../components/TurnStatus.vue";

import getGameLog from "../getGameLog.js";

export default {
  name: "Game",
  components: {
    Board,
    EndGame,
    Flag,
    GameDetails,
    GameLog,
    NationComponent,
    TurnStatus
  },
  props: ["profile", "users", "games"],
  data: () => {
    return {
      importProvince: "",
      controllingPlayerName: "",
      currentPlayer: {},
      game: {},
      gameLoaded: false,
      gameStarted: false,
      importPlacements: [],
      maneuverOrigin: "",
      poppedTurns: []
    };
  },
  created() {
    apiClient.getGameLog(this.$route.params.id);
  },
  computed: {
    gameName() {
      const game = this.games.find(game => game.id === this.$route.params.id);
      if (game) {
        return game.name
      } else {
        return ""
      }
    },
    reversedGameLog: function () {
      if (this.game.log) {
        return this.game.log.slice().reverse();
      } else {
        return [];
      }
    },
    playingInThisGame() {
      const game = this.games.find(game => game.id === this.$route.params.id);
      if (game?.players.includes(this.profile.username)) {
        return true
      } else {
        return false
      }
    },
    hostingThisGame() {
      const game = this.games.find(game => game.id === this.$route.params.id);
      if (game?.host === this.profile.username) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    playersInGame() {
      const game = this.games.find(game => game.id === this.$route.params.id);
      if (game) {
        return game.players
      } else {
        return []
      }
    },
    joinGame() {
      apiClient.joinGame(this.$cookies.get("user_id"), this.$route.params.id, this.profile.username);
    },
    startGame(variant) {
      const game = this.games.find(game => game.id === this.$route.params.id);
      const playerNames = this.playerNames(game);
      let players = this.shuffle(playerNames);
      if (variant === "standard") {
        players = this.assignNations(players);
      }
      const soloMode = game.soloMode;
      const action = Action.initialize({ players, soloMode, variant });
      apiClient.tick(game.id, action);
    },
    cancelGame() {
      const game = this.games.find(game => game.id === this.$route.params.id);
      apiClient.cancel(game.id);
      this.$router.push("/");
    },
    gameCancelled() {
      const game = this.games.find(game => game.id === this.$route.params.id);
      return game.cancelledAt;
    },
    playerNames: function(game) {
      if (game.players.length === 1) {
        game.soloMode = true;
        game.players.push("Charles", "Louis", "Otto", "Henry", "Conrad");
        return game.players;
      }
      game.soloMode = false;
      return game.players;
    },
    shuffle: function(players) {
      let currentIndex = players.length,
        temporaryValue,
        randomIndex;

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = players[currentIndex];
        players[currentIndex] = players[randomIndex];
        players[randomIndex] = temporaryValue;
      }

      return players.map(player => {
        return { id: player }
      });
    },
    assignNations: function(players) {
      switch (players.length) {
        case 2:
          return [
            { id: players[0].id, nation: Nation.AH },
            { id: players[1].id, nation: Nation.IT }
          ];
        case 3:
          return [
            { id: players[0].id, nation: Nation.AH },
            { id: players[1].id, nation: Nation.IT },
            { id: players[2].id, nation: Nation.FR }
          ];
        case 4:
          return [
            { id: players[0].id, nation: Nation.AH },
            { id: players[1].id, nation: Nation.IT },
            { id: players[2].id, nation: Nation.FR },
            { id: players[3].id, nation: Nation.GB }
          ];
        case 5:
          return [
            { id: players[0].id, nation: Nation.AH },
            { id: players[1].id, nation: Nation.IT },
            { id: players[2].id, nation: Nation.FR },
            { id: players[3].id, nation: Nation.GB },
            { id: players[4].id, nation: Nation.GE }
          ];
        case 6:
          return [
            { id: players[0].id, nation: Nation.AH },
            { id: players[1].id, nation: Nation.IT },
            { id: players[2].id, nation: Nation.FR },
            { id: players[3].id, nation: Nation.GB },
            { id: players[4].id, nation: Nation.GE },
            { id: players[5].id, nation: Nation.RU }
          ];
      }
    },
    updateGameLog(log) {
      this.poppedTurns = [];
      const gameLog = getGameLog(log);
      this.$delete(this.game);
      this.game = Imperial.fromLog(gameLog);
      if (Object.keys(this.game.players).length > 0) {
        this.gameStarted = true;
        this.currentPlayer = this.game.players[this.profile.username] || {};
        this.controllingPlayerName = this.game.currentPlayerName;
      }
      this.gameLoaded = true;
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
    selectProvince(inputProvince) {
      const province = inputProvince.replace(/\.*\s/gm, "").toLowerCase();
      let provinceIsValid = false;
      for (const validProvince of this.validProvinces()) {
        if (validProvince === province) {
          provinceIsValid = true;
        }
      }
      if (!provinceIsValid) {
        this.maneuverOrigin = "";
        return;
      }
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
      if (this.poppedTurns.length === 0) {
        apiClient.tick(this.$route.params.id, action);
      }
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
    back: function() {
      this.poppedTurns.push(this.game.log.pop());
      const log = this.game.log;
      this.$delete(this.game);
      this.game = Imperial.fromLog(log);
    },
    forward: function() {
      const nextTurn = this.poppedTurns.pop();
      this.game.log.push(nextTurn);
      const log = this.game.log;
      this.$delete(this.game);
      this.game = Imperial.fromLog(log);
    }
  }
};
</script>

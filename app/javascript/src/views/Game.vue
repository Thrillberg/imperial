<template>
  <div>
    <div v-if="this.gameLoaded">
      <div class="p-2">
        <b>{{ gameData.name }} <span v-if="gameData.clonedFromGame">(clone)</span></b>
        <span v-if="gameData.clonedFromGame && gameStarted" class="cursor-pointer underline text-xs" @click="goToSourceGame">
          Back to source game
        </span>
        <span v-else-if="gameStarted" class="cursor-pointer underline text-xs" @click="cloneGame">
          Clone game
        </span>
      </div>
      <div v-if="gameStarted" class="flex flex-col">
        <TurnStatus :game="game" :profile="profile" :controllingPlayerName="controllingPlayerName"></TurnStatus>
        <div class="flex flex-wrap justify-between">
          <div class="border border-gray-500 rounded overflow-hidden" :class="mapWidth()">
            <Board
              :game="game"
              :profile="profile"
              :gameStarted="gameStarted"
              :select_province="selectProvince"
              :valid_provinces="validProvinces()"
              :importing_units="importPlacements"
              v-if="game.baseGame === 'imperial'"
            ></Board>
            <Board2030
              :game="game"
              :profile="profile"
              :gameStarted="gameStarted"
              :select_province="selectProvince"
              :valid_provinces="validProvinces()"
              :importing_units="importPlacements"
              v-if="game.baseGame === 'imperial2030'"
            ></Board2030>
            <ControlPanel
              :game="game"
              :chooseImportType="importProvince"
              :controllingPlayerName="controllingPlayerName"
              :profile="profile"
              :importPlacements="importPlacements"
              :gameData="gameData"
              @tick="tickWithAction"
              @endManeuver="endManeuver"
              @chooseImportType="makeImportTypeChoice"
              @runImport="runImport"
              @skipBuildFactory="skipBuildFactory"
            />
          </div>
          <div class="border border-gray-500 rounded text-sm" :class="gameDetailsWidth()">
            <div class="flex flex-wrap justify-between">
              <NationComponent
                v-for="[nation] of game.nations"
                :current_nation="game.currentNation.value"
                :nation="nation.value"
                :treasury="game.nations.get(nation).treasury"
                :canPayOut="canPayOut(nation)"
                :power_points="game.nations.get(nation).powerPoints"
                :controller="game.nations.get(nation).controller"
                :current_player="profile.username"
                :baseGame="game.baseGame"
                :winner="game.winner"
                :key="nation.value"
              ></NationComponent>
            </div>
            <GameDetails
              :game="game"
              :gameData="gameData"
              :controllingPlayerName="controllingPlayerName"
              :profile="profile"
              :online_users="users"
              :show_tax_chart="game.baseGame === 'imperial'"
              @tick="tickWithAction"
            ></GameDetails>
          </div>
        </div>
        <div v-if="game.winner">
          <NationControlChart :game="game" />
        </div>
        <div class="m-2">
          Observers:
          <ul>
            <li v-for="observer in observers" :key="observer">
              {{ observer }}
            </li>
          </ul>
        </div>
        <GameLog
          :log="game.annotatedLog"
          :logTimestamps="logTimestamps"
          :board="board"
        />
      </div>
      <div v-else-if="gameCancelled()">
        This game was cancelled by the host
      </div>
      <div v-else class="flex justify-between">
        <div class="w-2/3 border border-gray-500 rounded overflow-hidden">
          <Board
            v-bind:game="game"
            v-bind:select_province="() => {}"
            v-bind:valid_provinces="[]"
            v-if="gameData.baseGame === 'imperial'"
          ></Board>
          <Board2030
            v-bind:game="game"
            v-bind:select_province="() => {}"
            v-bind:valid_provinces="[]"
            v-if="gameData.baseGame === 'imperial2030'"
          ></Board2030>
        </div>
        <div class="w-1/3 mx-2 border border-gray-500 rounded">
          <div v-if="hostingThisGame">
            <div class="mx-auto p-2 text-center">
              <p>
                <b>Players:</b>
                <span>{{ playersInGame.join(", ") }}</span>
              </p>
              <p>
                <b>Base game:</b>
                <span>{{ baseGameString(gameData.baseGame) }}</span>
              </p>
              <p>
                <b>Variant:</b>
                <span>{{ variant(gameData.variant) }}</span>
              </p>
            </div>
            <button
              @click="startGame"
              class="rounded bg-green-800 text-white cursor-pointer block text-2xl hover:bg-green-900 p-10 m-10 mx-auto"
            >
              Start Game
            </button>
            <button
              @click="cancelGame"
              class="rounded bg-red-500 text-white cursor-pointer block text-2xl hover:bg-red-600 p-5 m-5 mx-auto"
            >
              Cancel Game
            </button>
            <div v-for="player in this.otherPlayersInGame(game.id)" :key="player">
              <button
                @click="boot(player)"
                class="rounded bg-red-500 text-white cursor-pointer block text-2xl hover:bg-red-600 p-5 m-5 mx-auto"
              >
                Boot {{ player }}
              </button>
            </div>
          </div>
          <div v-else-if="playingInThisGame">
            <div class="mx-auto p-2 text-center">
              <p>
                <b>Players:</b>
                <span>{{ playersInGame.join(", ") }}</span>
              </p>
              <p>
                <b>Base game:</b>
                <span>{{ baseGameString(gameData.baseGame) }}</span>
              </p>
              <p>
                <b>Variant:</b>
                <span>{{ variant(gameData.variant) }}</span>
              </p>
            </div>
            <div class="text-2xl m-2">Game not yet started!</div>
          </div>
          <div v-else-if="!joinedGame">
            <div class="mx-auto p-2 text-center">
              <p>
                <b>Players:</b>
                <span>{{ playersInGame.join(", ") }}</span>
              </p>
              <p>
                <b>Base game:</b>
                <span>{{ baseGameString(gameData.baseGame) }}</span>
              </p>
              <p>
                <b>Variant:</b>
                <span>{{ variant(gameData.variant) }}</span>
              </p>
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
import { apiClient } from "../router/index.js";

import Board from "../components/board/Board.vue";
import Board2030 from "../components/board2030/Board2030.vue";
import ControlPanel from "../components/ControlPanel.vue";
import GameDetails from "../components/GameDetails.vue";
import GameLog from "../components/GameLog.vue";
import NationComponent from "../components/NationComponent.vue";
import NationControlChart from "../components/NationControlChart.vue";
import TurnStatus from "../components/TurnStatus.vue";

import getGameLog from "../getGameLog.js";
import assignNations from "../assignNations.js";
import translateToGameData from "../translateToGameData.js";
import imperialBoard from "../../lib/board.js";
import imperial2030Board from "../../lib/board2030.js";

import favicon2 from "../assets/favicon2.ico";
// import notification from "../assets/notification.mp3";

// import { Howl } from "howler";

export default {
  name: "Game",
  components: {
    Board,
    Board2030,
    ControlPanel,
    GameDetails,
    GameLog,
    NationComponent,
    NationControlChart,
    TurnStatus
  },
  props: ["profile", "users", "games", "observers"],
  data: () => {
    return {
      importProvince: "",
      board: {},
      controllingPlayerName: "",
      currentPlayer: {},
      game: {},
      gameData: { players: [] },
      gameLoaded: false,
      gameStarted: false,
      importPlacements: [],
      joinedGame: false,
      logTimestamps: [],
      maneuverOrigin: "",
      poppedTurns: [],
      silenceAudio: true
    };
  },
  created() {
    this.fetchGame();
    window.addEventListener("beforeunload", this.beforeWindowUnload)
    apiClient.userObservingGame(this.profile.username, this.$route.params.id);
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", this.beforeWindowUnload)
  },
  beforeRouteLeave(to, from, next) {
    apiClient.userStoppedObservingGame(this.profile.username, this.$route.params.id);
    next();
  },
  computed: {
    reversedGameLog() {
      if (this.game.log) {
        return this.game.log.slice().reverse();
      } else {
        return [];
      }
    },
    playingInThisGame() {
      let playingInThisGame = false;
      for (const player of this.playersInGame) {
        if (player === this.profile.username) {
          playingInThisGame = true;
        }
      }
      if (playingInThisGame) {
        return true
      } else {
        return false
      }
    },
    hostingThisGame() {
      return this.gameData.host === this.profile.username ? true : false
    },
    playersInGame() {
      return this.games.find(
        game => game.id === this.$route.params.id
      ).players.map(player => player.name);
    }
  },
  methods: {
    fetchGame() {
      fetch(`/api/games/${this.$route.params.id}`)
        .then(response => response.json())
        .then(gameData => {
          this.gameData = translateToGameData(gameData);
          apiClient.getGameLog(this.$route.params.id, this.game.baseGame);
        });
    },
    beforeWindowUnload() {
      apiClient.userStoppedObservingGame(this.profile.username, this.$route.params.id);
    },
    otherPlayersInGame() {
      let players = this.playersInGame;
      return players.filter(player => player !== this.profile.username);
    },
    joinGame() {
      this.joinedGame = true;
      apiClient.joinGame(this.$cookies.get("user_id"), this.$route.params.id, this.profile.username);
    },
    startGame() {
      const playerNames = this.playerNames(this.gameData);
      let players = this.shuffle(playerNames);
      const baseGame = this.gameData.baseGame;
      const variant = this.gameData.variant;
      if (variant === "standard") {
        players = assignNations(players, baseGame);
      }
      const soloMode = this.gameData.soloMode;
      const action = Action.initialize({ players, soloMode, variant, baseGame });
      apiClient.tick(this.gameData.id, action);
    },
    cancelGame() {
      apiClient.cancel(this.gameData.id);
      this.$router.push("/");
    },
    boot(playerName) {
      apiClient.boot(playerName, this.$route.params.id);
    },
    gameCancelled() {
      return this.gameData.cancelledAt;
    },
    playerNames: function(game) {
      if (game.players.length === 1) {
        game.soloMode = true;
        game.players.push(
          {name: "Charles"},
          {name: "Louis"},
          {name: "Otto"},
          {name: "Henry"},
          {name: "Conrad"}
        );
        return game.players.map(player => player.name);
      }
      game.soloMode = false;
      return game.players.map(player => player.name);
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
    updateGameLog(log, logTimestamps) {
      this.logTimestamps = logTimestamps;
      this.poppedTurns = [];
      let baseGame;
      if (log[0]) {
        baseGame = JSON.parse(log[0]).payload.baseGame;
      } else {
        baseGame = this.gameData.baseGame;
      }
      const gameLog = getGameLog(log, baseGame);
      if (baseGame === "imperial") {
        this.board = imperialBoard
      } else if (baseGame === "imperial2030") {
        this.board = imperial2030Board
      }
      this.game = Imperial.fromLog(gameLog, this.board);
      if (Object.keys(this.game.players).length > 0) {
        this.gameStarted = true;
        this.currentPlayer = this.game.players[this.profile.username] || {};
        this.controllingPlayerName = this.game.currentPlayerName;
        this.updateFavicon();
        this.audioNotification();
      }
      apiClient.updateCurrentPlayerName(this.$route.params.id, this.game.currentPlayerName);
      if (this.game.winner) {
        let scores = {};
        for (const name in this.game.players) {
          scores[name] = this.game.players[name].rawScore + this.game.players[name].cash;
        }
        apiClient.updateWinner(this.$route.params.id, this.game.winner, scores);
      }
      this.gameLoaded = true;
      this.silenceAudio = false;
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
            this.importPlacements.push({ province, type: "army", nation: this.game.currentNation.value });
          }
          if (this.importPlacements.length === this.game.maxImports) {
            this.runImport();
          }
        } else if (this.game.buildingFactory) {
          for (const action of this.game.availableActions) {
            if (action.payload.province === province) {
              this.tickWithAction(action);
            }
          }
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
      this.importPlacements.push({ province: this.importProvince, type, nation: this.game.currentNation.value });
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
    skipBuildFactory: function() {
      for (const action of this.game.availableActions) {
        if (action.type === "skipBuildFactory") {
          this.tickWithAction(action);
        }
      }
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
    },
    updateFavicon() {
      if (this.currentPlayer.name === this.game.currentPlayerName) {
        let link = document.createElement("link");
        link.rel = "icon";
        document.getElementsByTagName("head")[0].appendChild(link);
        link.href = favicon2;
      } else {
        let link = document.createElement("link");
        link.rel = "icon";
        document.getElementsByTagName("head")[0].appendChild(link);
        link.href = "/packs/favicon.ico";
      }
    },
    audioNotification() {
      if (this.currentPlayer.name === this.game.currentPlayerName && !this.silenceAudio) {
        // Disabled because this is annoying. Figure out a better way to implement.
        // new Howl({ src: [notification], volume: 0.1 }).play();
      }
    },
    mapWidth() {
      if (this.game.baseGame === "imperial") {
        return "w-7/12"
      } else if (this.game.baseGame === "imperial2030") {
        return "w-full"
      }
    },
    gameDetailsWidth() {
      if (this.game.baseGame === "imperial") {
        return "w-5/12"
      } else if (this.game.baseGame === "imperial2030") {
        return "w-full"
      }
    },
    baseGameString(baseGame) {
      return baseGame === "imperial" ? "Original Imperial" : "Imperial 2030"
    },
    variant(variant) {
      if (variant === "standard") {
        return "Standard (with investor card, no auction)"
      } else if (variant === "auction") {
        return "Auction (with investor card and auction)"
      } else if (variant === "withoutInvestorCard") {
        return "Without Investor Card (with auction, no investor card)"
      }
    },
    cloneGame() {
      fetch(
        "/clone_games",
        {
          method: "POST",
          body: JSON.stringify({
            id: this.$route.params.id,
            host_id: this.profile.id
          }),
          headers: { "Content-Type": "application/json" }
        }
      )
        .then((response) => response.json())
        .then((data) => {
          this.$emit("receiveGameData", data);
          apiClient.getGameLog(data.id, this.game.baseGame);
          this.$router.push(`/game/${data.id}`);
        });
    },
    goToSourceGame() {
      const id = this.gameData.clonedFromGame;
      apiClient.getGameLog(id, this.game.baseGame);
      this.$router.push(`/game/${id}`);
    },
    canPayOut(nation) {
      let totalToPayOut = 0;
      for (const player in this.game.players) {
        for (const bond of this.game.players[player].bonds) {
          if (bond.nation === nation) {
            totalToPayOut += bond.number;
          }
        }
      }

      return this.game.nations.get(nation).treasury >= totalToPayOut;
    }
  }
};
</script>

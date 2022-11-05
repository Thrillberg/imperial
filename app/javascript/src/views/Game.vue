<template>
  <div>
    <div v-if="gameLoaded">
      <div class="p-2">
        <b>{{ gameData.name }} <span v-if="gameData.clonedFromGame">(clone)</span></b>
        <span
          v-if="gameData.clonedFromGame && gameStarted"
          class="cursor-pointer underline text-xs"
          @click="goToSourceGame"
        >
          Back to source game
        </span>
        <span
          v-else-if="gameStarted"
          class="cursor-pointer underline text-xs"
          @click="cloneGame"
        >
          Clone game
        </span>
      </div>
      <div
        v-if="gameStarted"
        class="flex flex-col"
      >
        <TurnStatus
          :game="game"
          :profile="profile"
          :controlling-player-name="controllingPlayerName"
          :paused="paused"
        />
        <div
          v-if="game.baseGame === 'imperial'"
          class="flex flex-wrap items-start"
        >
          <div
            class="flex flex-wrap w-1/12 divide-y divide-gray-500 hidden \
              md:inline-block lg:inline-block xl:inline-block 2xl:inline-block"
          >
            <NationComponent
              v-for="[nation] of game.nations"
              :key="nation.value"
              :current_nation="game.currentNation.value"
              :nation="nation.value"
              :treasury="game.nations.get(nation).treasury"
              :can-pay-out="canPayOut(nation)"
              :power_points="game.nations.get(nation).powerPoints"
              :controller="game.nations.get(nation).controller"
              :current_player="profile.username"
              :base-game="game.baseGame"
              :winner="game.winner"
            />
          </div>
          <div
            class="overflow-hidden"
            :class="mapWidth()"
          >
            <Board
              :config="boardConfig"
              :game="game"
              :game-started="gameStarted"
              :paused="paused"
              :profile="profile"
              :province-with-fight="provinceWithFight"
              :select-province="selectProvince"
              :units-to-import="importPlacements"
              :valid-provinces="validProvinces()"
              @fight-resolved="resolveFight"
            />
            <TaxChart
              :show-bonus="game.baseGame === 'imperial2030'"
              :taxes="taxes()"
            />
            <TimeTravelButtons
              :game="game"
              :popped-turns="poppedTurns"
              @backToGameStartEvent="backToGameStart"
              @backToRoundStartEvent="backToRoundStart"
              @backEvent="back"
              @forwardEvent="forward"
              @forwardToCurrentActionEvent="forwardToCurrentAction"
            />
          </div>
          <div
            class="text-sm"
            :class="gameDetailsWidth()"
          >
            <div
              class="flex flex-wrap divide-y divide-gray-500 \
              md:hidden lg:hidden xl:hidden 2xl:hidden"
            >
              <NationComponent
                v-for="[nation] of game.nations"
                :key="nation.value"
                :current_nation="game.currentNation.value"
                :nation="nation.value"
                :treasury="game.nations.get(nation).treasury"
                :can-pay-out="canPayOut(nation)"
                :power_points="game.nations.get(nation).powerPoints"
                :controller="game.nations.get(nation).controller"
                :current_player="profile.username"
                :base-game="game.baseGame"
                :winner="game.winner"
              />
            </div>
            <GameDetails
              :game="game"
              :game-data="gameData"
              :controlling-player-name="controllingPlayerName"
              :profile="profile"
              :online_users="users"
              :paused="paused"
              :hosting-this-game="hostingThisGame"
              @tick="tickWithAction"
              @toggleTradeIn="toggleTradeIn"
            />
            <ControlPanel
              :game="game"
              :choose-import-type="importProvince"
              :controlling-player-name="controllingPlayerName"
              :profile="profile"
              :import-placements="importPlacements"
              :game-data="gameData"
              :traded-in-bond-nation="tradedInBondNation"
              :traded-in-value="tradedInValue"
              :paused="paused"
              :hosting-this-game="hostingThisGame"
              @tick="tickWithAction"
              @endManeuver="endManeuver"
              @chooseImportType="makeImportTypeChoice"
              @runImport="runImport"
              @skipBuildFactory="skipBuildFactory"
              @purchaseBond="purchaseBond"
            />
            <div v-if="!game.winner">
              <Rondel
                :game="game"
                :name="profile.username"
                :paused="paused"
                :hosting-this-game="hostingThisGame"
                @tick-with-action="tickWithAction"
              />
            </div>
          </div>
        </div>
        <div
          v-if="game.baseGame === 'imperial2030'"
          class="flex flex-wrap items-start"
        >
          <div
            class="border border-gray-500 rounded overflow-hidden"
            :class="mapWidth()"
          >
            <Board
              :config="boardConfig"
              :game="game"
              :game-started="gameStarted"
              :paused="paused"
              :profile="profile"
              :province-with-fight="provinceWithFight"
              :select-province="selectProvince"
              :units-to-import="importPlacements"
              :valid-provinces="validProvinces()"
              @fight-resolved="resolveFight"
            />
            <TimeTravelButtons
              :game="game"
              :popped-turns="poppedTurns"
              @backToGameStartEvent="backToGameStart"
              @backToRoundStartEvent="backToRoundStart"
              @backEvent="back"
              @forwardEvent="forward"
              @forwardToCurrentActionEvent="forwardToCurrentAction"
            />
            <ControlPanel
              :game="game"
              :choose-import-type="importProvince"
              :controlling-player-name="controllingPlayerName"
              :profile="profile"
              :import-placements="importPlacements"
              :game-data="gameData"
              :traded-in-bond-nation="tradedInBondNation"
              :traded-in-value="tradedInValue"
              :paused="paused"
              :hosting-this-game="hostingThisGame"
              @tick="tickWithAction"
              @endManeuver="endManeuver"
              @chooseImportType="makeImportTypeChoice"
              @runImport="runImport"
              @skipBuildFactory="skipBuildFactory"
              @purchaseBond="purchaseBond"
            />
          </div>
          <div
            class="border border-gray-500 rounded text-sm"
            :class="gameDetailsWidth()"
          >
            <div class="flex flex-wrap justify-between">
              <NationComponent
                v-for="[nation] of game.nations"
                :key="nation.value"
                :current_nation="game.currentNation.value"
                :nation="nation.value"
                :treasury="game.nations.get(nation).treasury"
                :can-pay-out="canPayOut(nation)"
                :power_points="game.nations.get(nation).powerPoints"
                :controller="game.nations.get(nation).controller"
                :current_player="profile.username"
                :base-game="game.baseGame"
                :winner="game.winner"
              />
            </div>
            <TaxChart
              :show-bonus="game.baseGame === 'imperial2030'"
              :taxes="taxes()"
            />
            <GameDetails
              :game="game"
              :game-data="gameData"
              :controlling-player-name="controllingPlayerName"
              :profile="profile"
              :online_users="users"
              :paused="paused"
              :hosting-this-game="hostingThisGame"
              @tick="tickWithAction"
              @toggleTradeIn="toggleTradeIn"
            />
            <div v-if="!game.winner">
              <Rondel
                :game="game"
                :name="profile.username"
                :paused="paused"
                :hosting-this-game="hostingThisGame"
                @tick-with-action="tickWithAction"
              />
            </div>
          </div>
        </div>
        <div v-if="game.winner">
          <NationControlChart :game="game" />
        </div>
        <div class="m-2">
          Observers:
          <ul>
            <li
              v-for="observer in observers"
              :key="observer"
            >
              {{ observer }}
            </li>
          </ul>
        </div>
        <GameLog
          :log="game.annotatedLog"
          :log-timestamps="logTimestamps"
          :board="board"
        />
      </div>
      <div v-else-if="gameCancelled()">
        This game was cancelled by the host
      </div>
      <div
        v-else
        class="flex flex-wrap justify-between"
      >
        <div class="w-full sm:w-2/3 border border-gray-500 rounded overflow-hidden">
          <Board
            :config="boardConfig"
            :game="game"
            :game-started="gameStarted"
            :paused="paused"
            :profile="profile"
            :province-with-fight="provinceWithFight"
            :select-province="selectProvince"
            :units-to-import="importPlacements"
            :valid-provinces="validProvinces()"
            @fight-resolved="resolveFight"
          />
        </div>
        <div class="w-full sm:w-1/3 border border-gray-500 rounded">
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
              v-if="playersInGame.length === 1"
              class="rounded bg-green-800 text-white cursor-pointer \
              block text-2xl hover:bg-green-900 p-10 m-10 mx-auto"
              @click="startGame"
            >
              Start Solo Game
              <div class="text-xl">
                (sandbox mode)
              </div>
            </button>
            <button
              v-else
              class="rounded bg-green-800 text-white cursor-pointer \
              block text-2xl hover:bg-green-900 p-10 m-10 mx-auto"
              @click="startGame"
            >
              Start Game
            </button>
            <button
              class="rounded bg-red-500 text-white cursor-pointer \
              block text-2xl hover:bg-red-600 p-5 m-5 mx-auto"
              @click="cancelGame"
            >
              Cancel Game
            </button>
            <div
              v-for="player in otherPlayersInGame(game.id)"
              :key="player"
            >
              <button
                class="rounded bg-red-500 text-white cursor-pointer \
                block text-2xl hover:bg-red-600 p-5 m-5 mx-auto"
                @click="boot(player)"
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
            <div class="text-2xl m-2">
              Game not yet started!
            </div>
            <button
              class="rounded bg-red-500 text-white cursor-pointer \
              block text-2xl hover:bg-red-600 p-5 m-5 mx-auto"
              @click="leaveGame(profile.username)"
            >
              Leave game
            </button>
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
              class="rounded bg-green-800 text-white cursor-pointer \
              block text-2xl hover:bg-green-900 p-10 m-10 mx-auto"
              @click="joinGame"
            >
              Join This Game
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="text-center text-2xl mt-8"
    >
      Loading game
    </div>
  </div>
</template>

<script>
import Action from '../../lib/action';
import Imperial from '../../lib/imperial';
import { apiClient } from '../router/index';

import Board from '../components/Board.vue';
import ControlPanel from '../components/ControlPanel.vue';
import GameDetails from '../components/GameDetails.vue';
import GameLog from '../components/GameLog.vue';
import NationComponent from '../components/NationComponent.vue';
import NationControlChart from '../components/NationControlChart.vue';
import Rondel from '../components/Rondel.vue';
import TaxChart from '../components/TaxChart.vue';
import TimeTravelButtons from '../components/TimeTravelButtons.vue';
import TurnStatus from '../components/TurnStatus.vue';

import boardConfigs from '../boardConfigs';
import getGameLog from '../getGameLog';
import assignNations from '../assignNations';
import imperialBoard from '../../lib/board';
import imperial2030Board from '../../lib/board2030';

import favicon2 from '../assets/favicon2.ico';

import { Nation, Nation2030 } from '../../lib/constants';
// import notification from "../assets/notification.mp3";

// import { Howl } from "howler";

export default {
  name: 'Game',
  components: {
    Board,
    ControlPanel,
    GameDetails,
    GameLog,
    NationComponent,
    NationControlChart,
    Rondel,
    TaxChart,
    TimeTravelButtons,
    TurnStatus,
  },
  beforeRouteLeave(to, from, next) {
    apiClient.userStoppedObservingGame(this.profile.username, this.$route.params.id);
    next();
  },
  props: ['profile', 'users', 'gameData', 'games', 'observers'],
  data: () => ({
    importProvince: '',
    board: {},
    controllingPlayerName: '',
    currentPlayer: {},
    game: {},
    gameLoaded: false,
    gameStarted: false,
    importPlacements: [],
    joinedGame: false,
    logTimestamps: [],
    maneuverOrigin: '',
    poppedTurns: [],
    provinceWithFight: '',
    silenceAudio: true,
    tradedInBondNation: '',
    tradedInValue: 0,
  }),
  computed: {
    boardConfig() {
      return boardConfigs[this.game.baseGame];
    },
    reversedGameLog() {
      if (this.game.log) {
        return this.game.log.slice().reverse();
      }
      return [];
    },
    playingInThisGame() {
      let playingInThisGame = false;
      for (const player of this.playersInGame) {
        if (player === this.profile.username) {
          playingInThisGame = true;
        }
      }
      if (playingInThisGame) {
        return true;
      }
      return false;
    },
    hostingThisGame() {
      return this.gameData.host === this.profile.username;
    },
    playersInGame() {
      return this.games.find(
        (game) => game.id === this.$route.params.id,
      ).players.map((player) => player.name);
    },
    paused() {
      if (this.poppedTurns.length > 0) {
        return true;
      }

      return false;
    },
  },
  created() {
    apiClient.getGameLog(this.$route.params.id, this.game.baseGame);
    window.addEventListener('beforeunload', this.beforeWindowUnload);
    apiClient.userObservingGame(this.profile.username, this.$route.params.id);
  },
  updated() {
    document.title = `${this.gameData.name} - Imperial`;
  },
  beforeUnmount() {
    window.removeEventListener('beforeunload', this.beforeWindowUnload);
  },

  methods: {
    beforeWindowUnload() {
      apiClient.userStoppedObservingGame(this.profile.username, this.$route.params.id);
    },
    otherPlayersInGame() {
      const players = this.playersInGame;
      return players.filter((player) => player !== this.profile.username);
    },
    joinGame() {
      this.joinedGame = true;
      apiClient.joinGame(this.$cookies.get('user_id'), this.$route.params.id, this.profile.username);
    },
    startGame() {
      const playerNames = this.playerNames(this.gameData);
      let players = this.shuffle(playerNames);
      const { baseGame } = this.gameData;
      const { variant } = this.gameData;
      if (variant === 'standard') {
        players = assignNations(players, baseGame);
      }
      const { soloMode } = this.gameData;
      const action = Action.initialize({
        players, soloMode, variant, baseGame,
      });
      apiClient.tick(this.gameData.id, action);
    },
    cancelGame() {
      apiClient.cancel(this.gameData.id);
      this.$router.push('/');
    },
    boot(playerName) {
      apiClient.boot(playerName, this.$route.params.id);
    },
    leaveGame(playerName) {
      this.boot(playerName);
      this.$router.push('/');
    },
    gameCancelled() {
      return this.gameData.cancelledAt;
    },
    playerNames(game) {
      if (game.players.length === 1) {
        game.soloMode = true;
        game.players.push(
          { name: 'Charles' },
          { name: 'Louis' },
          { name: 'Otto' },
          { name: 'Henry' },
          { name: 'Conrad' },
        );
        return game.players.map((player) => player.name);
      }
      game.soloMode = false;
      return game.players.map((player) => player.name);
    },
    shuffle(players) {
      let currentIndex = players.length;
      let temporaryValue;
      let randomIndex;

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = players[currentIndex];
        players[currentIndex] = players[randomIndex];
        players[randomIndex] = temporaryValue;
      }

      return players.map((player) => ({ id: player }));
    },
    updateGameLog(log, logTimestamps, baseGame, oldPlayerName) {
      this.logTimestamps = logTimestamps;
      this.poppedTurns = [];
      if (!baseGame) {
        if (log[0]) {
          baseGame = JSON.parse(log[0]).payload.baseGame || 'imperial';
        } else {
          baseGame = this.gameData.baseGame;
        }
      }
      const gameLog = getGameLog(log, baseGame);
      if (baseGame === 'imperial') {
        this.board = imperialBoard;
      } else if (baseGame === 'imperial2030') {
        this.board = imperial2030Board;
      }
      this.game = Imperial.fromLog(gameLog, this.board);
      if (baseGame) {
        this.game.baseGame = baseGame;
      }
      if (Object.keys(this.game.players).length > 0) {
        this.gameStarted = true;
        this.currentPlayer = this.game.players[this.profile.username] || {};
        this.controllingPlayerName = this.game.currentPlayerName;
        this.updateFavicon();
        this.audioNotification();
      }
      if (
        oldPlayerName !== this.game.currentPlayerName
        && oldPlayerName === this.profile.username
      ) {
        apiClient.notifyNextPlayer(this.$route.params.id, this.game.currentPlayerName);
      }
      apiClient.updateCurrentPlayerName(this.$route.params.id, this.game.currentPlayerName);
      if (this.game.winner) {
        const scores = {};
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
      const provinces = new Set();
      if (
        this.game.currentPlayerName === this.profile.username
        || (this.game.soloMode && this.hostingThisGame)
      ) {
        for (const action of this.game.availableActions) {
          if (action.type === 'maneuver' && this.game.maneuvering) {
            if (this.maneuverOrigin === action.payload.origin) {
              provinces.add(action.payload.destination);
            } else if (!this.maneuverOrigin) {
              provinces.add(action.payload.origin);
            }
          } else if (action.type === 'import' && this.game.importing) {
            action.payload.placements.forEach((placement) => {
              provinces.add(placement.province);
            });
          } else if (
            action.type === 'buildFactory'
            && this.game.buildingFactory
          ) {
            provinces.add(action.payload.province);
          }
        }
      }
      return Array.from(provinces);
    },
    selectProvince(inputProvince) {
      const province = inputProvince.replace(/\.*\s/gm, '').toLowerCase();
      let provinceIsValid = false;
      for (const validProvince of this.validProvinces()) {
        if (validProvince === province) {
          provinceIsValid = true;
        }
      }
      if (!provinceIsValid) {
        this.maneuverOrigin = '';
        return;
      }
      if (
        this.game.currentPlayerName === this.profile.username
        || (this.game.soloMode && this.hostingThisGame)
      ) {
        // If the game is in a maneuver and an origin is specified,
        // then the next specified province is the destination
        if (this.game.maneuvering && this.maneuverOrigin) {
          const maneuver = Action.maneuver({
            origin: this.maneuverOrigin,
            destination: province,
          });
          // Reset maneuverStatus
          this.maneuverOrigin = '';
          this.tickWithAction(maneuver);
          // If the game is in a maneuver with no origin specified,
          // then the next specified province is the origin
        } else if (this.game.maneuvering) {
          this.maneuverOrigin = province;
          // If the game is in an import, then each specified province
          // gets added to the placements.
        } else if (this.game.importing) {
          if (this.game.board.graph.get(province).factoryType === 'shipyard') {
            this.importProvince = province;
          } else {
            this.importPlacements.push({ province, type: 'army', nation: this.game.currentNation.value });
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
    tickWithAction(action) {
      this.controllingPlayerName = this.game.currentPlayerName;
      if (!this.paused) {
        apiClient.tick(this.$route.params.id, action);
        this.displayFight(action);
      }
    },
    displayFight(action) {
      if (action.type === 'fight') {
        this.provinceWithFight = action.payload.province;
      }
    },
    resolveFight() {
      this.provinceWithFight = '';
    },
    makeImportTypeChoice(type) {
      this.importPlacements.push(
        { province: this.importProvince, type, nation: this.game.currentNation.value },
      );
      this.importProvince = '';
      if (this.importPlacements.length === this.game.maxImports) {
        this.runImport();
      }
    },
    runImport() {
      const placements = this.importPlacements;
      placements.forEach((placement) => delete placement.nation);
      this.tickWithAction(Action.import({ placements }));
      this.importPlacements = [];
    },
    skipBuildFactory() {
      for (const action of this.game.availableActions) {
        if (action.type === 'skipBuildFactory') {
          this.tickWithAction(action);
        }
      }
    },
    endManeuver() {
      this.tickWithAction(Action.endManeuver());
      this.maneuverOrigin = '';
    },
    back() {
      const lastTurn = this.game.log.pop();
      this.poppedTurns.push(lastTurn);
      let lastMoveType = this.game.log[this.game.log.length - 1].type;

      while ((lastMoveType !== 'rondel' && lastMoveType !== 'initialize') || lastMoveType === 'endGame') {
        this.poppedTurns.push(this.game.log.pop());
        lastMoveType = this.game.log[this.game.log.length - 1].type;
      }

      const { log } = this.game;
      const { board } = this.game;

      this.game = Imperial.fromLog(log, board);
    },
    backToRoundStart() {
      const startingNation = this.game.baseGame === 'imperial' ? Nation.AH : Nation2030.RU;
      while ((this.game.log[this.game.log.length - 1].payload.nation !== startingNation) || (this.game.log[this.game.log.length - 1].type !== 'rondel')) {
        this.back();
      }

      // Go back to beginning of startingNation's turn, one more
      const lastTurn = this.game.log.pop();
      this.poppedTurns.push(lastTurn);

      const { log } = this.game;
      const { board } = this.game;
      this.game = Imperial.fromLog(log, board);
    },
    backToGameStart() {
      while (this.game.log[this.game.log.length - 1].type !== 'initialize') {
        this.back();
      }
    },

    forward() {
      const newLog = this.game.log;
      newLog.push(this.poppedTurns.pop());
      while (this.poppedTurns[this.poppedTurns.length - 1]?.type === 'maneuver') {
        newLog.push(this.poppedTurns.pop());
      }
      const { board } = this.game;
      this.game = Imperial.fromLog(newLog, board);
    },
    forwardToCurrentAction() {
      while (this.poppedTurns.length > 0) {
        this.forward();
      }
    },
    updateFavicon() {
      if (this.currentPlayer.name === this.game.currentPlayerName) {
        const link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
        link.href = favicon2;
      } else {
        const link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
        link.href = '/packs/favicon.ico';
      }
    },
    audioNotification() {
      if (this.currentPlayer.name === this.game.currentPlayerName && !this.silenceAudio) {
        // Disabled because this is annoying. Figure out a better way to implement.
        // new Howl({ src: [notification], volume: 0.1 }).play();
      }
    },
    mapWidth() {
      if (this.game.baseGame === 'imperial') {
        return 'w-full sm:w-7/12';
      } if (this.game.baseGame === 'imperial2030') {
        return 'w-full';
      }

      return '';
    },
    gameDetailsWidth() {
      if (this.game.baseGame === 'imperial') {
        return 'w-full sm:w-1/3';
      } if (this.game.baseGame === 'imperial2030') {
        return 'w-full';
      }

      return '';
    },
    baseGameString(baseGame) {
      return baseGame === 'imperial' ? 'Original Imperial' : 'Imperial 2030';
    },
    variant(variant) {
      if (variant === 'standard') {
        return 'Standard (with investor card, no auction)';
      } if (variant === 'auction') {
        return 'Auction (with investor card and auction)';
      } if (variant === 'withoutInvestorCard') {
        return 'Without Investor Card (with auction, no investor card)';
      }

      return '';
    },
    cloneGame() {
      fetch(
        '/clone_games',
        {
          method: 'POST',
          body: JSON.stringify({
            id: this.$route.params.id,
            host_id: this.profile.id,
            log: this.game.log,
          }),
          headers: { 'Content-Type': 'application/json' },
        },
      )
        .then((response) => response.json())
        .then((data) => {
          this.$emit('receiveGameData', data);
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
    },
    toggleTradeIn(bond) {
      if (this.tradedInValue > 0) {
        this.tradedInBondNationValue = '';
        this.tradedInValue = 0;
      } else {
        this.tradedInBondNation = bond.nation.value;
        this.tradedInValue = bond.cost;
      }
    },
    purchaseBond(bond) {
      for (const action of this.game.availableActions) {
        if (
          bond.cost === action.payload.cost
          && bond.nation.value === action.payload.nation.value
          && action.payload.tradeInValue === this.tradedInValue
        ) {
          this.tickWithAction(action);
          this.tradedInValue = 0;
        }
      }
    },
    taxes() {
      if (this.game.baseGame === 'imperial') {
        return [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5].map((slot) => {
          const nations = [];
          for (const [nation, data] of this.game.nations) {
            if (data.taxChartPosition === slot) {
              nations.push(nation.value);
            }
          }
          const powerPointIncrease = slot - 5;
          return { slot, nations, powerPointIncrease };
        });
      } if (this.game.baseGame === 'imperial2030') {
        const taxes = [18, 16, 15, 14, 13, 12, 11, 10, 8, 6, 5];
        return taxes.map((slot, index) => {
          const nations = [];
          for (const [nation, data] of this.game.nations) {
            if (data.taxChartPosition >= slot) {
              nations.push(nation.value);
            }
          }
          const powerPointIncrease = taxes.length - index - 1;
          let bonus;
          switch (slot) {
            case 5: {
              bonus = 0;
              break;
            }
            case 6: {
              bonus = 1;
              break;
            }
            case 8: {
              bonus = 1;
              break;
            }
            case 10: {
              bonus = 2;
              break;
            }
            case 11: {
              bonus = 2;
              break;
            }
            case 12: {
              bonus = 3;
              break;
            }
            case 13: {
              bonus = 3;
              break;
            }
            case 14: {
              bonus = 4;
              break;
            }
            case 15: {
              bonus = 4;
              break;
            }
            case 16: {
              bonus = 5;
              break;
            }
            case 18: {
              bonus = 5;
              break;
            }
            default: {
              bonus = 0;
              break;
            }
          }
          return {
            slot, nations, powerPointIncrease, bonus,
          };
        });
      }

      return {};
    },
  },
};
</script>

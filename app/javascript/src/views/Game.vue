<template>
  <v-sheet>
    <v-row align="center">
      <v-col>
        <span class="text-h5 mr-2">{{ gameData.name }} <span v-if="gameData.clonedFromGame">(clone)</span></span>
        <v-btn
          v-if="gameData.clonedFromGame && gameStarted"
          size="x-small"
          @click="goToSourceGame"
        >
          Back to source game
        </v-btn>
        <v-btn
          v-else-if="gameStarted"
          size="x-small"
          @click="cloneGame"
        >
          Clone game
        </v-btn>
      </v-col>
    </v-row>
    <v-sheet v-if="gameStarted">
      <TurnStatus
        :game="game"
        :profile="profile"
        :controlling-player-name="controllingPlayerName"
        :paused="paused"
      />

      <v-row>
        <v-col>
          <v-card>
            <v-layout>
              <v-sheet>
                <div class="d-flex">
                  <v-tabs
                    v-model="tab"
                    optional
                    direction="vertical"
                    color="primary-darken-1"
                  >
                    <v-tab>
                      <v-icon size="x-large">
                        mdi-fullscreen
                      </v-icon>
                    </v-tab>
                    <v-tab value="nations">
                      <v-icon size="x-large">
                        mdi-flag
                      </v-icon>
                    </v-tab>
                    <v-tab value="players">
                      <v-icon size="x-large">
                        mdi-account-group
                      </v-icon>
                    </v-tab>
                    <v-tab value="gameLog">
                      <v-icon size="x-large">
                        mdi-script-text-outline
                      </v-icon>
                    </v-tab>
                  </v-tabs>

                  <v-window v-model="tab">
                    <v-window-item />
                    <v-window-item value="nations">
                      <NationComponent
                        v-for="[nation] of game.nations"
                        :key="nation.value"
                        :current-nation="game.currentNation.value"
                        :nation="nation.value"
                        :treasury="game.nations.get(nation).treasury"
                        :can-pay-out="canPayOut(nation)"
                        :power-points="game.nations.get(nation).powerPoints"
                        :controller="game.nations.get(nation).controller"
                        :current-player="profile.username"
                        :base-game="game.baseGame"
                        :winner="game.winner"
                      />
                    </v-window-item>

                    <v-window-item value="players">
                      <GameDetails
                        :game="game"
                        :game-data="gameData"
                        :controlling-player-name="controllingPlayerName"
                        :profile="profile"
                        :online-users="users"
                        :paused="paused"
                        :hosting-this-game="hostingThisGame"
                        @tick="tickWithAction"
                        @toggle-trade-in="toggleTradeIn"
                      />
                    </v-window-item>

                    <v-window-item value="gameLog">
                      <GameLog
                        :log="game.annotatedLog"
                        :log-timestamps="logTimestamps"
                        :board="board"
                      />
                    </v-window-item>
                  </v-window>
                </div>
              </v-sheet>
              <v-main>
                <v-sheet>
                  <v-row>
                    <v-col
                      cols="12"
                      class="mx-auto"
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
                        @back-to-game-start-event="backToGameStart"
                        @back-to-round-start-event="backToRoundStart"
                        @back-event="back"
                        @forward-event="forward"
                        @forward-to-current-action-event="forwardToCurrentAction"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="11"
                      class="mx-auto"
                    >
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
                        @end-maneuver="endManeuver"
                        @choose-import-type="makeImportTypeChoice"
                        @run-import="runImport"
                        @skip-build-factory="skipBuildFactory"
                        @purchase-bond="purchaseBond"
                        @toggle-trade-in="toggleTradeIn"
                      />
                    </v-col>
                  </v-row>
                  <v-row
                    v-if="!game.winner"
                    style="margin-bottom: 50px"
                  >
                    <v-col>
                      <Rondel
                        :game="game"
                        :name="profile.username"
                        :paused="paused"
                        :hosting-this-game="hostingThisGame"
                        @tick-with-action="tickWithAction"
                      />
                    </v-col>
                  </v-row>
                </v-sheet>
                <div v-if="game.winner">
                  <!-- <NationControlChart :game="game" /> -->
                </div>
              </v-main>
            </v-layout>
          </v-card>
        </v-col>
      </v-row>
    </v-sheet>
    <div v-else-if="gameCancelled()">
      This game was cancelled by the host
    </div>
    <div v-else>
      <v-row>
        <v-col cols="8">
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
        </v-col>
        <div v-if="hostingThisGame">
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
          <v-btn
            v-if="playersInGame.length === 1"
            color="primary-darken-1"
            class="mt-2"
            block
            @click="startGame"
          >
            Start Solo Game (sandbox mode)
          </v-btn>
          <v-btn
            v-else
            color="primary-darken-1"
            block
            @click="startGame"
          >
            Start Game
          </v-btn>
          <v-btn
            color="error"
            class="mt-2"
            block
            @click="cancelGame"
          >
            Cancel Game
          </v-btn>
          <v-btn
            v-for="player in otherPlayersInGame()"
            :key="player"
            color="error"
            block
            @click="boot(player)"
          >
            Boot {{ player }}
          </v-btn>
        </div>
        <div v-else-if="playingInThisGame">
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
          <div class="text-2xl m-2">
            Game not yet started!
          </div>
          <v-btn
            color="error"
            block
            @click="leaveGame(profile.username)"
          >
          Leave Game
          </v-btn>
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
          <v-btn
            color="primary-darken-1"
            block
            @click="joinGame"
          >
          Join This Game
          </v-btn>
        </div>
      </v-row>
    </div>
  </v-sheet>
</template>

<script>
import { Howl } from 'howler';
import { markRaw } from 'vue';
import Imperial from '../../Domain/ImperialGameCoordinator';
import Action from '../../Domain/action';
import { apiClient } from '../router/index';

import Logger from '../Logger';

import Board from '../components/Board.vue';
import ControlPanel from '../components/ControlPanel.vue';
import GameDetails from '../components/GameDetails.vue';
import GameLog from '../components/GameLog.vue';
import NationComponent from '../components/NationComponent.vue';
import Rondel from '../components/Rondel.vue';
import TimeTravelButtons from '../components/TimeTravelButtons.vue';
import TurnStatus from '../components/TurnStatus.vue';

import imperialBoard from '../../Domain/board';
import imperial2030Board from '../../Domain/board2030';
import imperialAsiaBoard from '../../Domain/boardAsia';
import assignNations from '../assignNations';
import getGameLog from '../getGameLog';

import favicon2 from '../assets/favicon2.ico';
import favicon3 from '../assets/favicon3.ico';

import { Nation, Nation2030 } from '../../Domain/constants';
import notification from '../assets/notification.mp3';

export default {
  name: 'Game',
  components: {
    Board,
    ControlPanel,
    GameDetails,
    GameLog,
    NationComponent,
    // NationControlChart,
    Rondel,
    TimeTravelButtons,
    TurnStatus,
  },
  beforeRouteLeave(to, from, next) {
    apiClient.userStoppedObservingGame(this.profile.username, this.$route.params.id);

    // Set correct favicon
    const link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);

    const itsMyTurnInAGame = this.games.some(
      (game) => game.currentPlayerName === this.profile.username && !game.winner,
    );

    if (itsMyTurnInAGame) {
      link.href = favicon3;
    } else {
      link.href = '/packs/favicon.ico';
    }
    next();
  },
  props: {
    env: { type: String, default: '' },
    games: { type: Array, default: () => [] },
    gameData: { type: Object, default: () => {} },
    observers: { type: Array, default: () => [] },
    profile: { type: Object, default: () => {} },
    users: { type: Array, default: () => [] },
  },
  emits: ['receiveGameData'],
  data: () => ({
    importProvince: '',
    board: {},
    boardConfig: {},
    controllingPlayerName: '',
    currentPlayer: {},
    game: {},
    gameLogDialog: false,
    gameStarted: false,
    importPlacements: [],
    joinedGame: false,
    logTimestamps: [],
    maneuverOrigin: '',
    nationsCard: false,
    playerDialog: false,
    poppedTurns: [],
    provinceWithFight: '',
    silenceAudio: true,
    tab: null,
    tradedInBondNation: '',
    tradedInValue: 0,
  }),
  computed: {
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
    this.getBoardConfig();
    document.title = `${this.gameData.name} - Imperial`;
  },
  beforeUnmount() {
    window.removeEventListener('beforeunload', this.beforeWindowUnload);
  },

  methods: {
    getBoardConfig() {
      if (this.gameData.baseGame === 'imperial') {
        import('../boardConfigs').then((resp) => { this.boardConfig = resp.default.imperial; });
      } else if (this.gameData.baseGame === 'imperial2030') {
        import('../board2030Configs').then((resp) => { this.boardConfig = resp.default.imperial2030; });
      } else if (this.gameData.baseGame === 'imperialAsia') {
        import('../boardAsiaConfigs').then((resp) => { this.boardConfig = resp.default.imperialAsia; });
      }
    },
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
    updateGameLog(log, logTimestamps, baseGameInput, oldPlayerName) {
      this.logTimestamps = logTimestamps;
      this.poppedTurns = [];
      let baseGame = baseGameInput;
      if (!baseGame) {
        if (log[0]) {
          baseGame = JSON.parse(log[0]).payload.baseGame || 'imperial';
        } else {
          ({ baseGame } = this.gameData.baseGame);
        }
      }

      const gameLog = getGameLog(log, baseGame);

      if (baseGame === 'imperial') {
        this.board = imperialBoard;
      } else if (baseGame === 'imperial2030') {
        this.board = imperial2030Board;
      } else if (baseGame === 'imperialAsia') {
        this.board = imperialAsiaBoard;
      }

      this.game = markRaw(new Imperial(this.board, new Logger(this.env, this.gameData.id)));
      if (baseGame) {
        this.game.baseGame = baseGame;
      }
      this.game.tickFromLog(gameLog);

      if (Object.keys(this.game.players).length > 0) {
        this.gameStarted = true;
        this.currentPlayer = this.game.players[this.profile.username] || {};
        this.controllingPlayerName = this.game.currentPlayerName;
        this.updateFavicon();
        this.audioNotification();
      }
      if (
        oldPlayerName !== this.game.currentPlayerName
        && (oldPlayerName === this.profile.username || (
          !oldPlayerName && this.game.currentPlayerName
        ))
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
      this.silenceAudio = false;
    },
    validProvinces() {
      // This function returns all provinces that a unit can move
      // or be imported to.
      const provinces = new Set();

      if (this.game.currentPlayerName === this.profile.username || (this.game.soloMode && this.hostingThisGame)) {
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
          } else if (action.type === 'buildFactory' && this.game.buildingFactory) {
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
          break;
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
      const { baseGame } = this.game;

      this.game = markRaw(new Imperial(this.board, new Logger('replay', this.gameData.id)));
      if (baseGame) {
        this.game.baseGame = baseGame;
      }
      this.game.tickFromLog(log);
    },
    backToRoundStart() {
      const startingNation = this.game.baseGame === 'imperial' ? Nation.AH : Nation2030.RU;
      while ((this.game.log[this.game.log.length - 1].payload.nation !== startingNation)
        || (this.game.log[this.game.log.length - 1].type !== 'rondel')) {
        this.back();
      }

      // Go back to beginning of startingNation's turn, one more
      const lastTurn = this.game.log.pop();
      this.poppedTurns.push(lastTurn);

      const { log } = this.game;
      const { baseGame } = this.game;

      this.game = markRaw(new Imperial(this.board, new Logger('replay', this.gameData.id)));
      if (baseGame) {
        this.game.baseGame = baseGame;
      }
      this.game.tickFromLog(log);
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
      const { baseGame } = this.game;

      this.game = markRaw(new Imperial(this.board, new Logger('replay', this.gameData.id)));
      if (baseGame) {
        this.game.baseGame = baseGame;
      }
      this.game.tickFromLog(newLog);
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
        new Howl({ src: [notification] }).play();
      }
    },
    // mapWidth() {
    //   if (this.game.baseGame === 'imperial' || this.game.baseGame === 'imperialAsia') {
    //     return 'w-full sm:w-7/12';
    //   } if (this.game.baseGame === 'imperial2030') {
    //     return 'w-full';
    //   }

    //   return '';
    // },
    // gameDetailsWidth() {
    //   if (this.game.baseGame === 'imperial' || this.game.baseGame === 'imperialAsia') {
    //     return 'w-full sm:w-1/3';
    //   } if (this.game.baseGame === 'imperial2030') {
    //     return 'w-full';
    //   }

    //   return '';
    // },
    baseGameString(baseGame) {
      switch (baseGame) {
        case 'imperial': return 'Original Imperial';
        case 'imperial2030': return 'Imperial 2030';
        case 'imperialAsia': return 'Imperial Asia';
        default: return 'Imperial';
      }
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
  },
};
</script>

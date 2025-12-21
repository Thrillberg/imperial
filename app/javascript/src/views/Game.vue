<template>
  <v-sheet v-if="loaded">
    <v-tooltip
      text="How to Play Imperial"
      location="bottom"
    >
      <template #activator="{ props }">
        <v-btn
          prepend-icon="$helpCircleOutline"
          variant="plain"
          size="x-large"
          style="position: fixed; z-index: 1; top: calc(100vh - 60px); height: 0px;"
          class="pr-13"
          v-bind="props"
        >
          <v-dialog
            v-model="rulesDialogFromSidebar"
            activator="parent"
            width="75%"
          >
            <v-card>
              <v-card-title>
                <v-toolbar color="surface">
                  How to Play Imperial
                  <template #append>
                    <v-btn
                      icon="$close"
                      @click="rulesDialogFromSidebar = false"
                    />
                  </template>
                </v-toolbar>
              </v-card-title>
              <v-card-subtitle>
                A Brief and Incomplete Guide
              </v-card-subtitle>
              <Rules />
              <v-card-actions>
                <v-btn
                  color="primary-darken-1"
                  block
                  @click="rulesDialogFromSidebar = false"
                >
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-btn>
      </template>
    </v-tooltip>
    <v-row
      :class="playersInGame.length === 1 ? 'bg-secondary' : ''"
      justify="space-between"
      class="py-3"
    >
      <v-col class="my-auto mx-2">
        <span class="text-h5 mr-2">{{ gameData.name }} <span v-if="gameData.clonedFromGame">(clone)</span></span>
        <v-btn
          v-if="gameData.clonedFromGame && gameStarted"
          size="x-small"
          style="vertical-align: super;"
          color="primary"
          @click="goToSourceGame"
        >
          Back to source game
        </v-btn>
        <v-btn
          v-else-if="gameStarted"
          size="x-small"
          style="vertical-align: text-bottom;"
          color="primary"
          @click="cloneGame"
        >
          Clone game
        </v-btn>
      </v-col>
      <v-col class="text-right text-uppercase text-subtitle-2 font-weight-bold my-auto mx-2">
        <span v-if="tab === 'nations'">
          <v-icon
            color="primary-darken-1"
            class="mx-1"
          >$flag</v-icon>
          <span style="vertical-align: sub;">Nation View</span>
        </span>
        <span v-else-if="tab === 'players'">
          <v-icon
            color="primary-darken-1"
            class="mx-1"
          >$accountGroup</v-icon>
          <span style="vertical-align: sub;">Player View</span>
        </span>
        <span v-else-if="tab === 'gameLog'">
          <v-icon
            color="primary-darken-1"
            class="mx-1"
          >$scriptTextOutline</v-icon>
          <span style="vertical-align: sub;">Game Log View</span>
        </span>
      </v-col>
      <v-col
        v-if="playersInGame.length === 1"
        style="text-align: right;"
        class="mx-2"
      >
        <v-dialog
          v-model="rulesDialog"
          activator="parent"
          width="75%"
        >
          <template #activator="{ props }">
            <v-btn
              class="text-none"
              color="primary"
              prepend-icon="$bookOpenVariant"
              v-bind="props"
            >
              How do I play Imperial?
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <v-toolbar color="surface">
                How to Play Imperial
                <template #append>
                  <v-btn
                    icon="$close"
                    @click="rulesDialog = false"
                  />
                </template>
              </v-toolbar>
            </v-card-title>
            <v-card-subtitle>
              A Brief and Incomplete Guide
            </v-card-subtitle>
            <v-card-text>
              <i>
                You're playing a solo hotseat game, which means that you control all the players.
                Explore the rondel on the main game screen for information on what moves each nation can perform.
              </i>
            </v-card-text>
            <Rules />
            <v-card-actions>
              <v-btn
                color="primary-darken-1"
                block
                @click="rulesDialog = false"
              >
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-sheet v-if="gameStarted">
      <TurnStatus
        :game="game"
        :profile="profile"
        :controlling-player-name="controllingPlayerName"
        :controlling-player-id="controllingPlayerId"
        :paused="paused"
      />

      <v-card :class="mdAndUp ? 'd-flex' : ''">
        <v-card :class="mdAndUp ? 'd-flex' : ''">
          <v-tabs
            v-model="tab"
            :direction="mdAndUp ? 'vertical' : 'horizontal'"
            color="primary-darken-1"
            :mandatory="mdAndUp ? false : true"
          >
            <v-tab
              v-if="!mdAndUp"
              value="board"
            >
              <v-tooltip
                text="Board and Rondel"
                location="bottom"
              >
                <template #activator="{ props }">
                  <v-icon
                    v-bind="props"
                    size="x-large"
                  >
                    $fullscreen
                  </v-icon>
                </template>
              </v-tooltip>
            </v-tab>
            <v-tab value="nations">
              <v-tooltip
                text="Nations"
                location="bottom"
              >
                <template #activator="{ props }">
                  <v-icon
                    v-bind="props"
                    size="x-large"
                  >
                    $flag
                  </v-icon>
                </template>
              </v-tooltip>
            </v-tab>
            <v-tab value="players">
              <v-tooltip
                text="Players"
                location="bottom"
              >
                <template #activator="{ props }">
                  <v-icon
                    v-bind="props"
                    size="x-large"
                  >
                    $accountGroup
                  </v-icon>
                </template>
              </v-tooltip>
            </v-tab>
            <v-tab value="gameLog">
              <v-tooltip
                text="Game Log"
                location="bottom"
              >
                <template #activator="{ props }">
                  <v-icon
                    v-bind="props"
                    size="x-large"
                  >
                    $scriptTextOutline
                  </v-icon>
                </template>
              </v-tooltip>
            </v-tab>
          </v-tabs>

          <v-window v-model="tab">
            <v-window-item
              v-if="!mdAndUp"
              value="board"
            >
              <Board
                :config="boardConfig"
                :game="game"
                :game-started="gameStarted"
                :paused="paused"
                :profile="profile"
                :province-with-fight="provinceWithFight"
                :provinces-with-production="provincesWithProduction"
                :select-province="selectProvince"
                :units-to-import="importPlacements"
                :valid-provinces="validProvinces()"
                @fight-resolved="resolveFight"
                @production-resolved="resolveProduction"
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
              <Rondel
                v-if="!game.winner"
                :game="game"
                :name="profile.username"
                :paused="paused"
                :hosting-this-game="hostingThisGame"
                @tick-with-action="tickWithAction"
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
                @end-maneuver="endManeuver"
                @choose-import-type="makeImportTypeChoice"
                @run-import="runImport"
                @skip-build-factory="skipBuildFactory"
                @purchase-bond="purchaseBond"
                @toggle-trade-in="toggleTradeIn"
              />
            </v-window-item>

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
                :time-commitment="timeCommitment(gameData.timeCommitment)"
              />
            </v-window-item>
          </v-window>
        </v-card>
        <v-card-text v-if="mdAndUp">
          <v-sheet
            v-if="
              game.baseGame === 'imperial' ||
                game.baseGame === 'imperialEurope2030' ||
                game.baseGame === 'imperialAsia'
            "
          >
            <v-row>
              <v-col cols="8">
                <Board
                  :config="boardConfig"
                  :game="game"
                  :game-started="gameStarted"
                  :paused="paused"
                  :profile="profile"
                  :province-with-fight="provinceWithFight"
                  :provinces-with-production="provincesWithProduction"
                  :select-province="selectProvince"
                  :units-to-import="importPlacements"
                  :valid-provinces="validProvinces()"
                  @fight-resolved="resolveFight"
                  @production-resolved="resolveProduction"
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
              <v-col cols="4">
                <Rondel
                  v-if="
                    !game.winner"
                  :game="game"
                  :name="profile.username"
                  :paused="paused"
                  :hosting-this-game="hostingThisGame"
                  @tick-with-action="tickWithAction"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
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
          </v-sheet>
          <v-sheet v-else>
            <v-row>
              <v-col>
                <Board
                  :config="boardConfig"
                  :game="game"
                  :game-started="gameStarted"
                  :paused="paused"
                  :profile="profile"
                  :province-with-fight="provinceWithFight"
                  :provinces-with-production="provincesWithProduction"
                  :select-province="selectProvince"
                  :units-to-import="importPlacements"
                  :valid-provinces="validProvinces()"
                  @fight-resolved="resolveFight"
                  @production-resolved="resolveProduction"
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
              <v-col>
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
            <v-row>
              <Rondel
                v-if="!game.winner"
                :game="game"
                :name="profile.username"
                :paused="paused"
                :hosting-this-game="hostingThisGame"
                @tick-with-action="tickWithAction"
              />
            </v-row>
          </v-sheet>
          <NationControlChart
            v-if="game.winner"
            :game="game"
          />
        </v-card-text>
      </v-card>
    </v-sheet>
    <div v-else-if="gameCancelled()">
      This game was cancelled by the host
    </div>
    <div v-else>
      <v-card>
        <v-card-text>
          <v-row>
            <v-col :cols="mdAndUp ? '8' : '12'">
              <Board
                :config="boardConfig"
                :game="game"
                :game-started="gameStarted"
                :paused="paused"
                :profile="profile"
                :province-with-fight="provinceWithFight"
                :provinces-with-production="provincesWithProduction"
                :select-province="selectProvince"
                :units-to-import="importPlacements"
                :valid-provinces="validProvinces()"
                @fight-resolved="resolveFight"
                @production-resolved="resolveProduction"
              />
            </v-col>
            <v-col align-self="center">
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
                <p>
                  <b>Time Commitment:</b>
                  <span>{{ timeCommitment(gameData.timeCommitment) }}</span>
                </p>
                <v-btn
                  v-if="playersInGame.length === 1"
                  color="primary-darken-1"
                  class="mt-2"
                  block
                  @click="startGame(gameData)"
                >
                  Start Solo Game (sandbox mode)
                </v-btn>
                <v-btn
                  v-else
                  color="primary-darken-1"
                  block
                  @click="startGame(gameData)"
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
                  v-if="gameData.players.length < 6"
                  color="primary-darken-1"
                  block
                  @click="joinGame"
                >
                  Join This Game
                </v-btn>
                <div
                  v-else
                  class="mx-auto p-2 text-center"
                >
                  <b>Game is full but not yet started!</b>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
  </v-sheet>
  <v-container
    v-else
    class="text-center"
  >
    <v-progress-circular
      indeterminate
      color="primary-darken-1"
      size="100"
      class="mt-10"
    />
  </v-container>
</template>

<script>
import { Howl } from 'howler';
import { markRaw } from 'vue';
import { useDisplay } from 'vuetify';
import Imperial from '../../Domain/ImperialGameCoordinator';
import Action from '../../Domain/action';
import { apiClient } from '../router/index';

import Logger from '../Logger';

import Board from '../components/Board.vue';
import ControlPanel from '../components/ControlPanel.vue';
import GameDetails from '../components/GameDetails.vue';
import GameLog from '../components/GameLog.vue';
import NationControlChart from '../components/NationControlChart.vue';
import NationComponent from '../components/NationComponent.vue';
import Rondel from '../components/Rondel.vue';
import Rules from '../components/Rules.vue';
import TimeTravelButtons from '../components/TimeTravelButtons.vue';
import TurnStatus from '../components/TurnStatus.vue';

import imperialBoard from '../../Domain/board';
import imperial2030Board from '../../Domain/board2030';
import imperialAsiaBoard from '../../Domain/boardAsia';
import assignNations from '../assignNations';
import getGameLog from '../getGameLog';
import setFavicon from '../setFavicon';

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
    NationControlChart,
    Rondel,
    Rules,
    TimeTravelButtons,
    TurnStatus,
  },
  beforeRouteLeave(to, from, next) {
    // TODO: Uncomment when we want to implement game-observing users
    // apiClient.userStoppedObservingGame(this.profile.username, this.$route.params.id);
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
  setup() {
    const { mdAndUp } = useDisplay();

    return { mdAndUp };
  },
  data: () => ({
    importProvince: '',
    board: {},
    boardConfig: {},
    controllingPlayerName: '',
    controllingPlayerId: '',
    currentPlayer: {},
    game: {},
    gameLogDialog: false,
    gameStarted: false,
    importPlacements: [],
    joinedGame: false,
    loaded: false,
    logTimestamps: [],
    maneuverOrigin: '',
    nationsCard: false,
    playerDialog: false,
    poppedTurns: [],
    provinceWithFight: '',
    provincesWithProduction: [],
    rulesDialog: false,
    rulesDialogFromSidebar: false,
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
      const myGame = this.games.find(
        (game) => game.id === this.$route.params.id,
      );
      if (myGame) {
        return myGame.players.map((player) => player.name);
      }

      return [];
    },
    paused() {
      if (this.poppedTurns.length > 0) {
        return true;
      }

      return false;
    },
  },
  created() {
    apiClient.getGameLog(this.$route.params.id);
    // TODO: Uncomment when we want to implement game-observing users
    // apiClient.userObservingGame(this.profile.username, this.$route.params.id);
    setFavicon(this.games, this.profile, this.$route.params.id);
  },
  updated() {
    this.getBoardConfig();
    document.title = `${this.gameData.name} - Imperial`;
  },
  beforeUnmount() {
    setFavicon(this.games, this.profile, '');
  },

  methods: {
    getBoardConfig() {
      if (this.gameData.baseGame === 'imperial' || this.gameData.baseGame === 'imperialEurope2030') {
        import('../boardConfigs').then((resp) => { this.boardConfig = resp.default.imperial; });
      } else if (this.gameData.baseGame === 'imperial2030') {
        import('../board2030Configs').then((resp) => { this.boardConfig = resp.default.imperial2030; });
      } else if (this.gameData.baseGame === 'imperialAsia') {
        import('../boardAsiaConfigs').then((resp) => { this.boardConfig = resp.default.imperialAsia; });
      }
    },
    // TODO: Uncomment when we want to implement game-observing users
    // beforeWindowUnload() {
    //   apiClient.userStoppedObservingGame(this.profile.username, this.$route.params.id);
    // },
    otherPlayersInGame() {
      const players = this.playersInGame;
      return players.filter((player) => player !== this.profile.username);
    },
    joinGame() {
      this.joinedGame = true;
      apiClient.joinGame(this.$cookies.get('user_id'), this.$route.params.id, this.profile.username);
    },
    startGame(gameData) {
      const playerNames = this.playerNames(gameData);
      let players = this.shuffle(playerNames);
      const { baseGame, variant, soloMode } = gameData;
      if (variant === 'standard') {
        players = assignNations(players, baseGame);
      }
      const action = Action.initialize({
        players, soloMode, variant, baseGame,
      });
      apiClient.tick(gameData.id, action);
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
    updateGameLog(log, logTimestamps, gameData) {
      this.logTimestamps = logTimestamps;
      this.poppedTurns = [];
      let { baseGame } = gameData;
      const oldPlayerName = gameData.currentPlayerName;
      if (!baseGame) {
        if (log[0]) {
          baseGame = JSON.parse(log[0]).payload.baseGame || 'imperial';
        } else {
          ({ baseGame } = gameData.baseGame);
        }
      }

      const gameLog = getGameLog(log, baseGame);

      if (baseGame === 'imperial' || baseGame === 'imperialEurope2030') {
        this.board = imperialBoard;
      } else if (baseGame === 'imperial2030') {
        this.board = imperial2030Board;
      } else if (baseGame === 'imperialAsia') {
        this.board = imperialAsiaBoard;
      }

      this.game = markRaw(new Imperial(this.board, new Logger(this.env, gameData.id)));
      if (baseGame) {
        this.game.baseGame = baseGame;
      }
      this.game.tickFromLog(gameLog);

      if (Object.keys(this.game.players).length > 0) {
        this.controllingPlayerId = '';
        const controllingPlayer = gameData.players.find((player) => player.name === this.game.currentPlayerName);
        if (controllingPlayer) {
          this.controllingPlayerId = controllingPlayer.id;
        }
        this.gameStarted = true;
        this.currentPlayer = markRaw(this.game.players[this.profile.username] || {});
        this.controllingPlayerName = this.game.currentPlayerName;
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

      // First time user is playing a solo game
      if (this.$route.query.solo) {
        this.startGame(gameData);
      }

      this.$router.replace({ query: null });

      this.silenceAudio = false;
      this.loaded = true;
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
        const availableActions = [...this.game.availableActions];
        apiClient.saveSnapshot(
          this.$route.params.id,
          action,
          this.game.toJSONWithLatestAction(action),
          availableActions,
          this.game.log,
        );
        apiClient.tick(this.$route.params.id, action);
        this.displayFight(action);
        this.displayProduction(action);
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
    displayProduction(action) {
      if (
        action.type === 'rondel' && (action.payload.slot === 'production1' || action.payload.slot === 'production2')
      ) {
        const provincesWithProduction = [];
        const homeProvinces = this.game.board.byNation.get(action.payload.nation);
        for (const homeProvince of homeProvinces) {
          const provinceIsOccupied = this.game.provinceIsOccupied(homeProvince, action.payload.nation);
          if (this.game.provinces.get(homeProvince).factory && !provinceIsOccupied) {
            provincesWithProduction.push(homeProvince);
          }
        }
        this.provincesWithProduction = provincesWithProduction;
      }
    },
    resolveProduction() {
      this.provincesWithProduction = [];
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
      let lastMoveType = lastTurn.type;
      this.poppedTurns.push(lastTurn);

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
      const startingNation = (this.game.baseGame === 'imperial' || this.game.baseGame === 'imperialEurope2030')
        ? Nation.AH : Nation2030.RU;
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
      const initializationTurn = this.game.log[0];
      this.poppedTurns = this.game.log.slice(1).reverse();
      const { baseGame } = this.game;

      this.game = markRaw(new Imperial(this.board, new Logger('replay', this.gameData.id)));
      if (baseGame) {
        this.game.baseGame = baseGame;
      }
      this.game.tickFromLog([initializationTurn]);
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
      const newLog = [this.game.log[0], ...this.poppedTurns.reverse()];
      this.poppedTurns = [];
      const { baseGame } = this.game;

      this.game = markRaw(new Imperial(this.board, new Logger('replay', this.gameData.id)));
      if (baseGame) {
        this.game.baseGame = baseGame;
      }
      this.game.tickFromLog(newLog);
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
        case 'imperial': return 'Imperial (Classic)';
        case 'imperialEurope2030': return 'Imperial (2030 Rules)';
        case 'imperial2030': return 'Imperial 2030';
        case 'imperialAsia': return 'Imperial Asia';
        default: return 'Imperial (Classic)';
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
    timeCommitment(timeCommitment) {
      if (timeCommitment === 'infinite') {
        return 'Infinite (no speed commitment)';
      } if (timeCommitment === 'slow') {
        return 'Slow Async (1 every other day)';
      } if (timeCommitment === 'async') {
        return 'Async (1 move per day)';
      } if (timeCommitment === 'live') {
        return 'Live, Fast Async (2+ moves per day)';
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

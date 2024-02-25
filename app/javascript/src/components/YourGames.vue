<template>
  <div class="text-h5">
    Your Games
  </div>
  <v-row
    v-masonry
    item-selector=".game"
  >
    <v-col
      v-for="game of orderedGames"
      :key="game.id"
      v-masonry-tile
      class="game"
      :cols="mdAndUp ? '6' : '12'"
    >
      <router-link
        :to="{ path: '/game/' + game.id }"
        style="text-decoration: none"
      >
        <v-hover>
          <template #default="{ isHovering, props }">
            <v-card
              :title="game.name + (game.players.length === 1 ? ' (solo)' : '')"
              :subtitle="currentPlayer(game)"
              :color="backgroundColor(isHovering, nationColors(JSON.parse(game.latestState).currentNation))"
              v-bind="props"
            >
              <template
                v-if="game.currentPlayerName
                  && game.currentPlayerName === profile.username
                  && !game.winner"
                #prepend
              >
                <v-btn
                  icon="mdi-star"
                  color="yellow"
                />
              </template>
              <v-card-text>
                <Board
                  :config="boardConfigs[game.baseGame]"
                  :game="Imperial.loadFromJSON(JSON.parse(game.latestState))"
                  :game-started="true"
                />
                <v-row v-if="game.latestState">
                  <v-col
                    v-for="player of players(game)"
                    :key="player.name"
                    cols="auto"
                  >
                    <span>{{ player.name }}</span>
                    <Flag
                      v-for="nation of player.nations"
                      :key="nation"
                      :nation="nation"
                      width="30"
                      height="20"
                      class="mx-1"
                    />
                    <br>
                    <span><v-icon icon="mdi-timer-sand" />Time Commitment: {{ timeCommitment(game.timeCommitment) }}</span>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </template>
        </v-hover>
      </router-link>
    </v-col>
  </v-row>
</template>

<script>
import { useDisplay } from 'vuetify';
import Board from './Board.vue';

import nationColors from '../../../../nationColors';
import Imperial from '../../Domain/ImperialGameCoordinator';
import Flag from './flags/Flag.vue';

import toTime from '../toTime';

export default {
  name: 'YourGames',
  components: { Board, Flag },
  props: {
    games: { type: Array, default: () => [] }, profile: { type: Object, default: () => {} },
  },
  async setup() {
    const { mdAndUp } = useDisplay();
    const boardConfigs = {};
    await import('../boardConfigs').then((resp) => {
      boardConfigs.imperial = resp.default.imperial;
      boardConfigs.imperialEurope2030 = resp.default.imperial;
    });
    await import('../board2030Configs').then((resp) => { boardConfigs.imperial2030 = resp.default.imperial2030; });
    await import('../boardAsiaConfigs').then((resp) => { boardConfigs.imperialAsia = resp.default.imperialAsia; });
    return { boardConfigs, mdAndUp };
  },
  computed: {
    orderedGames() {
      return [...this.games].sort((a, b) => {
        if (a.winner === b.winner) {
          return 0;
        } if (a.winner === null) {
          return -1;
        } if (b.winner === null) {
          return 1;
        }
        return 0;
      });
    },
    Imperial() {
      return Imperial;
    },
  },
  methods: {
    backgroundColor(isHovering, color) {
      return isHovering ? color : `${color}88`;
    },
    currentPlayer(game) {
      if (game.winner) {
        return `${game.winner} won!`;
      } if (game.currentPlayerName) {
        return `${game.currentPlayerName}'s turn`;
      } if (game.startedAt) {
        return 'Computer player\'s turn';
      }
      return '';
    },
    players(game) {
      const players = [];

      for (const player of game.players) {
        const playerNations = [];
        const playerObj = { name: player.name };
        const { nations, currentNation } = JSON.parse(game.latestState);

        nations.forEach((nation) => {
          if (nation[Object.keys(nation)[0]].controller === player.name) {
            const nationName = Object.keys(nation)[0];
            playerNations.push(nationName);

            if (currentNation === nationName) {
              playerObj.itsMyTurn = true;
            }
          }
        });

        playerObj.nations = playerNations;
        players.push(playerObj);
      }

      return players;
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
    toTime(date) {
      return toTime(date);
    },
    variant(baseGame) {
      if (baseGame === 'imperial') {
        return 'Imperial (Classic)';
      } if (baseGame === 'imperialEurope2030') {
        return 'Imperial (2030 Rules)';
      } if (baseGame === 'imperial2030') {
        return 'Imperial 2030';
      } if (baseGame === 'imperialAsia') {
        return 'Imperial Asia';
      }
      return '';
    },
    nationColors(nation) {
      return nationColors.nationColors[nation];
    },
  },
};
</script>

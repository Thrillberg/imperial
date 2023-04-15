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
      cols="6"
    >
      <router-link
        :to="{ path: '/game/' + game.id }"
        style="text-decoration: none"
      >
        <v-hover>
          <template #default="{ isHovering, props }">
            <v-card
              :title="game.name + (game.players.length === 1 ? ' (solo)' : '')"
              :subtitle="currentPlayer(game) ? currentPlayer(game) + '\'s turn' : ''"
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
                <v-row>
                  <v-col
                    v-for="nation of JSON.parse(game.latestState).nations"
                    :key="Object.keys(nation)[0]"
                    cols="auto"
                  >
                    <Flag
                      :nation="Object.keys(nation)[0]"
                      width="30"
                      height="20"
                    />
                    {{ nation[Object.keys(nation)[0]].controller }}
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </template>
        </v-hover>
      </router-link>
    </v-col>
  </v-row>
  <div v-if="games.length === 0">
    Uh oh! You aren't in any active games.
  </div>
</template>

<script>
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
    const boardConfigs = {};
    await import('../boardConfigs').then((resp) => { boardConfigs.imperial = resp.default.imperial; });
    await import('../board2030Configs').then((resp) => { boardConfigs.imperial2030 = resp.default.imperial2030; });
    await import('../boardAsiaConfigs').then((resp) => { boardConfigs.imperialAsia = resp.default.imperialAsia; });
    return { boardConfigs };
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
        return game.currentPlayerName;
      } if (game.startedAt) {
        return 'Computer player';
      }
      return '';
    },
    toTime(date) {
      return toTime(date);
    },
    variant(baseGame) {
      if (baseGame === 'imperial') {
        return 'Imperial';
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

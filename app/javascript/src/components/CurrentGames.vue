<template>
  <div class="text-h5 my-4">
    Current Games
  </div>
  <v-row
    v-masonry
    item-selector=".game"
  >
    <v-col
      v-for="game of games"
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
              :subtitle="currentPlayer(game) ? currentPlayer(game) + '\'s turn' : ''"
              :color="backgroundColor(isHovering, nationColors(JSON.parse(game.latestState).currentNation))"
              v-bind="props"
            >
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
                    <span>
                      <v-icon
                        v-if="users.includes(player.name)"
                        color="success"
                        icon="$circle"
                        size="small"
                      />
                      {{ player.name }}
                    </span>
                    <Flag
                      v-for="nation of player.nations"
                      :key="nation"
                      :nation="nation"
                      width="30"
                      height="20"
                      class="mx-1"
                    />
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
import nationColors from '../../../../nationColors';
import toTime from '../toTime';
import Board from './Board.vue';
import Flag from './flags/Flag.vue';

import Imperial from '../../Domain/ImperialGameCoordinator';

export default {
  name: 'CurrentGames',
  components: { Board, Flag },
  props: {
    games: { type: Array, default: () => [] },
    users: { type: Array, default: () => [] },
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
    nationColors(nation) {
      return nationColors.nationColors[nation];
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
  },
};
</script>

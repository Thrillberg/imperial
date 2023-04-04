<template>
  <div class="text-h5">
    Your Games
  </div>
  <v-btn
    href="/games/new"
    class="bg-primary-darken-1"
  >
    New Game
  </v-btn>
  <v-table
    density="compact"
    hover
  >
    <thead>
      <tr>
        <th>Name</th>
        <th>Players</th>
        <th>Current Player</th>
        <th>Last Move At</th>
        <th>Variant</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="game of orderedGames"
        :key="game.id"
      >
        <td>
          <router-link :to="{ path: '/game/' + game.id }">
            <Star
              v-if="game.currentPlayerName
                && game.currentPlayerName === profile.username
                && !game.winner"
            />
            <span>{{ game.name }}</span>
          </router-link>
        </td>
        <td>
          {{ game.players.length }}
        </td>
        <td>
          {{ currentPlayer(game) }}
        </td>
        <td>
          {{ toTime(game.lastMoveAt) }}
        </td>
        <td>
          {{ variant(game.baseGame) }}
        </td>
      </tr>
    </tbody>
  </v-table>
  <div v-if="games.length === 0">
    Uh oh! You aren't in any active games.
  </div>
</template>

<script>
import Star from './Star.vue';

import toTime from '../toTime';
import Board from './Board.vue';

export default {
  name: 'YourGames',
  components: { Star, Board },
  props: {
    games: { type: Array, default: () => [] }, profile: { type: Object, default: () => {} },
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
  },
  methods: {
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
  },
};
</script>

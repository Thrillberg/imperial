<template>
  <div class="p-4">
    <b>Your Games</b>
    <div class="flex border-b border-black mt-2">
      <div class="w-1/3 sm:w-1/5 mx-2">
        <b>Name</b>
      </div>
      <div class="hidden sm:w-1/5 sm:inline-block mx-2">
        <b>Players</b>
      </div>
      <div class="w-1/3 sm:w-1/5 mx-2">
        <b>Current Player</b>
      </div>
      <div class="w-1/3 sm:w-1/5 mx-2">
        <b>Last Move At</b>
      </div>
      <div class="hidden sm:w-1/5 sm:inline-block mx-2">
        <b>Variant</b>
      </div>
    </div>
    <a
      href="/games/new"
      class="rounded bg-green-800 text-white cursor-pointer
      block hover:bg-green-900 py-2 px-4 m-2 inline-block"
    >
      New Game
    </a>
    <div
      v-for="game of orderedGames"
      :key="game.id"
    >
      <router-link
        :to="{ path: '/game/' + game.id }"
        class="flex justify-between items-center py-2"
        :class="game.winner ? 'bg-gray-200' : 'hover:bg-yellow-100'"
      >
        <div class="w-1/3 sm:w-1/5 mx-2">
          <Star
            v-if="game.currentPlayerName
              && game.currentPlayerName === profile.username
              && !game.winner"
          />
          <span>{{ game.name }}</span>
        </div>
        <div class="hidden sm:w-1/5 sm:inline-block mx-2">
          {{ game.players.length }}
        </div>
        <div class="w-1/3 sm:w-1/5 mx-2">
          {{ currentPlayer(game) }}
        </div>
        <div class="w-1/3 sm:w-1/5 mx-2">
          {{ toTime(game.lastMoveAt) }}
        </div>
        <div class="hidden sm:w-1/5 sm:inline-block mx-2">
          {{ variant(game.baseGame) }}
        </div>
      </router-link>
    </div>
    <div v-if="games.length === 0">
      Uh oh! You aren't in any active games.
    </div>
  </div>
</template>

<script>
import Star from './Star.vue';

import toTime from '../toTime';

export default {
  name: 'YourGames',
  components: { Star },
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

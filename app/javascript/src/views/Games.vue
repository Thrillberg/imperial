<template>
  <v-container v-if="loaded">
    <b>All Games</b>
    <div class="flex border-b border-black mt-2">
      <div class="w-1/2">
        <b>Name</b>
      </div>
      <div class="w-1/2">
        <b>Last Move At</b>
      </div>
    </div>
    <div
      v-for="game of games"
      :key="game.id"
    >
      <router-link
        :to="{ path: '/game/' + game.id }"
        class="flex justify-between items-center hover:bg-gray-200 py-2"
      >
        <div class="w-1/2">
          {{ game.name }}
        </div>
        <div class="w-1/2">
          {{ toDate(game.last_move_at) }}
        </div>
      </router-link>
    </div>
  </v-container>
  <v-container v-else class="text-center">
    <v-progress-circular indeterminate color="primary-darken-1" size="100" class="mt-10" />
  </v-container>
</template>

<script>
import { DateTime } from 'luxon';

export default {
  name: 'Games',
  props: { profile: { type: Object, default: () => {} } },
  data: () => ({
    games: [],
    loaded: false,
  }),
  created() {
    document.title = 'Games - Imperial';
    fetch('/api/games', { method: 'GET' })
      .then((response) => response.json())
      .then((data) => { this.games = data; this.loaded = true; });
  },
  methods: {
    toDate(timestamp) {
      return DateTime.fromISO(timestamp).toLocaleString();
    },
  },
};
</script>

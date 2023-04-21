<template>
  <v-container v-if="loaded">
    <b>All Finished Games</b>
    <div class="flex border-b border-black mt-2">
      <div class="w-1/2">
        <b>Name</b>
      </div>
      <div class="w-1/2">
        <b>Winner</b>
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
          {{ game.winner_name }}
        </div>
      </router-link>
    </div>
  </v-container>
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
export default {
  name: 'FinishedGames',
  props: { profile: { type: Object, default: () => {} } },
  data: () => ({
    games: [],
    loaded: false,
  }),
  created() {
    document.title = 'Finished Games - Imperial';
    fetch('/api/games?filter=finished', { method: 'GET' })
      .then((response) => response.json())
      .then((data) => { this.games = data; this.loaded = true; });
  },
};
</script>

<template>
  <v-container>
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
</template>

<script>
export default {
  name: 'FinishedGames',
  props: { profile: { type: Object, default: () => {} } },
  data: () => ({
    games: [],
  }),
  created() {
    document.title = 'Finished Games - Imperial';
    fetch(`${import.meta.env.VITE_API_URL}/api/games?filter=finished`, { method: 'GET' })
      .then((response) => response.json())
      .then((data) => { this.games = data; });
  },
};
</script>

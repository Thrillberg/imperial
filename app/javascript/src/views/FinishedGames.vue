<template>
  <div class="p-4">
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
  </div>
</template>

<script>
export default {
  name: 'FinishedGames',
  props: { profile: Object },
  data: () => ({
    games: [],
  }),
  created() {
    document.title = 'Finished Games - Imperial';
    fetch('/api/games', { method: 'GET' })
      .then((response) => response.json())
      .then((data) => this.games = data.filter((game) => !game.cancelled_at && !game.cloned_from_game && game.winner_name));
  },
};
</script>

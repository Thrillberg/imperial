<template>
  <div class="p-4">
    <b>All Games</b>
    <div class="flex border-b border-black mt-2">
      <div class="w-1/2"><b>Name</b></div>
      <div class="w-1/2"><b>Players</b></div>
    </div>
    <div v-for="game of sortedGames" v-bind:key="game.id">
      <router-link :to="{ path: '/game/' + game.id }" class="flex justify-between items-center hover:bg-gray-200 py-2">
        <div class="w-1/2">{{ game.name }}</div>
        <div class="w-1/2">{{ game.players.join(", ") }}</div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Games",
  props: { games: Array, profile: Object },
  computed: {
    sortedGames() {
      return this.games.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }
  }
}
</script>

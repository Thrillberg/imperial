<template>
  <div class="container mx-auto w-3/4">
    <div class="p-4">
      <p class="pb-4">
      {{ profile.username }} has finished {{ finishedGames.length }} {{ finishedGameString }} and won {{ wonGames.length }} {{ wonGameString }}.
      </p>
      <b>{{ profile.username }}'s Finished Games</b>
      <div class="flex border-b border-black mt-2">
        <div class="w-1/3"><b>Name</b></div>
        <div class="w-1/3"><b>Players</b></div>
        <div class="w-1/3"><b>Winner</b></div>
      </div>
      <div v-for="game of finishedGames" :key="game.id">
        <router-link :to="{ path: '/game/' + game.id }" class="flex justify-between items-center hover:bg-gray-200 py-2">
          <div class="w-1/3">{{ game.name }}</div>
          <div class="w-1/3">{{ game.players.length }}</div>
          <div class="w-1/3">{{ game.winner }}</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "User",
  props: { profile: Object, games: Array },
  computed: {
    finishedGames() {
      return this.games.filter(game => {
        return !!game.winner && game.players.includes(this.profile.username)
      });
    },
    wonGames() {
      return this.finishedGames.filter(game => game.winner === this.profile.username)
    },
    finishedGameString() {
      return this.finishedGames.length === 1 ? "game" : "games"
    },
    wonGameString() {
      return this.wonGames.length === 1 ? "game" : "games"
    }
  }
}
</script>

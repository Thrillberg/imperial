<template>
  <div class="p-4">
    <b>All Games</b>
    <div class="flex border-b border-black mt-2">
      <div class="w-1/2"><b>Name</b></div>
    </div>
    <div v-for="game of games" v-bind:key="game.id">
      <router-link :to="{ path: '/game/' + game.id }" class="flex justify-between items-center hover:bg-gray-200 py-2">
        <div class="w-1/2">{{ game.name }}</div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Games",
  props: { profile: Object },
  data: () => {
    return {
      games: []
    }
  },
  created() {
    fetch("/get_games", { method: "GET" })
      .then(response => response.json())
      .then(data => this.games = data.filter(game => !game.cancelled_at && !game.cloned_from_game_id))
  }
}
</script>

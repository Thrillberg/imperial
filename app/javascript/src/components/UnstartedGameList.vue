<template>
  <div class="p-4">
    <b>Open Games</b>
    <div class="flex justify-between border-b border-black mt-2">
      <div class="w-1/5"><b>Name</b></div>
      <div class="w-1/5"><b>Players</b></div>
      <div class="w-1/5"><b>Host</b></div>
      <div class="w-1/5"><b>Open Since</b></div>
      <div class="w-1/5"></div>
    </div>
    <div v-for="game of games" v-bind:key="game.id">
      <router-link :to="{ path: '/game/' + game.id }" class="flex justify-between items-center hover:bg-gray-200 py-2">
        <div class="w-1/5">{{ game.name }}</div>
        <div class="w-1/5">{{ game.players.length }}</div>
        <div class="w-1/5">{{ game.host }}</div>
        <div class="w-1/5">{{ toTime(game.createdAt) }}</div>
        <div class="w-1/5">
          <button v-if="game.players.length < 6" class="rounded bg-green-800 text-white cursor-pointer block hover:bg-green-900 p-2">
            Join Game
          </button>
          <button v-else class="rounded bg-gray-800 text-white cursor-not-allowed block p-2">
            Game Full
          </button>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import toTime from "../toTime.js";

export default {
  name: "UnstartedGameList",
  props: { games: Array, profile: Object },
  methods: {
    toTime(date) {
      return toTime(date);
    }
  }
}
</script>

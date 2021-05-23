<template>
  <div class="p-4">
    <b>Current Games</b>
    <div class="flex justify-between border-b border-black mt-2">
      <div class="w-1/5"><b>Name</b></div>
      <div class="w-1/5"><b>Players</b></div>
      <div class="w-1/5"><b>Started At</b></div>
      <div class="w-1/5"><b>Last Move At</b></div>
      <div class="w-1/5"></div>
    </div>
    <div v-for="game of games" v-bind:key="game.id">
      <router-link :to="{ path: '/game/' + game.id }" class="flex justify-between items-center hover:bg-gray-200 py-2">
        <div class="w-1/5">{{ game.name }}</div>
        <div class="w-1/5">{{ game.players.length }}</div>
        <div class="w-1/5">{{ toTime(game.startedAt) }}</div>
        <div class="w-1/5">{{ toTime(game.lastMoveAt) }}</div>
        <div class="w-1/5">
          <button class="rounded bg-green-800 text-white cursor-pointer block hover:bg-green-900 p-2">
            View Game
          </button>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import toTime from "../toTime.js";

export default {
  name: "CurrentGames",
  props: { games: Array },
  methods: {
    toTime(date) {
      return toTime(date);
    }
  }
}
</script>

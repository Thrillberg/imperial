<template>
  <div class="p-4">
    <b>Your Games</b>
    <div class="flex border-b border-black mt-2">
      <div class="w-1/3 sm:w-1/5 mx-2"><b>Name</b></div>
      <div class="hidden sm:w-1/5 sm:inline-block mx-2"><b>Players</b></div>
      <div class="w-1/3 sm:w-1/5 mx-2"><b>Current Player</b></div>
      <div class="w-1/3 sm:w-1/5 mx-2"><b>Last Move At</b></div>
      <div class="hidden sm:w-1/5 sm:inline-block mx-2"></div>
    </div>
    <a
      href="/games/new"
      class="rounded bg-green-800 text-white cursor-pointer block hover:bg-green-900 py-2 px-4 m-2 inline-block"
    >
       New Game
    </a>
    <div v-for="game of games" v-bind:key="game.id">
      <router-link :to="{ path: '/game/' + game.id }" class="flex justify-between items-center hover:bg-gray-200 py-2">
        <div class="w-1/3 sm:w-1/5 mx-2">
          <Star v-if="game.currentPlayerName && game.currentPlayerName === profile.username && !game.winner" />
          <span>{{ game.name }}</span>
        </div>
        <div class="hidden sm:w-1/5 sm:inline-block mx-2">{{ game.players.length }}</div>
        <div class="w-1/3 sm:w-1/5 mx-2">{{ currentPlayer(game) }}</div>
        <div class="w-1/3 sm:w-1/5 mx-2">{{ toTime(game.lastMoveAt) }}</div>
        <div class="hidden sm:w-1/5 sm:inline-block mx-2" v-if="!game.winner">
          <button v-if="game.startedAt" class="rounded bg-green-800 text-white cursor-pointer block hover:bg-green-900 p-2">
            View Game
          </button>
          <button v-else class="rounded bg-green-800 text-white cursor-pointer block hover:bg-green-900 p-2">
            Start Game
          </button>
        </div>
        <div v-else class="hidden sm:w-1/5 sm:inline-block mx-2"></div>
      </router-link>
    </div>
    <div v-if="games.length === 0">
      Uh oh! You aren't in any active games.
    </div>
  </div>
</template>

<script>
import Star from "../components/Star.vue";

import toTime from "../toTime.js";

export default {
  name: "YourGames",
  components: { Star },
  props: { games: Array, profile: Object },
  methods: {
    currentPlayer(game) {
      if (game.winner) {
        return game.winner + " won!"
      } else if (game.currentPlayerName) {
        return game.currentPlayerName
      } else if (game.startedAt) {
        return "Computer player"
      }
    },
    toTime(date) {
      return toTime(date);
    }
  }
}
</script>

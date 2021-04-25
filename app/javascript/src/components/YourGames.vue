<template>
  <div class="p-4">
    <b>Your Games</b>
    <div class="flex border-b border-black mt-2">
      <div class="w-1/3"><b>Name</b></div>
      <div class="w-1/3"><b>Players</b></div>
      <div class="w-1/3"><b>Current Player</b></div>
      <div class="w-1/3"></div>
    </div>
    <button
      @click="openGame('imperial')"
      class="rounded bg-green-800 text-white cursor-pointer block text-lg hover:bg-green-900 py-2 px-4 my-2"
    >
      Open a New Imperial Game
    </button>
    <button
      @click="openGame('imperial2030')"
      class="rounded bg-green-800 text-white cursor-pointer block text-lg hover:bg-green-900 py-2 px-4 my-2"
    >
      Open a New Imperial 2030 Game (beta)
    </button>
    <div v-for="game of games" v-bind:key="game.id">
      <router-link :to="{ path: '/game/' + game.id }" class="flex justify-between items-center hover:bg-gray-200 py-2">
        <div class="w-1/3">
          <Star v-if="game.currentPlayerName && game.currentPlayerName === profile.username && !game.winner" />
          <span>{{ game.name }}</span>
        </div>
        <div class="w-1/3">{{ game.players.length }}</div>
        <div class="w-1/3">{{ currentPlayer(game) }}</div>
        <div class="w-1/3" v-if="!game.winner">
          <button v-if="game.currentPlayerName || game.host !== profile.username" class="rounded bg-green-800 text-white cursor-pointer block hover:bg-green-900 p-2">
            View Game
          </button>
          <button v-else class="rounded bg-green-800 text-white cursor-pointer block hover:bg-green-900 p-2">
            Start Game
          </button>
        </div>
      </router-link>
    </div>
    <div v-if="games.length === 0">
      Uh oh! You aren't in any active games.
    </div>
  </div>
</template>

<script>
import { apiClient } from "../router/index.js";

import Star from "../components/Star.vue";

export default {
  name: "YourGames",
  components: { Star },
  props: { games: Array, profile: Object },
  methods: {
    openGame(baseGame) {
      apiClient.openGame(this.$cookies.get("user_id"), baseGame)
        .then(game => {
          this.$router.push(`/game/${game.id}`);
        });
    },
    currentPlayer(game) {
      if (game.winner) {
        return game.winner + " won!"
      } else if (game.currentPlayerName) {
        return game.currentPlayerName
      } else {
        return "Computer player"
      }
    }
  }
}
</script>

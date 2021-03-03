<template>
  <div class="p-4">
    <b>Your Games</b>
    <div class="flex border-b border-black mt-2">
      <div class="w-1/5"><b>Name</b></div>
      <div class="w-1/5"><b>Players</b></div>
      <div class="w-1/5"><b>Variant</b></div>
      <div class="w-1/5"><b>Current Player</b></div>
      <div class="w-1/5"></div>
    </div>
    <button
      @click="openGame"
      class="rounded bg-green-800 text-white cursor-pointer block text-lg hover:bg-green-900 py-2 px-4 my-2"
    >
      Open a New Game
    </button>
    <div v-for="game of games" v-bind:key="game.id">
      <router-link :to="{ path: '/game/' + game.id }" class="flex justify-between items-center hover:bg-gray-200 py-2">
        <div class="w-1/5">
          <Star v-if="game.currentPlayer && game.currentPlayer === profile.username && !game.winner" />
          <span>{{ game.name }}</span>
        </div>
        <div class="w-1/5">{{ game.players.length }}</div>
        <div class="w-1/5">{{ game.variant }}</div>
        <div v-if="game.log.length > 0" class="w-1/5">{{ game.currentPlayer }}'s turn</div>
        <div v-else class="w-1/5" />
        <div class="w-1/5">
          <button v-if="game.log.length > 0 || game.host !== profile.username" class="rounded bg-green-800 text-white cursor-pointer block hover:bg-green-900 p-2">
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
import Action from "../../lib/action.js";
import { apiClient } from "../router/index.js";
import { Nation } from "../../lib/constants.js";

import Star from "../components/Star.vue";

export default {
  name: "YourGames",
  components: { Star },
  props: { games: Array, profile: Object },
  methods: {
    openGame() {
      apiClient.openGame(this.$cookies.get("user_id"))
        .then(game => {
          this.$router.push(`/game/${game.id}`);
        });
    }
  }
}
</script>

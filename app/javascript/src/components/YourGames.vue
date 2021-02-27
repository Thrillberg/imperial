<template>
  <div class="p-4">
    <b>Your Games</b>
    <div class="flex border-b border-black mt-2">
      <div class="w-1/4"><b>Name</b></div>
      <div class="w-1/2"><b>Players</b></div>
      <div class="w-1/4"><b>Current Player</b></div>
    </div>
    <div v-for="game of games" v-bind:key="game.id">
      <router-link :to="{ path: '/game/' + game.id }" class="flex justify-between hover:bg-gray-200 py-2">
        <div class="w-1/4">
          <Star v-if="game.currentPlayer && game.currentPlayer === profile.username && !game.winner" />
          <span>{{ game.name }}</span>
        </div>
        <div class="w-1/2">{{ playersInGame(game.id).join(", ") }}</div>
        <div class="w-1/4">{{ game.currentPlayer }}'s turn</div>
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
    playersInGame: function(gameId) {
      return this.games.find(game => game.id === gameId).players;
    },
    joinable: function(gameId) {
      const game = this.games.find(game => game.id === gameId);
      const inGame = Object.values(game.players).includes(this.profile.username);
      return !inGame && this.profile.username;
    },
    isHost: function(gameId) {
      const game = this.games.find(game => game.id === gameId);
      return game.host === this.profile.username;
    },
    startGameButtonText(playerCount) {
      if (playerCount === 1) {
        return "Start Solo Game"
      } else {
        return `Start Game With ${playerCount} Players`
      }
    }
  }
}
</script>

<template>
  <div class="p-4">
    <b>Open Games</b>
    <div class="flex justify-between border-b border-black mt-2">
      <div class="w-1/4"><b>Name</b></div>
      <div class="w-1/2"><b>Players</b></div>
      <div class="w-1/4"><b>Host</b></div>
    </div>
    <div v-for="game of games" v-bind:key="game.id">
      <router-link :to="{ path: '/game/' + game.id }" class="flex justify-between hover:bg-gray-200 py-2">
        <div class="w-1/4">{{ game.name }}</div>
        <div class="w-1/2">{{ playersInGame(game.id).join(", ") }}</div>
        <div class="w-1/4">{{ game.host }}</div>
      </router-link>
    </div>
  </div>
</template>

<script>
import Action from "../../lib/action.js";
import { apiClient } from "../router/index.js";
import { Nation } from "../../lib/constants.js";

import Star from "../components/Star.vue";

export default {
  name: "UnstartedGameList",
  components: { Star },
  props: { games: Array, profile: Object },
  methods: {
    playersInGame: function(gameId) {
      return this.games.find(game => game.id === gameId).players;
    }
  }
}
</script>

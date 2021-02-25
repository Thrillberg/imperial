<template>
  <div class="flex flex-wrap w-1/2">
    <div v-for="game of games" v-bind:key="game.id" class="mr-3 my-3 p-3 border border-rounded w-2/5">
      <div>
        <Star v-if="game.currentPlayer && game.currentPlayer === profile.username && !game.winner" />
        <router-link
          :to="{ path: '/game/' + game.id }"
          class="text-lg font-bold"
        >
          {{ game.name }}
        </router-link>
      </div>
      <div>
        {{ playersInGame(game.id).join(", ") }}
      </div>
      <router-link
        :to="{ path: '/game/' + game.id }"
        v-if="game.players.includes(profile.username)"
        class="rounded mt-2 p-2 inline-block bg-green-800 text-white cursor-pointer"
      >
        {{ game.currentPlayer }}'s turn
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
  name: "StartedGameList",
  components: { Star },
  props: { games: Array, profile: Object },
  methods: {
    playersInGame: function(gameId) {
      return this.games.find(game => game.id === gameId).players;
    }
  }
}
</script>

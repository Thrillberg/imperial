<template>
  <div class="flex flex-wrap w-1/2">
    <div v-for="game of games" v-bind:key="game.id" class="mr-3 my-3 p-3 border border-rounded w-2/5" :class="game.winner || game.forceEndedAt ? 'bg-gray-300' : ''">
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
        v-if="game.winner"
        class="rounded mt-2 p-2 inline-block bg-green-800 text-white cursor-pointer"
      >
        {{ game.winner }} won!
      </router-link>
      <router-link
        :to="{ path: '/game/' + game.id }"
        v-if="game.forceEndedAt"
        class="rounded mt-2 p-2 inline-block bg-gray-800 text-white cursor-pointer"
      >
        Game was abandoned
      </router-link>
    </div>
  </div>
</template>

<script>
import Star from "../components/Star.vue";

export default {
  name: "GameList",
  components: { Star },
  props: { games: Array, profile: Object },
  computed: {
    activeGames() {
      return this.games.filter(game => {
        return !game.winner && !game.forceEndedAt
      })
    },
    endedGames() {
      return this.games.filter(game => {
        return game.winner || game.forceEndedAt
      })
    }
  },
  methods: {
    playersInGame: function(gameId) {
      return this.games.find(game => game.id === gameId).players;
    },
  }
}
</script>

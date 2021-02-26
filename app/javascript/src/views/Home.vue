<template>
  <div class="container mx-auto">
    <div class="mt-10">
      <div v-if="!profile.registered" class="rounded p-10 mx-auto max-w-4xl bg-green-200">
        <button class="rounded bg-green-800 text-white cursor-pointer text-2xl block mb-10 w-1/2">
          Play as {{ profile.username }}
        </button>
        <button class="rounded bg-green-800 text-white cursor-pointer text-2xl block w-1/2">
          Register an Account
        </button>
      </div>
      <div
        v-on:click="openGame()"
        class="border-2 border-green-800 rounded p-4 mt-2 cursor-pointer inline-block text-lg hover:bg-green-100"
      >
        <b>Open New Game</b>
      </div>
      <UnstartedGameList :games="unstartedGames" :profile="profile"></UnstartedGameList>
      <StartedGameList :games="startedGames" :profile="profile"></StartedGameList>
      <EndedGameList :games="endedGames" :profile="profile"></EndedGameList>
    </div>
  </div>
</template>

<script>
import { apiClient } from "../router/index.js";

import EndedGameList from "../components/EndedGameList.vue";
import StartedGameList from "../components/StartedGameList.vue";
import UnstartedGameList from "../components/UnstartedGameList.vue";

export default {
  name: "Home",
  components: { EndedGameList, StartedGameList, UnstartedGameList },
  props: { profile: Object, users: Array, games: Array },
  computed: {
    unstartedGames() {
      return this.games.filter(game => {
        return game.log.length === 0 && !game.forceEndedAt
      })
    },
    startedGames() {
      return this.games.filter(game => {
        return game.log.length > 0 && !game.winner && !game.forceEndedAt
      })
    },
    endedGames() {
      return this.games.filter(game => {
        return game.winner || game.forceEndedAt
      })
    }
  },
  methods: {
    openGame: function() {
      apiClient.openGame(this.profile.username);
    },
  }
};
</script>

<style src="../assets/tailwind.css" />

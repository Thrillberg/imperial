<template>
  <div class="container mx-auto">
    <div class="mt-4">
      <div class="w-1/3 absolute right-2">
        <div v-if="!profile.registered" class="border-red-500 border-2 rounded p-4 mb-4">
          <div class="text-lg text-red-500">
            <b>Uh oh! You're not registered!</b>
          </div>
          <div>
            You can play a game or two without registering but you might not keep access to your games. If you want to be sure to be able to access your games in the future, please register.
          </div>
          <div class="text-center mt-5">
            <router-link
              :to="{ path: '/register' }"
              class="rounded p-2 mt-2 bg-green-800 text-white cursor-pointer text-lg"
            >
              Register
            </router-link>
          </div>
        </div>
        <div class="border-green-500 border-2 rounded p-4">
          <b>Who's online?</b>
          <div v-for="user in this.users" :key="user">
            {{ user }}
          </div>
        </div>
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
    activeGames() {
      return this.games.filter(game => {
        return !game.winner && !game.forceEndedAt
      })
    },
    unstartedGames() {
      return this.games.filter(game => {
        return game.log.length === 0
      })
    },
    startedGames() {
      return this.games.filter(game => {
        return game.log.length > 0
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

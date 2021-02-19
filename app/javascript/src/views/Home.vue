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
      <ActiveGameList :games="activeGames" :profile="profile"></ActiveGameList>
      <EndedGameList :games="endedGames" :profile="profile"></EndedGameList>
    </div>
  </div>
</template>

<script>
import Action from "../../lib/action.js";
import { Nation } from "../../lib/constants.js";
import { apiClient } from "../router/index.js";

import ActiveGameList from "../components/ActiveGameList.vue";
import EndedGameList from "../components/EndedGameList.vue";

export default {
  name: "Home",
  components: { ActiveGameList, EndedGameList },
  props: { profile: Object, users: Array, games: Array },
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
    openGame: function() {
      apiClient.openGame(this.profile.username);
    },
  }
};
</script>

<style src="../assets/tailwind.css" />

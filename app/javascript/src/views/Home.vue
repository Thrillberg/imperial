<template>
  <div class="container mx-auto">
    <div class="mt-10">
      <div v-if="!profile.anonymity_confirmed_at && !profile.registered" class="flex flex-col items-center rounded p-20 mx-auto max-w-4xl bg-green-200">
        <button
          class="rounded bg-green-800 text-white cursor-pointer text-2xl block w-1/2 hover:bg-green-900 p-10 m-10"
          @click="setAnonymous"
        >
          Play as {{ profile.username }}
        </button>
        <button
          class="rounded bg-green-800 text-white cursor-pointer text-2xl block w-1/2 hover:bg-green-900 p-10 m-10"
          @click="register"
          >
          Register an Account
        </button>
      </div>
      <div v-else class="flex justify-around items-start">
        <button
          @click="openGame"
          class="rounded bg-green-800 text-white cursor-pointer block w-1/4 text-2xl hover:bg-green-900 p-10 m-10"
        >
          Open a New Game
        </button>
        <div class="w-full" v-if="gamesFetched">
          <YourGames :games="yourGames" :profile="profile"></YourGames>
          <UnstartedGameList :games="unstartedGames" :profile="profile"></UnstartedGameList>
        </div>
        <div v-else class="text-center text-2xl mt-8">
          Loading games
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { apiClient } from "../router/index.js";

import EndedGameList from "../components/EndedGameList.vue";
import UnstartedGameList from "../components/UnstartedGameList.vue";
import YourGames from "../components/YourGames.vue";

export default {
  name: "Home",
  components: { UnstartedGameList, YourGames },
  props: { profile: Object, users: Array, games: Array, gamesFetched: Boolean },
  computed: {
    yourGames() {
      return this.games.filter(game => {
        return(
          game.players.includes(this.profile.username) &&
          game.log.length > 0 &&
          !game.forceEndedAt
        )
      })
    },
    unstartedGames() {
      let games = this.games.filter(game => {
        return game.log.length === 0 && !game.forceEndedAt
      });
      return games.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }
  },
  methods: {
    openGame() {
      apiClient.openGame(this.profile.username);
    },
    setAnonymous() {
      fetch(
        "/anonymity_confirmations",
        {
          method: "POST",
          body: JSON.stringify({ id: this.$cookies.get("user_id") }),
          headers: { "Content-Type": "application/json" }
        }
      )
        .then((response) => response.json())
        .then((data) => {
          this.$emit("anonymity_confirmed", data.anonymity_confirmed_at)
        })
    },
    register() {
      this.$router.push("/register");
    }
  }
};
</script>

<style src="../assets/tailwind.css" />

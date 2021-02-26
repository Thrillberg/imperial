<template>
  <div class="container mx-auto">
    <div class="mt-10">
      <div v-if="!anonymous" class="rounded p-20 mx-auto max-w-4xl bg-green-200">
        <button
          class="rounded bg-green-800 text-white cursor-pointer text-2xl block mb-10 w-1/2 hover:bg-green-900"
          @click="setAnonymous"
        >
          Play as {{ profile.username }}
        </button>
        <button class="rounded bg-green-800 text-white cursor-pointer text-2xl block w-1/2 hover:bg-green-900">
          Register an Account
        </button>
      </div>
      <div v-else>
        <button
          @click="openGame()"
          class="rounded bg-green-800 text-white cursor-pointer block w-1/4 text-2xl hover:bg-green-900"
        >
          Open a New Game
        </button>
        <UnstartedGameList :games="unstartedGames" :profile="profile"></UnstartedGameList>
        <StartedGameList :games="startedGames" :profile="profile"></StartedGameList>
        <EndedGameList :games="endedGames" :profile="profile"></EndedGameList>
      </div>
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
  data() {
    return {
      anonymous: false
    }
  },
  mounted() {
    if (this.profile.anonymity_confirmed_at) {
      this.anonymous = true;
    }
  },
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
        .then(() => {
          this.anonymous = true;
        });
    }
  }
};
</script>

<style src="../assets/tailwind.css" />

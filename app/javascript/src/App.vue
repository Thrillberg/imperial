<template>
  <div id="app" class="font-serif">
    <Header :profile="profile" v-on:signOut="signOut" v-on:signedIn="signIn" />
    <router-view :profile="profile" :users="users" :games="games" v-on:registered="register" />
  </div>
</template>

<script>
import { apiClient } from "./router/index.js";
import Imperial from "../lib/imperial.js";
import { Nation } from "../lib/constants.js";

import Header from "./components/Header.vue";

import getGameLog from "./getGameLog.js";

export default {
  name: "App",
  components: { Header },
  data: function () {
    return { profile: {}, users: [], games: new Set() };
  },
  beforeDestroy() {
    apiClient.clearHandlers();
    apiClient.ws.close();
  },
  created() {
    apiClient.onUpdateUsers(({ users }) => {
      this.users = users;
    });
    apiClient.onUpdateGames(({ games }) => {
      this.games = games.map(game => {
        const gameLog = getGameLog(game.log);
        const imperialGame = Imperial.fromLog(gameLog);
        return {
          host: game.host,
          log: game.log,
          players: game.players,
          name: game.name,
          id: game.id,
          currentPlayer: imperialGame.currentPlayerName
        };
      });
    });
    // Fetch user profile
    fetch(`/users/${this.$cookies.get("user_id")}`, { method: "GET" })
      .then(response => response.json())
      .then(({ name, email, registered }) => {
        this.profile = { username: name, email, registered }
      })
  },
  methods: {
    register: function ({username, email}) {
      this.profile = { username, email, registered: true };
    },
    signIn: function ({username, email}) {
      this.profile = { username, email, registered: true };
    },
    signOut: function () {
      this.profile = { username: this.profile.username, registered: true };
    }
  }
};
</script>

<template>
  <div id="app" class="font-serif">
    <Header :profile="profile" v-on:signOut="signOut" v-on:signedIn="signIn" v-on:identified="identify" />
    <router-view :profile="profile" :users="onlineUsers" :games="games" v-on:registered="signIn" />
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
    return { profile: {}, games: new Set(), onlineUsers: [] };
  },
  beforeDestroy() {
    apiClient.clearHandlers();
    apiClient.ws.close();
  },
  created() {
    apiClient.onUpdateUsers(({ users }) => {
      this.onlineUsers = users;
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
          currentPlayer: imperialGame.currentPlayerName,
          winner: imperialGame.winner
        };
      });
    });
    if (this.$cookies.get("user_id")) {
      // Fetch user profile
      fetch(`/users/${this.$cookies.get("user_id")}`, { method: "GET" })
        .then(response => response.json())
        .then(({ name, email, registered }) => {
          if (!name) {
            this.createUserProfile();
          } else {
            this.profile = { username: name, email, registered }
          }
        })
    } else {
      // Create user profile
      this.createUserProfile();
    }
  },
  methods: {
    createUserProfile() {
      fetch("/users", { method: "POST", credentials: "include" })
        .then((response) => response.json())
        .then(({ name }) => {
          this.profile = { username: name }
        });
    },
    identify: function ({username}) {
      this.profile = { username };
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

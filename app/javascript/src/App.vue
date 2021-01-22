<template>
  <div id="app" class="font-serif">
    <Header @registered="onRegister" :username="username" :email="email" />
    <router-view :username="username" :users="users" :games="games" />
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
  data: () => {
    return { username: "", email: "", users: [], games: new Set() };
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
      .then(({ name, email }) => {
        this.username = name
        this.email = email
      })
  },
  methods: {
    onRegister(data) {
      this.users.find(user => user.id === data.id).name = data.name;
      this.username = data.name;
    }
  }
};
</script>

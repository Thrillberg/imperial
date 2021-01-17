<template>
  <div id="app" class="font-serif">
    <Header @registered="onRegister" :username="username" :users="users" />
    <router-view :username="username" :users="users" :games="games" />
  </div>
</template>

<script>
import { apiClient } from "./router/index.js";

import Header from "./components/Header.vue";

export default {
  name: "App",
  components: { Header },
  data: () => {
    return { username: "", users: [], games: new Set() };
  },
  beforeDestroy() {
    apiClient.clearHandlers();
    apiClient.ws.close();
  },
  created() {
    apiClient.onUpdateUsers(({ users }) => {
      this.users = users;
      const user = this.users.find(
        user => this.$cookies.get("user_id") === user.id
      );
      this.username = user.name;
    });
    apiClient.onUpdateGames(({ games }) => {
      this.games = games.map(game => {
        return {
          host: game.host,
          log: game.log,
          players: game.players,
          name: game.name,
          id: game.id
        };
      });
    });
  },
  methods: {
    onRegister(data) {
      this.users.find(user => user.id === data.id).name = data.name;
      this.username = data.name;
    }
  }
};
</script>

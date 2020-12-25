<template>
  <div id="app" class="font-serif">
    <Header :username="username" :users="users" />
    <router-view :username="username" :users="users" :games="games" />
  </div>
</template>

<script>
import { apiClient } from "./router/index.js";

import Header from "@/components/Header.vue";

export default {
  name: "App",
  components: { Header },
  data: () => {
    return { username: "", users: new Set(), games: new Set() };
  },
  beforeDestroy() {
    apiClient.clearHandlers();
    apiClient.ws.close();
  },
  created() {
    apiClient.onUpdateUsers(({ users }) => {
      this.users = new Set(JSON.parse(users));
      for (const user of this.users) {
        if (this.$cookies.get("userId") === user.id) {
          this.username = user.name;
        }
      }
    });
    apiClient.onUpdateGames(({ games }) => {
      const parsedGames = JSON.parse(games);
      this.games = parsedGames.map(game => {
        const parsedGame = JSON.parse(game.game);
        return {
          host: parsedGame.host,
          log: parsedGame.log,
          players: parsedGame.players,
          name: parsedGame.name,
          id: game.id
        };
      });
    });
  }
};
</script>

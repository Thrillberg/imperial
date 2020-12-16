<template>
  <div id="app">
    <router-view
      class="font-serif"
      :username="username"
      :users="users"
      :games="games"
    />
  </div>
</template>

<script>
import { apiClient } from "./router/index.js";
export default {
  name: "App",
  data: () => {
    return { username: "", users: new Set(), games: new Set() };
  },
  destroyed() {
    apiClient.clearHandlers();
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
          id: game.id
        };
      });
    });
  }
};
</script>

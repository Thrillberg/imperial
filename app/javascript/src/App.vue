<template>
  <div id="app"> 
    <Header :profile="profile" v-on:signOut="signOut" v-on:signedIn="signIn" v-on:identified="identify" />
    <router-view :profile="profile" :users="onlineUsers" :games="games" v-on:registered="register" v-on:signedIn="signIn" ref="game" v-if="profileReady" v-on:anonymity_confirmed="anonymityConfirmed"/>
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
    return { profile: {}, profileReady: false, games: [], onlineUsers: [] };
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
          winner: imperialGame.winner,
          forceEndedAt: game.force_ended_at
        };
      });
    });
    apiClient.onUpdateGameLog(({ gameId, log }) => {
      if (gameId === this.$route.params.id) {
        this.$refs.game.updateGameLog(log);
      }
    });
    if (this.$cookies.get("user_id")) {
      // Fetch user profile
      fetch(`/users/${this.$cookies.get("user_id")}`, { method: "GET" })
        .then(response => response.json())
        .then(({ name, email, registered, anonymity_confirmed_at }) => {
          if (!name) {
            this.createUserProfile();
          } else {
            this.profile = { username: name, email, registered, anonymity_confirmed_at }
            this.profileReady = true;
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
        .then(({ id, name }) => {
          this.profile = { username: name };
          apiClient.updateUser(name);
          this.profileReady = true;
        });
    },
    identify: function ({username}) {
      this.profile = { username };
    },
    register: function ({username, email, oldUsername}) {
      this.profile = { username, email, registered: true };
      apiClient.updateUser(username, oldUsername);
      apiClient.updateGames();
    },
    signIn({username, email}) {
      this.profile = { username, email, registered: true };
      apiClient.updateGames();
    },
    signOut: function () {
      this.profile = { username: this.profile.username, registered: true };
    },
    anonymityConfirmed(date) {
      let profile = Object.assign({}, this.profile, { "anonymity_confirmed_at": date });
      this.profile = profile;
    }
  }
};
</script>

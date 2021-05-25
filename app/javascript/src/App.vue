<template>
  <div id="app">
    <div v-if="profileFetched && gamesFetched">
      <Header
        :profile="profile"
        v-on:signOut="signOut"
        v-on:signedIn="signIn"
        v-on:identified="identify"
      />
      <router-view
        :profile="profile"
        :users="onlineUsers"
        :games="games"
        :gamesFetched="gamesFetched"
        :observers="observers"
        v-on:registered="register"
        v-on:signedIn="signIn"
        v-on:anonymity_confirmed="anonymityConfirmed"
        ref="game"
      />
    </div>
    <div v-else class="text-center text-2xl mt-8">
      Loading
    </div>
  </div>
</template>

<script>
import { apiClient } from "./router/index.js";

import Header from "./components/Header.vue";

export default {
  name: "App",
  components: { Header },
  data: function () {
    return {
      profile: {},
      games: [],
      onlineUsers: [],
      observers: [],
      profileFetched: false,
      gamesFetched: false
    };
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
        if (game.id === this.$route.params.id) {
          this.observers = game.observers;
        }
        return {
          host: game.host,
          baseGame: game.base_game,
          players: game.players,
          name: game.name,
          id: game.id,
          currentPlayerName: game.current_player_name,
          winner: game.winner_name,
          forceEndedAt: game.force_ended_at,
          cancelledAt: game.cancelled_at,
          createdAt: game.created_at,
          startedAt: game.started_at,
          observers: game.observers,
          variant: game.variant,
          lastMoveAt: game.last_move_at
        };
      });
      this.gamesFetched = true;
    });
    apiClient.onUpdateGameLog(({ gameId, log, logTimestamps }) => {
      if (gameId === this.$route.params.id) {
        this.$refs.game.updateGameLog(log, logTimestamps);
      }
    });
    if (this.$cookies.get("user_id")) {
      // Fetch user profile
      fetch(`/profiles/${this.$cookies.get("user_id")}`, { method: "GET" })
        .then(response => response.json())
        .then(({ name, email, registered, anonymity_confirmed_at, id }) => {
          if (!name) {
            this.createUserProfile();
          } else {
            this.profile = { username: name, email, registered, anonymity_confirmed_at, id }
            this.profileFetched = true;
          }
        })
    } else {
      // Create user profile
      this.createUserProfile();
    }
  },
  methods: {
    createUserProfile() {
      fetch("/api/users", { method: "POST", credentials: "include" })
        .then((response) => response.json())
        .then(({ name, id }) => {
          this.profile = { username: name, id };
          apiClient.updateUser(name);
          this.profileFetched = true;
        });
    },
    identify: function ({username, id}) {
      this.profile = { username, id };
    },
    register: function ({username, email, oldUsername, id}) {
      this.profile = { username, email, registered: true, id };
      apiClient.updateUser(username, oldUsername);
      apiClient.updateGames();
    },
    signIn({username, email, id}) {
      this.profile = { username, email, registered: true, id };
      apiClient.updateGames();
    },
    signOut: function () {
      this.profile = {};
    },
    anonymityConfirmed(date) {
      let profile = Object.assign({}, this.profile, { "anonymity_confirmed_at": date });
      this.profile = profile;
    }
  }
};
</script>

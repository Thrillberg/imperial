<template>
  <div id="app">
    <div v-if="profileFetched && gamesFetched" class="text-sm sm:text-base">
      <Header
        :profile="profile"
        v-on:signOut="signOut"
        v-on:signedIn="signIn"
        v-on:identified="identify"
        v-on:anonymity_confirmed="anonymityConfirmed"
      />
      <router-view v-slot="{ Component }">
        <component
          :profile="profile"
          :users="onlineUsers"
          :games="games"
          :gamesFetched="gamesFetched"
          :observers="observers"
          :gameData="gameData"
          v-on:registered="register"
          v-on:signedIn="signIn"
          v-on:openGame="openGame"
          v-on:receiveGameData="receiveGameData"
          ref="game"
          :is="Component"
        />
      </router-view>
    </div>
    <div v-else class="text-center text-2xl mt-8">
      Loading
    </div>
  </div>
</template>

<script>
import { apiClient } from "./router/index.js";
import translateToGameData from "./translateToGameData.js";

import Header from "./components/Header.vue";

import favicon2 from "./assets/favicon2.ico";
import favicon3 from "./assets/favicon3.ico";

export default {
  name: "App",
  components: { Header },
  data: function () {
    return {
      profile: {},
      gameData: {},
      games: [],
      onlineUsers: [],
      observers: [],
      profileFetched: false,
      gamesFetched: false
    };
  },
  beforeUnmount() {
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
          this.gameData = translateToGameData(game)
        }
        return translateToGameData(game);
      });
      this.gamesFetched = true;
    });
    apiClient.onUpdateGameLog(({ gameId, log, logTimestamps, game }) => {
      if (gameId === this.$route.params.id) {
        this.gameData = translateToGameData(game);
        this.$refs.game.updateGameLog(
          log,
          logTimestamps,
          this.gameData.baseGame,
          this.gameData.currentPlayerName,
        );
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
  updated() {
    // Set correct favicon
    let link = document.createElement("link");
    link.rel = "icon";
    document.getElementsByTagName("head")[0].appendChild(link);

    const itsMyTurnInThisGame = this.games.find(game => {
      return game.currentPlayerName === this.profile.username &&
        game.id === this.$route.params.id
    });
    const itsMyTurnInAGame = this.games.some(
      game => game.currentPlayerName === this.profile.username
    );

    if (itsMyTurnInThisGame) {
      link.href = favicon2;
    } else if (itsMyTurnInAGame) {
      link.href = favicon3;
    } else {
      link.href = "/packs/favicon.ico";
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
    },
    openGame(game) {
      const gameData = translateToGameData(game);
      this.games.push(gameData);
    },
    receiveGameData(data) {
      this.games.push(translateToGameData(data));
    }
  }
};
</script>

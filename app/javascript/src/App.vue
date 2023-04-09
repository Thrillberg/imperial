<template>
  <v-app id="app">
    <div v-if="profileFetched && gamesFetched">
      <Header
        :profile="profile"
        @sign-out="signOut"
        @anonymity_confirmed="anonymityConfirmed"
      />
      <v-main>
        <router-view v-slot="{ Component }">
          <component
            :is="Component"
            ref="game"
            :profile="profile"
            :users="onlineUsers"
            :games="games"
            :games-fetched="gamesFetched"
            :observers="observers"
            :game-data="gameData"
            :env="env"
            @registered="register"
            @signed-in="signIn"
            @open-game="openGame"
            @receive-game-data="receiveGameData"
          />
        </router-view>
      </v-main>
    </div>
    <div
      v-else
      class="text-center text-2xl mt-8"
    >
      Loading
    </div>
  </v-app>
</template>

<script>
import { apiClient } from './router/index';
import translateToGameData from './translateToGameData';

import Header from './components/Header.vue';

import favicon2 from './assets/favicon2.ico';
import favicon3 from './assets/favicon3.ico';

export default {
  name: 'App',
  components: { Header },
  props: {
    env: { type: String, default: '' },
  },
  data() {
    return {
      profile: {},
      gameData: {},
      games: [],
      onlineUsers: [],
      observers: [],
      profileFetched: false,
      gamesFetched: false,
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
      this.games = games.map((game) => {
        if (game.id === this.$route.params.id) {
          this.observers = game.observers;
          this.gameData = translateToGameData(game);
        }
        return translateToGameData(game);
      });
      this.gamesFetched = true;
    });
    apiClient.onUpdateGameLog(({
      gameId, log, logTimestamps, game,
    }) => {
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
    if (this.$cookies.get('user_id')) {
      // Fetch user profile
      fetch(`${import.meta.env.VITE_API_URL}/profiles/${this.$cookies.get('user_id')}`, { method: 'GET' })
        .then((response) => response.json())
        .then(({
          name, email, registered, anonymityConfirmedAt, id,
        }) => {
          if (!name) {
            this.createUserProfile();
          } else {
            this.profile = {
              username: name, email, registered, anonymityConfirmedAt, id,
            };
            this.profileFetched = true;
          }
        });
    } else {
      // Create user profile
      this.createUserProfile();
    }
  },
  updated() {
    // Set correct favicon
    const link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);

    const itsMyTurnInThisGame = this.games.find((game) => (
      game.currentPlayerName === this.profile.username
      && game.id === this.$route.params.id
      && !game.winner
    ));
    const itsMyTurnInAGame = this.games.some(
      (game) => game.currentPlayerName === this.profile.username && !game.winner,
    );

    if (itsMyTurnInThisGame) {
      link.href = favicon2;
    } else if (itsMyTurnInAGame) {
      link.href = favicon3;
    } else {
      link.href = '/packs/favicon.ico';
    }
  },
  methods: {
    createUserProfile() {
      fetch(`${import.meta.env.VITE_API_URL}/api/users`, { method: 'POST', credentials: 'include' })
        .then((response) => response.json())
        .then(({ name, id }) => {
          this.profile = { username: name, id };
          apiClient.updateUser(name);
          this.profileFetched = true;
        });
    },
    identify({ username, id }) {
      this.profile = { username, id };
    },
    register({
      username, email, oldUsername, id,
    }) {
      this.profile = {
        username, email, registered: true, id,
      };
      apiClient.updateUser(username, oldUsername);
      apiClient.updateGames();
    },
    signIn({ username, email, id }) {
      this.profile = {
        username, email, registered: true, id,
      };
      apiClient.updateGames();
    },
    signOut() {
      this.profile = {};
    },
    anonymityConfirmed(date) {
      const profile = { ...this.profile, anonymityConfirmedAt: date };
      this.profile = profile;
    },
    openGame(game) {
      const gameData = translateToGameData(game);
      this.games.push(gameData);
    },
    receiveGameData(data) {
      this.games.push(translateToGameData(data));
    },
  },
};
</script>

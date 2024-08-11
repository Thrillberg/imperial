<template>
  <v-app>
    <v-layout v-if="profileFetched">
      <Header
        :profile="profile"
        :count-of-open-games="countOfOpenGames.toString()"
        :count-of-cloned-games="countOfClonedGames"
        @sign-out="signOut"
        @anonymity_confirmed="anonymityConfirmed"
      />
      <v-main>
        <router-view v-slot="{ Component }">
          <Suspense>
            <component
              :is="Component"
              ref="game"
              :profile="profile"
              :users="onlineUsers"
              :games="games"
              :games-fetched="true"
              :observers="observers"
              :game-data="gameData"
              :env="env"
              :open-games-count="countOfOpenGames"
              @registered="register"
              @signed-in="signIn"
              @open-game="openGame"
              @receive-game-data="receiveGameData"
              @anonymity_confirmed="anonymityConfirmed"
            />
            <template #fallback>
              <v-container class="text-center">
                <v-progress-circular
                  indeterminate
                  color="primary-darken-1"
                  size="100"
                  class="mt-10"
                />
              </v-container>
            </template>
          </Suspense>
        </router-view>
      </v-main>
    </v-layout>
    <div
      v-else
      class="text-center"
    >
      <v-progress-circular
        indeterminate
        color="primary-darken-1"
        size="100"
        class="mt-10"
      />
    </div>
  </v-app>
</template>

<script>
import { apiClient } from './router/index';
import translateToGameData from './translateToGameData';

import Header from './components/Header.vue';

export default {
  name: 'App',
  components: { Header },
  props: {
    env: { type: String, default: '' },
    initialGames: { type: Array, default: () => [] },
  },
  data() {
    return {
      profile: {},
      gameData: {},
      games: [],
      onlineUsers: [],
      observers: [],
      profileFetched: false,
    };
  },
  computed: {
    countOfOpenGames() {
      const games = this.games.filter((game) => {
        let inGame = false;
        game.players.forEach((player) => {
          if (player.name === this.profile.username) {
            inGame = true;
          }
        });
        return !game.startedAt && !inGame && !game.forceEndedAt && !game.clonedFromGame && game.isPublic;
      });
      const openGames = games.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return openGames.length;
    },
    countOfClonedGames() {
      const games = this.games.filter((game) => {
        let inGame = false;
        game.players.forEach((player) => {
          if (player.name === this.profile.username) {
            inGame = true;
          }
        });
        return inGame && game.clonedFromGame;
      });
      const clonedGames = games.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return clonedGames.length;
    },
  },
  beforeUnmount() {
    apiClient.clearHandlers();
  },
  created() {
    this.games = this.initialGames.map((game) => {
      if (game.id === this.$route.params.id) {
        this.observers = game.observers;
        this.gameData = translateToGameData(game);
      }
      return translateToGameData(game);
    });
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
    });
    apiClient.onUpdateGameLog(({
      gameId, log, logTimestamps, game,
    }) => {
      if (gameId === this.$route.params.id) {
        this.gameData = translateToGameData(game);
        this.$refs.game.updateGameLog(
          log,
          logTimestamps,
          this.gameData,
        );
      }
    });
    if (this.$cookies.get('user_id')) {
      // Fetch user profile
      fetch(`/profiles/${this.$cookies.get('user_id')}`, { method: 'GET' })
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
      this.createUserProfile();
    }
  },
  methods: {
    createUserProfile() {
      fetch('/api/users', { method: 'POST', credentials: 'include' })
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

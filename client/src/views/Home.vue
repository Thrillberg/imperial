<template>
  <div class="container">
    <div class="text-center">
      <div>
        <div class="underline">Users:</div>
        <ul v-for="user in users" v-bind:key="user.id">
          <li v-if="username === user.name">
            <strong>{{ user.name }}</strong>
          </li>
          <li v-else>
            {{ user.name }}
          </li>
        </ul>
      </div>
      <div class="mt-4">
        <div class="underline">Games:</div>
        <ul v-for="game in games" v-bind:key="game.id">
          <li class="p-2">
            <router-link :to="{ path: '/game/' + game.id }">
              Hosted by {{ game.host }}
            </router-link>
            <span
              v-if="gameStarted(game.id)"
              class="rounded p-2 m-1 bg-red-600 text-white font-bold"
              >Game Started!</span
            >
            <router-link
              :to="{ path: '/game/' + game.id }"
              v-if="joinable(game.id)"
              v-on:click.native="joinGame(game.id)"
              class="rounded p-2 m-1 bg-green-400"
            >
              Join Game
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="alreadyRegistered()" class="text-center mt-20">
      <span
        v-on:click="openGame()"
        class="rounded p-4 ml-4 bg-green-800 text-white cursor-pointer"
        >Play</span
      >
    </div>
    <div v-else class="text-center mt-20">
      <input
        class="mx-auto m-6 border-black border-solid border p-3 rounded"
        v-model="tempName"
        placeholder="name"
      />
      <span
        v-on:click="registerUser(tempName)"
        class="rounded p-4 ml-4 bg-green-800 text-white cursor-pointer"
      >
        Register
      </span>
    </div>
    <div class="text-center mt-40">
      <span class="rounded p-2 m-1 bg-green-800 text-white">
        Solo Mode Game
      </span>
    </div>
  </div>
</template>

<script>
import Action from "../../lib/action.js";
import { Nation } from "../../lib/constants.js";
import { apiClient } from "../router/index.js";

export default {
  name: "Home",
  data: () => {
    return {
      activeGames: new Set(),
      tempName: ""
    };
  },
  props: ["username", "users", "games"],
  beforeDestroy() {
    apiClient.clearHandlers();
  },
  mounted() {
    apiClient.onUpdateGameLog(() => {});
  },
  methods: {
    registerUser: function(name) {
      apiClient.registerUser(name);
    },
    alreadyRegistered: function() {
      return [...this.users]
        .map(x => x.id)
        .includes(this.$cookies.get("userId"));
    },
    openGame: function() {
      apiClient.openGame(this.username);
    },
    gameStarted: function(gameId) {
      const players = this.games.find(game => game.id === gameId).players;
      if (Object.keys(players).length === 2) {
        return true;
      } else {
        return false;
      }
    },
    joinable: function(gameId) {
      let notMyGame =
        this.games.find(game => game.id === gameId).host !== this.username;
      return notMyGame && this.alreadyRegistered() && !this.gameStarted(gameId);
    },
    joinGame: function(gameId) {
      apiClient.joinGame(this.$cookies.get("userId"), gameId, this.username);
      const game = this.games.find(game => game.id === gameId);
      const rawPlayers = {
        [this.$cookies.get("userId")]: this.username,
        ...game.players
      };
      const players = this.assignNations(Object.values(rawPlayers));
      const action = Action.initialize({ players });
      apiClient.tick(game.id, action);
    },
    // TODO: Don't hardcode the nation assignment, figure out how to accept 2-6 players
    assignNations: function(players) {
      return [
        { id: players[0], nation: Nation.AH },
        { id: players[1], nation: Nation.IT }
      ];
    }
  }
};
</script>

<style src="../assets/tailwind.css" />

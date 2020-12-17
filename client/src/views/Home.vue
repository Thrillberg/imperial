<template>
  <div class="container">
    <div class="flex justify-between">
      <div class="mt-4">
        <div v-if="alreadyRegistered()" class="mt-1 mb-6">
          <span
            v-on:click="openGame()"
            class="rounded p-2 bg-green-800 text-white cursor-pointer"
            >Open New Game</span
          >
        </div>
        <ul v-for="game in games" v-bind:key="game.id">
          <li class="py-3">
            <div>
              <router-link
                :to="{ path: '/game/' + game.id }"
                class="text-lg font-bold"
              >
                {{ game.name }}
              </router-link>
              <span class="text-sm">Hosted by {{ game.host }}</span>
            </div>
            <span
              v-if="gameStarted(game.id)"
              class="rounded p-2 bg-red-600 text-white"
              >Game Started!</span
            >
            <router-link
              :to="{ path: '/game/' + game.id }"
              v-if="joinable(game.id)"
              v-on:click.native="joinGame(game.id)"
              class="rounded p-2 bg-green-400"
            >
              Join Game
            </router-link>
          </li>
        </ul>
      </div>
      <div class="mt-4 border border-gray-500 rounded p-4">
        <div class="underline">Registered Users:</div>
        <ul v-for="user in users" v-bind:key="user.id">
          <li>
            {{ user.name }}
          </li>
        </ul>
      </div>
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

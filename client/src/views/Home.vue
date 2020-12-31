<template>
  <div class="container">
    <div class="flex justify-between">
      <div class="mt-4">
        <div v-if="registered" class="mt-1 mb-6">
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
              class="rounded p-2 inline-block bg-red-600 text-white"
              >Game Started!</span
            >
            <div
              v-if="joinable(game.id)"
              v-on:click="joinGame(game.id)"
              class="rounded p-2 inline-block bg-green-400"
            >
              Join Game
            </div>
            <div v-if="!gameStarted(game.id)">
              {{ Object.keys(game.players).length }} / 6 players
            </div>
            <router-link
              v-if="!gameStarted(game.id) && isHost(game.id)"
              :to="{ path: '/game/' + game.id }"
              v-on:click.native="startGame(game.id)"
              class="rounded p-2 inline-block bg-green-600 text-white cursor-pointer"
            >
              Start Game
            </router-link>
          </li>
        </ul>
      </div>
      <div v-if="registered" class="mt-4 border border-gray-500 rounded p-4">
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
  computed: {
    registered: function() {
      if (this.users.length > 0) {
        const user = this.users.find(
          user => user.id === this.$cookies.get("user_id")
        );
        return user.name !== "anonymous";
      } else {
        return false;
      }
    }
  },
  methods: {
    openGame: function() {
      apiClient.openGame(this.username);
    },
    gameStarted: function(gameId) {
      const log = this.games.find(game => game.id === gameId).log;
      if (log.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    joinable: function(gameId) {
      const game = this.games.find(game => game.id === gameId);
      const inGame = Object.values(game.players).includes(this.username);
      return !inGame && this.registered && !this.gameStarted(gameId);
    },
    isHost: function(gameId) {
      const game = this.games.find(game => game.id === gameId);
      return game.host === this.username;
    },
    joinGame: function(gameId) {
      apiClient.joinGame(this.$cookies.get("userId"), gameId, this.username);
    },
    startGame: function(gameId) {
      const game = this.games.find(game => game.id === gameId);
      const shuffledPlayers = this.shuffle(Object.values(game.players));
      const players = this.assignNations(shuffledPlayers);
      const action = Action.initialize({ players });
      apiClient.tick(game.id, action);
    },
    shuffle: function(players) {
      let currentIndex = players.length,
        temporaryValue,
        randomIndex;

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = players[currentIndex];
        players[currentIndex] = players[randomIndex];
        players[randomIndex] = temporaryValue;
      }

      return players;
    },
    assignNations: function(players) {
      switch (players.length) {
        case 2:
          return [
            { id: players[0], nation: Nation.AH },
            { id: players[1], nation: Nation.IT }
          ];
        case 3:
          return [
            { id: players[0], nation: Nation.AH },
            { id: players[1], nation: Nation.IT },
            { id: players[2], nation: Nation.FR }
          ];
        case 4:
          return [
            { id: players[0], nation: Nation.AH },
            { id: players[1], nation: Nation.IT },
            { id: players[2], nation: Nation.FR },
            { id: players[3], nation: Nation.GB }
          ];
        case 5:
          return [
            { id: players[0], nation: Nation.AH },
            { id: players[1], nation: Nation.IT },
            { id: players[2], nation: Nation.FR },
            { id: players[3], nation: Nation.GB },
            { id: players[4], nation: Nation.GE }
          ];
        case 6:
          return [
            { id: players[0], nation: Nation.AH },
            { id: players[1], nation: Nation.IT },
            { id: players[2], nation: Nation.FR },
            { id: players[3], nation: Nation.GB },
            { id: players[4], nation: Nation.GE },
            { id: players[5], nation: Nation.RU }
          ];
      }
    }
  }
};
</script>

<style src="../assets/tailwind.css" />

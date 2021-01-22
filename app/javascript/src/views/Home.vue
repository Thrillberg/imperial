<template>
  <div class="container mx-auto">
    <div class="flex justify-between">
      <div class="mt-4">
        <div v-if="identified">
          <form class="p-4 bg-green-500 rounded" @submit="submit">
            <input
              type="text"
              placeholder="email"
              v-model="email"
              class="rounded p-2"
            />
            <input
              type="password"
              placeholder="password"
              v-model="password"
              class="rounded p-2"
            />
            <input
              type="submit"
              name="submit"
              class="rounded p-2 bg-green-800 text-white"
            />
          </form>
        </div>
        <div
          v-if="identified || registered"
          v-on:click="openGame()"
          class="rounded p-2 mt-2 bg-green-800 text-white cursor-pointer inline-block"
        >
          Open New Game
        </div>
        <ul v-for="game in games" v-bind:key="game.id">
          <li class="py-3">
            <div>
              <Star v-if="game.currentPlayer === username" />
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
    </div>
  </div>
</template>

<script>
import Action from "../../lib/action.js";
import { Nation } from "../../lib/constants.js";
import { apiClient } from "../router/index.js";

import Star from "../components/Star.vue";

export default {
  name: "Home",
  components: {
    Star
  },
  props: ["username", "users", "games"],
  data: function () {
    return {
      email: "",
      password: ""
    }
  },
  beforeDestroy() {
    apiClient.clearHandlers();
  },
  mounted() {
    apiClient.onUpdateGameLog(() => {});
  },
  computed: {
    identified: function() {
      // Users who are identified have a username but have not yet
      // submitted an email and password
      return (this.username !== "anonymous" && this.email.length === 0)
    },
    registered: function() {
      // Users who are registered have a username, an email and a password
      return (this.username !== "anonymous" && this.email.length > 0)
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
      return !inGame && this.identified && !this.gameStarted(gameId);
    },
    isHost: function(gameId) {
      const game = this.games.find(game => game.id === gameId);
      return game.host === this.username;
    },
    joinGame: function(gameId) {
      apiClient.joinGame(this.$cookies.get("user_id"), gameId, this.username);
    },
    startGame: function(gameId) {
      const game = this.games.find(game => game.id === gameId);
      const playerNames = this.playerNames(game);
      const shuffledPlayers = this.shuffle(playerNames);
      const players = this.assignNations(shuffledPlayers);
      const soloMode = game.soloMode;
      const action = Action.initialize({ players, soloMode });
      apiClient.tick(game.id, action);
    },
    playerNames: function(game) {
      if (game.players.length === 1) {
        game.soloMode = true;
        game.players.push("Charles", "Louis", "Otto", "Henry", "Conrad");
        return game.players;
      }
      game.soloMode = false;
      return game.players;
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
    },
    submit: function(e) {
      fetch("/accounts", {
        method: "POST",
        headers: {
          "X-CSRF-Token": this.$cookies.get("CSRF-TOKEN"),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: this.email, password: this.password })
      })
    }
  }
};
</script>

<style src="../assets/tailwind.css" />

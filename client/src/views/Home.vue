<template>
  <div class="container">
    <div class="text-center">
      <div>
        <div class="underline">Users:</div>
        <ul v-for="user in users" v-bind:key="user.id">
          <li v-if="isMe(user)">
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
        v-model="name"
        placeholder="name"
      />
      <span
        v-on:click="registerUser(name)"
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
import Imperial from "../../lib/imperial.js";
import { Nation } from "../../lib/constants.js";
import { apiClient } from "../router/index.js";

export default {
  name: "Home",
  data: () => {
    return {
      activeGames: new Set(),
      games: new Set(),
      name: "",
      users: new Set()
    };
  },
  created() {
    apiClient.onUpdateUsers(({ users }) => {
      this.users = new Set(JSON.parse(users));
      for (const user of this.users) {
        if (this.$cookies.get("userId") === user.id) {
          this.name = user.name;
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
    apiClient.onUpdateGameLog(({ gameId, log }) => {
      const game = this.games.find(game => game.id === gameId);
      game.log = JSON.parse(log);
    });
  },
  destroyed: () => {
    apiClient.clearHandlers();
  },
  methods: {
    isMe: function(user) {
      return user.name === this.name && user.id === this.$cookies.get("userId");
    },
    registerUser: function() {
      apiClient.registerUser(this.name);
    },
    alreadyRegistered: function() {
      return (
        [...this.users].map(x => x.name).includes(this.name) &&
        [...this.users].map(x => x.id).includes(this.$cookies.get("userId"))
      );
    },
    openGame: function() {
      apiClient.openGame(this.name);
    },
    gameStarted: function(gameId) {
      if (this.games.find(game => game.id === gameId).log.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    joinable: function(gameId) {
      let notMyGame =
        this.games.find(game => game.id === gameId).host !== this.name;
      return notMyGame && this.alreadyRegistered() && !this.gameStarted(gameId);
    },
    joinGame: function(gameId) {
      apiClient.joinGame(this.$cookies.get("userId"), gameId, this.name);

      let host = this.games.find(game => game.id === gameId).host;
      let players = this.assignNations([host, this.name]);
      const action = Action.initialize({ players });
      this.game = Imperial.fromLog([action]);

      apiClient.tick(gameId, action);
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

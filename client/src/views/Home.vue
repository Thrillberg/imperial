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
      <span
        v-on:click="startGame"
        class="rounded p-2 m-1 bg-green-800 text-white"
      >
        Solo Mode Game
      </span>
    </div>
  </div>
</template>

<script>
import Action from "../../lib/action.js";
import Imperial from "../../lib/imperial.js";
import { Nation } from "../../lib/constants.js";

export default {
  name: "Home",
  data: () => {
    return {
      activeGames: new Set(),
      games: new Set(),
      name: "",
      users: new Set(),
      webSocket: new WebSocket(process.env.VUE_APP_IMPERIAL_WEBSOCKETS_URL)
    };
  },
  created() {
    this.webSocket.onmessage = message => {
      const envelope = JSON.parse(message.data);
      switch (envelope.kind) {
        case "userRegistered": {
          this.users = new Set(JSON.parse(envelope.data.users));
          for (const user of this.users) {
            if (this.$cookies.get("userId") === user.id) {
              this.name = user.name;
            }
          }
          break;
        }
        case "gameOpened": {
          const games = JSON.parse(envelope.data.games);
          const finalGames = games.map(game => {
            const parsedGame = JSON.parse(game.game);
            return {
              host: parsedGame.host,
              log: parsedGame.log,
              players: parsedGame.players,
              id: game.id
            };
          });
          this.games = finalGames;
          break;
        }
        case "updateGameLog": {
          let game = this.games.find(game => game.id === envelope.data.gameId);
          game.log = JSON.parse(envelope.data.log);
          break;
        }
      }
    };
  },
  methods: {
    startGame: function() {
      this.webSocket.send(
        JSON.stringify({
          kind: "openGame",
          data: { host: "test" }
        })
      );
    },
    isMe: function(user) {
      return user.name === this.name && user.id === this.$cookies.get("userId");
    },
    registerUser: function() {
      this.webSocket.send(
        JSON.stringify({
          kind: "registerUser",
          data: { name: this.name }
        })
      );
    },
    alreadyRegistered: function() {
      return (
        [...this.users].map(x => x.name).includes(this.name) &&
        [...this.users].map(x => x.id).includes(this.$cookies.get("userId"))
      );
    },
    openGame: function() {
      this.webSocket.send(
        JSON.stringify({
          kind: "openGame",
          data: { host: this.name }
        })
      );
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
      this.webSocket.send(
        JSON.stringify({
          kind: "joinGame",
          data: {
            userName: this.name,
            userId: this.$cookies.get("userId"),
            gameId
          }
        })
      );
      let host = this.games.find(game => game.id === gameId).host;
      let players = this.assignNations([host, this.name]);
      const action = Action.initialize({ players });
      this.game = Imperial.fromLog([action]);
      this.webSocket.send(
        JSON.stringify({
          kind: "tick",
          data: {
            gameId: JSON.stringify(gameId),
            action: JSON.stringify(action)
          }
        })
      );
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

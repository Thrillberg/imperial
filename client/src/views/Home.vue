<template>
  <div>
    Users:
    <ul v-for="user in users" v-bind:key="user.id">
      <li v-if="user.name === name">
        <strong>{{ user.name }}</strong>
      </li>
      <li v-else>
        {{ user.name }}
      </li>
    </ul>
    Games:
    <ul v-for="game in games" v-bind:key="game.id">
      <li>
        <router-link :to="{ path: '/game/' + game.id }">
          Hosted by {{ game.host }}
        </router-link>
      </li>
    </ul>
    <div v-if="alreadyRegistered()">
      <button v-on:click="openGame()">Play</button>
    </div>
    <div v-else class="flex flex-col">
      <input
        class="mx-auto m-6 border-black border-solid border-2 p-3 rounded"
        v-model="name"
        placeholder="name"
      />
      <button v-on:click="registerUser(name)">Register</button>
    </div>

    <hr class="mt-40" />
    <p class="text-center">Solo mode</p>
    <div class="flex">
      <PlayerCount
        v-for="count in playerCounts"
        v-bind:key="count"
        v-bind:count="count"
        v-bind:start_game="startGame"
      ></PlayerCount>
    </div>
  </div>
</template>

<script>
import PlayerCount from "@/components/PlayerCount.vue";

import Action from "../../lib/action.js";
import Imperial from "../../lib/imperial.js";
import { Nation } from "../../lib/constants.js";

export default {
  name: "Home",
  components: { PlayerCount },
  data: () => {
    return {
      soloMode: false,
      games: new Set(),
      name: "",
      playerCounts: [2, 3, 4, 5, 6],
      players: new Set(),
      users: new Set(),
      webSocket: new WebSocket(process.env.VUE_APP_IMPERIAL_WEBSOCKETS_URL)
    };
  },
  created() {
    this.webSocket.onmessage = message => {
      const envelope = JSON.parse(message.data);
      switch (envelope.kind) {
        case "setId":
          this.setWebsocketId(envelope.data.id);
          break;
        case "userRegistered": {
          this.users = new Set(JSON.parse(envelope.data.users));
          for (const user of this.users) {
            if (localStorage.imperialId === user.id) {
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
        case "updatePlayers":
          this.players = new Set(JSON.parse(envelope.data.players));
          for (const player of this.players) {
            if (localStorage.imperialId === player.id) {
              this.name = player.name;
            }
          }
          break;
        case "startGame":
          this.players = new Set(JSON.parse(envelope.data.players));
          this.startGame();
          break;
      }
    };
  },
  methods: {
    setWebsocketId: function(newId) {
      const oldId = localStorage.getItem("imperialId");
      if (oldId) {
        this.webSocket.send(
          JSON.stringify({
            kind: "updateId",
            data: { oldId, newId }
          })
        );
      }
      localStorage.setItem("imperialId", newId);
    },
    registerUser: function() {
      this.webSocket.send(
        JSON.stringify({
          kind: "registerUser",
          data: { name: this.name, id: localStorage.imperialId }
        })
      );
    },
    alreadyRegistered: function() {
      return [...this.users].map(x => x.name).includes(this.name);
    },
    openGame: function() {
      this.webSocket.send(
        JSON.stringify({
          kind: "openGame",
          data: { host: this.name, id: localStorage.imperialId }
        })
      );
    },
    startGame: function(playerCount) {
      let players;
      if (playerCount) {
        players = this.getPlayers(playerCount);
        this.soloMode = true;
      } else {
        players = this.assignNations([...this.players]);
      }
      const action = Action.initialize({ players });
      this.game = Imperial.fromLog([action]);
      this.gameStarted = true;
      this.controllingPlayerName = this.game.currentPlayerName;
      if (this.leader === true) {
        this.webSocket.send(
          JSON.stringify({
            kind: "tick",
            data: { action: JSON.stringify(action) }
          })
        );
      }
    },
    getPlayers: function(playerCount) {
      switch (playerCount) {
        case 2:
          return [
            { id: "Henry Davison", nation: Nation.AH },
            { id: "Georg Siemens", nation: Nation.IT }
          ];
        case 3:
          return [
            { id: "Henry Davison", nation: Nation.AH },
            { id: "Georg Siemens", nation: Nation.IT },
            { id: "John Baring", nation: Nation.FR }
          ];
        case 4:
          return [
            { id: "Daniel", nation: Nation.RU },
            { id: "Claudia", nation: Nation.FR },
            { id: "Bert", nation: Nation.GB },
            { id: "Anton", nation: Nation.IT }
          ];
        case 5:
          return [
            { id: "Henry Davison", nation: Nation.AH },
            { id: "Georg Siemens", nation: Nation.IT },
            { id: "John Baring", nation: Nation.FR },
            { id: "Henri Germain", nation: Nation.GE },
            { id: "Johann Heinrich Schröder", nation: Nation.RU }
          ];
        case 6:
          return [
            { id: "Henry Davison", nation: Nation.AH },
            { id: "Georg Siemens", nation: Nation.IT },
            { id: "John Baring", nation: Nation.FR },
            { id: "Henri Germain", nation: Nation.GE },
            { id: "Johann Heinrich Schröder", nation: Nation.RU },
            { id: "Gerson von Bleichröder", nation: Nation.GB }
          ];
      }
    },
    // TODO: Don't hardcode the nation assignment, figure out how to accept 2-6 players
    assignNations: function(players) {
      return [
        { id: players[0].name, nation: Nation.AH },
        { id: players[1].name, nation: Nation.IT }
      ];
    }
  }
};
</script>

<style src="../assets/tailwind.css" />

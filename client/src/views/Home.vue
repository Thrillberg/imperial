<template>
  <div class="home flex flex-col">
    <div v-if="this.unregistered()">
      <input v-model="name" placeholder="name" class="border border-black border-solid p-1 m-1" />
      <button
        @click="registerPlayer(name)"
        class="bg-green-900 py-2 px-3 text-white"
      >Register</button>
    </div>
    <div v-else>
      {{ name }}
      <div class="mx-auto py-5">
        <router-link
          to="/game"
          @click.native="registerPlayer(name)"
          class="bg-green-900 py-2 px-3 text-white rounded-full"
        >New Game</router-link>
      </div>
      <div v-if="players.size > 0">
        <div class="mx-auto">Open Games:</div>
        <ul
          v-for="player in players"
          v-bind:key="player.name"
          class="flex mx-auto list-none py-5"
        >
          <li>
            {{ player.name }}
          </li>
        </ul>
        <div v-if="!inGame()" class="mx-auto">
          <router-link
            to="/game"
            @click.native="registerPlayer(name)"
            class="bg-green-900 py-2 px-3 text-white rounded-full"
            >Join Game</router-link>
        </div>
        <div v-else class="mx-auto">
          <router-link
            to="/game"
            class="bg-green-900 py-2 px-3 text-white rounded-full"
            >View Game</router-link>
        </div>
      </div>
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
import Imperial from "@/../lib/imperial.js";
import Action from "@/../lib/action.js";
import { Nation } from "@/../lib/constants.js";

import PlayerCount from "../components/PlayerCount.vue";

export default {
  name: "Home",
  components: {
    PlayerCount,
  },
  data: () => {
    return {
      soloMode: false,
      leader: false,
      name: "",
      playerCounts: [2, 3, 4, 5, 6],
      players: new Set(),
      webSocket: new WebSocket(process.env.VUE_APP_IMPERIAL_WEBSOCKETS_URL),
    };
  },
  created() {
    this.webSocket.onmessage = (message) => {
      const envelope = JSON.parse(message.data);
      console.log(envelope)
      switch (envelope.kind) {
        case "setId":
          this.setWebsocketId(envelope.data.id);
          break;
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
    unregistered: function () {
      let unregistered = true
      for (const player of this.players) {
        if (localStorage.getItem("imperialId") === player.id) {
          unregistered = false
        }
      }
      return unregistered
    },
    inGame: function () {
      let inGame = false
      for (const player of this.players) {
        if (this.name === player.name) {
          inGame = true
        }
      }
      return inGame
    },
    linkText: function () {
      return this.inGame() ? "View Game" : "Join Game"
    },
    setWebsocketId: function (newId) {
      const oldId = localStorage.getItem("imperialId");
      if (oldId) {
        this.webSocket.send(
          JSON.stringify({
            kind: "updateId",
            data: { oldId, newId },
          })
        );
      }
      localStorage.setItem("imperialId", newId);
    },
    registerPlayer: function () {
      this.webSocket.send(
        JSON.stringify({
          kind: "updateName",
          data: { name: this.name, id: localStorage.imperialId },
        })
      );
      if (this.players.size === 0) {
        this.leader = true;
      }
    },
    alreadyRegistered: function () {
      return [...this.players].map((p) => p.name).includes(this.name);
    },
    startGame: function (playerCount) {
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
            data: { action: JSON.stringify(action) },
          })
        );
      }
      this.$router.push("game")
    },
    getPlayers: function (playerCount) {
      switch (playerCount) {
        case 2:
          return [
            { id: "Henry Davison", nation: Nation.AH },
            { id: "Georg Siemens", nation: Nation.IT },
          ];
        case 3:
          return [
            { id: "Henry Davison", nation: Nation.AH },
            { id: "Georg Siemens", nation: Nation.IT },
            { id: "John Baring", nation: Nation.FR },
          ];
        case 4:
          return [
            { id: "Daniel", nation: Nation.RU },
            { id: "Claudia", nation: Nation.FR },
            { id: "Bert", nation: Nation.GB },
            { id: "Anton", nation: Nation.IT },
          ];
        case 5:
          return [
            { id: "Henry Davison", nation: Nation.AH },
            { id: "Georg Siemens", nation: Nation.IT },
            { id: "John Baring", nation: Nation.FR },
            { id: "Henri Germain", nation: Nation.GE },
            { id: "Johann Heinrich Schröder", nation: Nation.RU },
          ];
        case 6:
          return [
            { id: "Henry Davison", nation: Nation.AH },
            { id: "Georg Siemens", nation: Nation.IT },
            { id: "John Baring", nation: Nation.FR },
            { id: "Henri Germain", nation: Nation.GE },
            { id: "Johann Heinrich Schröder", nation: Nation.RU },
            { id: "Gerson von Bleichröder", nation: Nation.GB },
          ];
      }
    },
    // TODO: Don't hardcode the nation assignment, figure out how to accept 2-6 players
    assignNations: function (players) {
      return [
        { id: players[0].name, nation: Nation.AH },
        { id: players[1].name, nation: Nation.IT },
      ];
    },
  },
};
</script>

<template>
  <div class="flex flex-wrap w-1/2">
    <div v-for="game of games" v-bind:key="game.id" class="mr-3 my-3 p-3 border border-rounded w-2/5" :class="game.winner || game.forceEndedAt ? 'bg-gray-300' : ''">
      <div>
        <Star v-if="game.currentPlayer && game.currentPlayer === profile.username && !game.winner" />
        <router-link
          :to="{ path: '/game/' + game.id }"
          class="text-lg font-bold"
        >
          {{ game.name }}
        </router-link>
      </div>
      <div>
        {{ playersInGame(game.id).join(", ") }}
      </div>
      <div
        v-if="!gameStarted(game.id) && !isHost(game.id) && !joinable(game.id)"
        class="rounded mt-2 p-2 inline-block bg-gray-300 cursor-not-allowed"
      >
        Waiting for host to start game...
      </div>
      <router-link
        :to="{ path: '/game/' + game.id }"
        v-if="gameStarted(game.id) && game.players.includes(profile.username) && !game.winner && !game.forceEndedAt"
        class="rounded mt-2 p-2 inline-block bg-green-800 text-white cursor-pointer"
      >
        {{ game.currentPlayer }}'s turn
      </router-link>
      <div
        v-if="joinable(game.id)"
        v-on:click.once="joinGame(game.id)"
        class="rounded p-2 inline-block bg-green-800 text-white cursor-pointer"
      >
        Join Game
      </div>
      <router-link
        v-if="!gameStarted(game.id) && isHost(game.id)"
        :to="{ path: '/game/' + game.id }"
        v-on:click.native="startGame(game.id)"
        class="rounded mt-2 p-2 inline-block bg-green-800 text-white cursor-pointer"
      >
        Start Game
      </router-link>
    </div>
  </div>
</template>

<script>
import Star from "../components/Star.vue";

export default {
  name: "ActiveGameList",
  components: { Star },
  props: { games: Array, profile: Object },
  methods: {
    playersInGame: function(gameId) {
      return this.games.find(game => game.id === gameId).players;
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
      const inGame = Object.values(game.players).includes(this.profile.username);
      return !inGame && this.profile.username && !this.gameStarted(gameId);
    },
    isHost: function(gameId) {
      const game = this.games.find(game => game.id === gameId);
      return game.host === this.profile.username;
    },
    joinGame: function(gameId) {
      apiClient.joinGame(this.$cookies.get("user_id"), gameId, this.profile.username);
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
    }
  }
}
</script>

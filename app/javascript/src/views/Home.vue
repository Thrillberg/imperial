<template>
  <v-container v-if="gamesFetched">
    <YourGames
      v-if="profile.registered || profile.anonymityConfirmedAt"
      :games="yourGames"
      :profile="profile"
    />
    <UnstartedGameList
      :games="unstartedGames"
      :profile="profile"
    />
    <CurrentGames :games="currentGames" />
    <CurrentSoloGames :games="currentSoloGames" />
    <div class="px-4">
      <router-link to="/cloned_games">
        <b class="underline">Your Cloned Games</b>
      </router-link>
    </div>
    <div class="px-4">
      <router-link to="/games">
        <b class="underline">All Games</b>
      </router-link>
    </div>
    <div class="px-4">
      <router-link to="/finished_games">
        <b class="underline">All Finished Games</b>
      </router-link>
    </div>
  </v-container>
  <v-container v-else>
    Loading games
  </v-container>
</template>

<script>
import CurrentGames from '../components/CurrentGames.vue';
import CurrentSoloGames from '../components/CurrentSoloGames.vue';
import UnstartedGameList from '../components/UnstartedGameList.vue';
import YourGames from '../components/YourGames.vue';

import DiscordLogo from '../assets/discord_logo.svg';

export default {
  name: 'Home',
  components: {
    CurrentGames, CurrentSoloGames, UnstartedGameList, YourGames, DiscordLogo,
  },
  props: {
    profile: Object, users: Array, games: Array, gamesFetched: Boolean,
  },
  computed: {
    yourGames() {
      return this.games.filter((game) => {
        let inGame = false;
        game.players.forEach((player) => {
          if (player.name === this.profile.username) {
            inGame = true;
          }
        });
        return inGame && !game.forceEndedAt && !game.clonedFromGame;
      });
    },
    unstartedGames() {
      const games = this.games.filter((game) => {
        let inGame = false;
        game.players.forEach((player) => {
          if (player.name === this.profile.username) {
            inGame = true;
          }
        });
        return !game.startedAt && !inGame && !game.forceEndedAt && !game.clonedFromGame && game.isPublic;
      });
      return games.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    currentGames() {
      return this.games.filter(
        (game) => game.startedAt && !game.forceEndedAt && !game.winner && !game.clonedFromGame && game.players.length > 1,
      );
    },
    currentSoloGames() {
      return this.games.filter(
        (game) => game.startedAt && !game.forceEndedAt && !game.winner && !game.clonedFromGame && game.players.length === 1,
      );
    },
  },
  created() {
    document.title = 'Imperial';
  },
};
</script>

<style src="../assets/tailwind.css" />

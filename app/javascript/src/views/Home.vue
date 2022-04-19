<template>
  <div class="container mx-auto">
    <div class="mt-10">
      <div class="flex justify-around items-start">
        <div class="sm:w-3/4" v-if="gamesFetched">
          <div class="bg-green-200 p-4 my-2 flex">
            <a href="http://discord.gg/VnxKwuQmg8">
              <DiscordLogo height="50" fill="#7289DA" class="mr-2" />
            </a>
            <p>
              Please join us <b><a href="https://discord.gg/VnxKwuQmg8" class="underline">on Discord</a></b> if you want to find others to play a live or asynchronous game!
            </p>
          </div>
          <YourGames
            v-if="profile.registered || profile.anonymity_confirmed_at"
            :games="yourGames"
            :profile="profile"
          ></YourGames>
          <UnstartedGameList :games="unstartedGames" :profile="profile"></UnstartedGameList>
          <CurrentGames :games="currentGames"></CurrentGames>
          <CurrentSoloGames :games="currentSoloGames"></CurrentSoloGames>
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
        </div>
        <div v-else class="sm:w-3/4 text-center text-2xl mt-8">
          Loading games
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CurrentGames from "../components/CurrentGames.vue";
import CurrentSoloGames from "../components/CurrentSoloGames.vue";
import UnstartedGameList from "../components/UnstartedGameList.vue";
import YourGames from "../components/YourGames.vue";

import DiscordLogo from "../assets/discord_logo.svg";

export default {
  name: "Home",
  components: { CurrentGames, CurrentSoloGames, UnstartedGameList, YourGames, DiscordLogo },
  props: { profile: Object, users: Array, games: Array, gamesFetched: Boolean },
  created() {
    document.title = "Imperial";
  },
  computed: {
    yourGames() {
      return this.games.filter(game => {
        let inGame = false;
        game.players.forEach(player => {
          if (player.name === this.profile.username) {
            inGame = true;
          }
        });
        return inGame && !game.forceEndedAt && !game.clonedFromGame;
      })
    },
    unstartedGames() {
      let games = this.games.filter(game => {
        let inGame = false;
        game.players.forEach(player => {
          if (player.name === this.profile.username) {
            inGame = true;
          }
        });
        return !game.startedAt && !inGame && !game.forceEndedAt && !game.clonedFromGame && game.isPublic;
      });
      return games.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    },
    currentGames() {
      return this.games.filter(
        game => game.startedAt && !game.forceEndedAt && !game.winner && !game.clonedFromGame && game.players.length > 1
      )
    },
    currentSoloGames() {
      return this.games.filter(
        game => game.startedAt && !game.forceEndedAt && !game.winner && !game.clonedFromGame && game.players.length === 1
      )
    }
  }
};
</script>

<style src="../assets/tailwind.css" />

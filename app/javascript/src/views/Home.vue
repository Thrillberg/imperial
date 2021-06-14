<template>
  <div class="container mx-auto">
    <div class="mt-10">
      <div v-if="!profile.anonymity_confirmed_at && !profile.registered" class="flex flex-col items-center rounded p-20 mx-auto max-w-4xl bg-green-200">
        <button
          class="rounded bg-green-800 text-white cursor-pointer text-2xl block w-1/2 hover:bg-green-900 p-10 m-10"
          @click="setAnonymous"
          v-if="profile.username"
        >
          Play as {{ profile.username }}
        </button>
        <button
          class="rounded bg-green-800 text-white cursor-pointer text-2xl block w-1/2 hover:bg-green-900 p-10 m-10"
          @click="register"
          >
          Register an Account
        </button>
      </div>
      <div v-else class="flex justify-around items-start">
        <div class="w-3/4" v-if="gamesFetched">
          <div class="bg-yellow-200 p-4 my-2 flex">
            <p>
            This website is under active development! We especially welcome bug reports and feature requests, submitted through <b><a href="https://discord.gg/VnxKwuQmg8" class="underline">Discord</a></b> or <b><a href="https://github.com/Thrillberg/imperial/issues" class="underline">GitHub</a></b>. There is a good chance we will work on whatever you recommend!
            </p>
          </div>
          <div class="bg-green-200 p-4 my-2 flex">
            <a href="http://discord.gg/VnxKwuQmg8">
              <DiscordLogo height="50" fill="#7289DA" class="mr-2" />
            </a>
            <p>
              Please join us <b><a href="https://discord.gg/VnxKwuQmg8" class="underline">on Discord</a></b> if you want to find others to play a live or asynchronous game! We usually try to schedule a live game for <b>1pm EST</b> on Saturday and/or Sunday.
            </p>
          </div>
          <YourGames :games="yourGames" :profile="profile"></YourGames>
          <UnstartedGameList :games="unstartedGames" :profile="profile"></UnstartedGameList>
          <CurrentGames :games="currentGames"></CurrentGames>
          <div>
            <router-link to="/games">
              <b class="underline">All Games</b>
            </router-link>
          </div>
          <div>
            <router-link to="/cloned_games">
              <b class="underline">Your Cloned Games</b>
            </router-link>
          </div>
        </div>
        <div v-else class="w-3/4 text-center text-2xl mt-8">
          Loading games
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CurrentGames from "../components/CurrentGames.vue";
import UnstartedGameList from "../components/UnstartedGameList.vue";
import YourGames from "../components/YourGames.vue";

import DiscordLogo from "../assets/discord_logo.svg";

export default {
  name: "Home",
  components: { CurrentGames, UnstartedGameList, YourGames, DiscordLogo },
  props: { profile: Object, users: Array, games: Array, gamesFetched: Boolean },
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
        return !game.startedAt && !inGame && !game.forceEndedAt && !game.clonedFromGame;
      });
      return games.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    },
    currentGames() {
      return this.games.filter(
        game => game.startedAt && !game.forceEndedAt && !game.winner && !game.clonedFromGame
      )
    }
  },
  methods: {
    setAnonymous() {
      fetch(
        "/anonymity_confirmations",
        {
          method: "POST",
          body: JSON.stringify({ id: this.$cookies.get("user_id") }),
          headers: { "Content-Type": "application/json" }
        }
      )
        .then((response) => response.json())
        .then((data) => {
          this.$emit("anonymity_confirmed", data.anonymity_confirmed_at)
        })
    },
    register() {
      this.$router.push("/register");
    }
  }
};
</script>

<style src="../assets/tailwind.css" />

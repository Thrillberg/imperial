<template>
  <FirstTimeUserCards
    v-if="isFirstTimeUser && gamesFetched"
    :games="currentGames"
    @anonymity_confirmed="$emit('anonymity_confirmed', $event)"
  />
  <v-container v-else-if="gamesFetched">
    <Suspense>
      <YourGames
        v-if="profile.registered || profile.anonymityConfirmedAt"
        :games="yourGames"
        :profile="profile"
      />
    </Suspense>
    <UnstartedGameList
      :games="unstartedGames"
      :profile="profile"
    />
    <Suspense>
      <CurrentGames :games="currentGames" />
    </Suspense>
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
  <v-container
    v-else
    class="text-center"
  >
    <v-progress-circular
      indeterminate
      color="primary-darken-1"
      size="100"
      class="mt-10"
    />
  </v-container>
</template>

<script>
import CurrentGames from '../components/CurrentGames.vue';
import CurrentSoloGames from '../components/CurrentSoloGames.vue';
import FirstTimeUserCards from '../components/FirstTimeUserCards.vue';
import UnstartedGameList from '../components/UnstartedGameList.vue';
import YourGames from '../components/YourGames.vue';

export default {
  name: 'Home',
  components: {
    CurrentGames, CurrentSoloGames, FirstTimeUserCards, UnstartedGameList, YourGames,
  },
  props: {
    games: { type: Array, default: () => [] },
    gamesFetched: { type: Boolean, default: false },
    profile: { type: Object, default: () => {} },
    users: { type: Array, default: () => [] },
  },
  emits: ['anonymity_confirmed'],
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
    isFirstTimeUser() {
      return !this.profile.registered && !this.profile.anonymityConfirmedAt;
    },
  },
  created() {
    document.title = 'Imperial';
  },
};
</script>

<style src="../assets/tailwind.css" />

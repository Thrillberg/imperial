<template>
  <FirstTimeUserCards
    v-if="isFirstTimeUser && gamesFetched"
    :games="currentGames"
    :open-games-count="openGamesCount"
    @anonymity_confirmed="$emit('anonymity_confirmed', $event)"
  />
  <v-container v-else-if="gamesFetched">
    <Suspense>
      <YourGames
        v-if="profile.registered || profile.anonymityConfirmedAt"
        :games="yourGames"
        :profile="profile"
        :users="users"
        :has-hidden-games="hasHiddenGames"
        @hide-game="hideGame"
        @unhide-all-games="unhideAllGames"
      />
      <template #fallback>
        <v-container class="text-center">
          <v-progress-circular
            indeterminate
            color="primary-darken-1"
            size="100"
            class="mt-10"
          />
        </v-container>
      </template>
    </Suspense>
    <Suspense>
      <CurrentGames
        :games="currentGames"
        :users="users"
      />
    </Suspense>
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
import FirstTimeUserCards from '../components/FirstTimeUserCards.vue';
import YourGames from '../components/YourGames.vue';

import setFavicon from '../setFavicon';

export default {
  name: 'Home',
  components: {
    CurrentGames, FirstTimeUserCards, YourGames,
  },
  props: {
    games: { type: Array, default: () => [] },
    gamesFetched: { type: Boolean, default: false },
    openGamesCount: { type: Number, default: 0 },
    profile: { type: Object, default: () => {} },
    users: { type: Array, default: () => [] },
    hiddenGameIds: { type: Array, default: () => [] },
  },
  emits: ['anonymity_confirmed', 'game_hidden', 'games_unhidden'],
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
      }).sort((a, b) => {
        if (a.winner === b.winner) {
          return 0;
        } if (a.winner === null) {
          return -1;
        } if (b.winner === null) {
          return 1;
        }
        return 0;
      });
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
    hasHiddenGames() {
      return this.hiddenGameIds.length > 0;
    },
  },
  created() {
    document.title = 'Imperial';
    setFavicon(this.games, this.profile, this.$route.params.id);
  },
  methods: {
    hideGame(gameId) {
      fetch(
        `/api/games/${gameId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ hide: true, user_id: this.profile.id }),
          headers: { 'Content-Type': 'application/json' },
        },
      ).then(() => {
        this.$emit('game_hidden', gameId);
      });
    },
    unhideAllGames() {
      fetch(
        '/api/hidden_games/destroy_all',
        {
          method: 'DELETE',
          body: JSON.stringify({ user_id: this.profile.id }),
          headers: { 'Content-Type': 'application/json' },
        },
      ).then(() => {
        this.$emit('games_unhidden');
      });
    },
  },
};
</script>

<style src="../assets/styles.css" />

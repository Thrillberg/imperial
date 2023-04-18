<template>
  <v-container v-if="gamesFetched">
    <Suspense>
      <UnstartedGameList
        :games="unstartedGames"
        :profile="profile"
      />
    </Suspense>
  </v-container>
</template>

<script>
import UnstartedGameList from '../components/UnstartedGameList.vue';

export default {
  name: 'OpenGames',
  components: {
    UnstartedGameList,
  },
  props: {
    games: { type: Array, default: () => [] },
    gamesFetched: { type: Boolean, default: false },
    profile: { type: Object, default: () => {} },
    users: { type: Array, default: () => [] },
  },
  computed: {
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
  },
  created() {
    document.title = 'Imperial - Open Games';
  },
};
</script>

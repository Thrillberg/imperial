<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            First time playing Imperial?
          </v-card-title>
          <v-card-subtitle>Try it out with a solo game!</v-card-subtitle>
          <v-card-text>
            <b>Imperial</b> is a board game where players act as investors in nations.
            Players take control of nations by buying bonds.
            With the control of nations, players can move military units and occupy territory.
            It is not a wargame, however, and ultimate success relies on prudent bond purchases.
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary-darken-1"
              @click="startSoloGame"
            >
              Play a Solo Game
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>
            Played Imperial before?
          </v-card-title>
          <v-card-subtitle>Jump right into a game or start your own!</v-card-subtitle>
          <v-card-text>
            <b>playimperial.club</b> supports both live and async games.
            We also have <a href="https://discord.gg/VnxKwuQmg8">an active Discord community</a>.
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary-darken-1"
              to="/games/open"
            >
              Find a Game
            </v-btn>
            <v-btn
              color="primary-darken-1"
              to="/games/new"
            >
              Start a New Game
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <Suspense>
      <CurrentGames :games="games" />
    </Suspense>
  </v-container>
</template>

<script>
import CurrentGames from './CurrentGames.vue';

import { apiClient } from '../router/index';

export default {
  name: 'FirstTimeUserCards',
  components: {
    CurrentGames,
  },
  props: {
    games: { type: Array, default: () => [] },
  },
  emits: ['anonymity_confirmed', 'openGame'],
  methods: {
    startSoloGame(e) {
      e.preventDefault();
      fetch(
        '/anonymity_confirmations',
        {
          method: 'POST',
          body: JSON.stringify({ id: this.$cookies.get('user_id') }),
          headers: { 'Content-Type': 'application/json' },
        },
      )
        .then((response) => response.json())
        .then((data) => {
          this.$emit('anonymity_confirmed', data.anonymity_confirmed_at);

          apiClient.openGame(
            data.id,
            'imperial',
            'standard',
            false,
            false,
          )
            .then((game) => {
              this.$emit('openGame', game);
              this.$router.push(`/game/${game.id}?solo=true`);
            });
        });
    },
  },
};
</script>

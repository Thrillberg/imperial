<template>
  <v-container>
    <v-card>
      <v-card-title>Rankings</v-card-title>
      <div
        v-for="([name, user], index) of users"
        :key="user + index"
        :name="user"
      >
        {{ index + 1 }}.
        <router-link :to="{ path: '/users/' + user.id }">
          {{ name }}
        </router-link>
        ({{ Math.floor(user.rating) }})
      </div>
      <v-card-text>
        <p>
          These rankings are determined with the help of <a
            href="https://github.com/philihp/openskill.js"
            class="underline"
          >openskill</a>.
          The numbers in parentheses above reflect the player's ordinal rating, where a higher number indicates a stronger player.
        </p>
        <p>Only the top 10 players who have completed at least one multi-player game are included in the rankings.</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { ordinal, rate, rating } from 'openskill';

export default {
  name: 'Rankings',
  data: () => ({ games: [] }),
  computed: {
    users() {
      const userRatings = {};
      for (const gameUsers of this.games) {
        if (gameUsers.length > 1) {
          const scores = [];
          const ratings = [];
          for (const { player_name: playerName, player_score: playerScore } of gameUsers) {
            scores.push(playerScore);
            if (!userRatings[playerName]) {
              userRatings[playerName] = rating();
            }
            ratings.push([userRatings[playerName]]);
          }
          const results = rate(ratings, { score: scores });
          gameUsers.forEach((user, index) => {
            userRatings[user.player_name] = results[index][0];
            userRatings[user.player_name].id = user.player_id;
          });
        }
      }
      const finalRatings = {};
      for (const name in userRatings) {
        finalRatings[name] = {
          rating: ordinal(userRatings[name]),
          id: userRatings[name].id,
        };
      }
      const sortedRatings = Object.entries(finalRatings)
        .sort(([, a], [, b]) => b.rating - a.rating);
      return sortedRatings.slice(0, 10);
    },
  },
  created() {
    document.title = 'Rankings - Imperial';
    fetch('/api/ranked_games')
      .then((response) => response.json())
      .then((games) => { this.games = games; });
  },
};
</script>

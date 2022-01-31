<template>
  <div class="mx-auto w-1/2">
    <div class="mb-5"><b class="text-xl">Rankings</b></div>
    <div v-for="([user, rank], index) of users" :name="user" :key="user">
      {{ index + 1 }}. <b>{{ user }}</b> ({{ Math.floor(rank) }})
    </div>
    <p class="mt-5">
      These rankings are determined with the help of <a href="https://github.com/philihp/openskill.js" class="underline">openskill</a>. The numbers in parentheses above reflect the player's ordinal rating, where a higher number indicates a stronger player.
    </p>
    <p>Only players who have completed at least one multi-player game are included in the rankings.</p>
  </div>
</template>

<script>
import { rating, rate, ordinal } from "openskill";

export default {
  name: "Rankings",
  data: () => ({ games: [] }),
  created() {
    document.title = "Rankings - Imperial";
    fetch("/api/games")
      .then(response => response.json())
      .then(games => {
        this.games = games
      })
  },
  computed: {
    users() {
      let userRatings = {};
      for (const gameUsers of this.games) {
        if (gameUsers.length > 1) {
          let scores = [];
          let ratings = [];
          for (const user of gameUsers) {
            scores.push(user.score);
            if (!userRatings[user.name]) {
              userRatings[user.name] = rating();
            }
            ratings.push([userRatings[user.name]]);
          }
          let results = rate(ratings, { score: scores });
          gameUsers.forEach((user, index) => {
            userRatings[user.name] = results[index][0];
          });
        }
      }
      let finalRatings = {};
      for (const name in userRatings) {
        finalRatings[name] = ordinal(userRatings[name]);
      }
      return Object.entries(finalRatings)
        .sort(([,a], [,b]) => b - a)
    }
  }
}
</script>

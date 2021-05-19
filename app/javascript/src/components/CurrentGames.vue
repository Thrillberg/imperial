<template>
  <div class="p-4">
    <b>Current Games</b>
    <div class="flex justify-between border-b border-black mt-2">
      <div class="w-1/4"><b>Name</b></div>
      <div class="w-1/4"><b>Players</b></div>
      <div class="w-1/4"><b>Started At</b></div>
      <div class="w-1/4"></div>
    </div>
    <div v-for="game of games" v-bind:key="game.id">
      <router-link :to="{ path: '/game/' + game.id }" class="flex justify-between items-center hover:bg-gray-200 py-2">
        <div class="w-1/4">{{ game.name }}</div>
        <div class="w-1/4">{{ game.players.length }}</div>
        <div class="w-1/4">{{ startedAt(game.startedAt) }}</div>
        <div class="w-1/4">
          <button class="rounded bg-green-800 text-white cursor-pointer block hover:bg-green-900 p-2">
            View Game
          </button>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { DateTime, Interval } from "luxon";

export default {
  name: "CurrentGames",
  props: { games: Array },
  methods: {
    startedAt(date) {
      const createdAtDate = DateTime.fromISO(date);
      const now = DateTime.now();
      const interval = Interval.fromDateTimes(createdAtDate, now)
      const intervalInSeconds = interval.length("seconds");
      if (intervalInSeconds < 60) {
        const number = Math.floor(interval.length("seconds"));
        const second = number === 1 ? " second" : " seconds";
        return number + second + " ago";
      } else if (intervalInSeconds < 3600) {
        const number = Math.floor(interval.length("minutes"));
        const minute = number === 1 ? " minute" : " minutes";
        return number + minute + " ago";
      } else if (intervalInSeconds < 86400) {
        const number = Math.floor(interval.length("hours"));
        const hour = number === 1 ? " hour" : " hours";
        return number + hour + " ago";
      } else {
        const number = Math.floor(interval.length("days"));
        const day = number === 1 ? " day" : " days";
        return number + day + " ago";
      }
    }
  }
}
</script>

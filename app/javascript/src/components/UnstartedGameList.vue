<template>
  <div class="p-4">
    <b>Open Games</b>
    <div class="flex justify-between border-b border-black mt-2">
      <div class="w-1/5"><b>Name</b></div>
      <div class="w-1/5"><b>Players</b></div>
      <div class="w-1/5"><b>Host</b></div>
      <div class="w-1/5"><b>Open Since</b></div>
      <div class="w-1/5"></div>
    </div>
    <div v-for="game of games" v-bind:key="game.id">
      <router-link :to="{ path: '/game/' + game.id }" class="flex justify-between items-center hover:bg-gray-200 py-2">
        <div class="w-1/5">{{ game.name }}</div>
        <div class="w-1/5">{{ game.players.length }}</div>
        <div class="w-1/5">{{ game.host }}</div>
        <div class="w-1/5">{{ openSince(game.createdAt) }}</div>
        <div class="w-1/5">
          <button v-if="game.players.length < 6" class="rounded bg-green-800 text-white cursor-pointer block hover:bg-green-900 p-2">
            Join Game
          </button>
          <button v-else class="rounded bg-gray-800 text-white cursor-not-allowed block p-2">
            Game Full
          </button>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { DateTime, Interval } from "luxon";

export default {
  name: "UnstartedGameList",
  props: { games: Array, profile: Object },
  methods: {
    openSince(date) {
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

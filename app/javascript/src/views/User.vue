<template>
  <div class="container mx-auto w-3/4">
    <div class="border border-gray-400 rounded p-4 my-2 inline-block">
      <b>Settings:</b>
      <div>
        <p>Send me turn notifications via email:</p>
        <div>
          <input
            type="radio"
            :value="true"
            v-model="turnNotificationsEnabled"
            @change="resetTurnNotifications"
          >
          <label>On</label>
        </div>
        <div>
          <input
            type="radio"
            :value="false"
            v-model="turnNotificationsEnabled"
            @change="resetTurnNotifications"
          >
          <label>Off</label>
        </div>
      </div>
      <div>
        <button
          v-if="successfullyUpdated"
          class="rounded py-1 px-1 sm:px-3 bg-gray-200 cursor-default"
        >
          Saved
        </button>
        <button
          v-else
          class="rounded py-1 px-1 sm:px-3 bg-green-800 text-white"
          @click="save"
        >
          Save
        </button>
      </div>
    </div>
    <div v-if="gamesFetched" class="py-4">
      <p class="pb-4">
      {{ user.name }} has finished {{ finishedGames.length }} {{ finishedGameString }} and won {{ wonGames.length }} {{ wonGameString }}.
      </p>
      <b>{{ user.name }}'s Finished Games</b>
      <div class="flex border-b border-black mt-2">
        <div class="w-1/3"><b>Name</b></div>
        <div class="w-1/3"><b>Players</b></div>
        <div class="w-1/3"><b>Winner</b></div>
      </div>
      <div v-for="game of finishedGames" :key="game.id">
        <router-link :to="{ path: '/game/' + game.id }" class="flex justify-between items-center hover:bg-gray-200 py-2">
          <div class="w-1/3">{{ game.name }}</div>
          <div class="w-1/3">{{ game.players.length }}</div>
          <div class="w-1/3">{{ game.winner_name }}</div>
        </router-link>
      </div>
    </div>
    <div v-else class="py-4">
      Loading...
    </div>
  </div>
</template>

<script>
import { useCookies } from "vue3-cookies";

export default {
  name: "User",
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  created() {
    fetch("/api/users/" + this.$route.params.id)
      .then(response => response.json())
      .then(data => {
        this.user = data.user;
        this.finishedGames = data.games.filter(game => !!game.winner_name);
        this.wonGames = this.finishedGames.filter(game => game.winner_name === this.user.name)
        this.turnNotificationsEnabled = data.user.turn_notifications_enabled;
        this.gamesFetched = true;
      });
  },
  data() {
    return {
      user: {},
      finishedGames: [],
      wonGames: [],
      gamesFetched: false,
      successfullyUpdated: false,
      turnNotificationsEnabled: false
    }
  },
  computed: {
    finishedGameString() {
      return this.finishedGames.length === 1 ? "game" : "games"
    },
    wonGameString() {
      return this.wonGames.length === 1 ? "game" : "games"
    }
  },
  methods: {
    save() {
      fetch("/api/users/update", {
        method: "PUT",
        body: JSON.stringify({
          id: this.cookies.get("user_id"),
          turn_notifications_enabled: this.turnNotificationsEnabled
        }),
        headers: { "Content-Type": "application/json" }
      })
        .then((response) => response.json())
        .then((data) => {
          this.turnNotificationsEnabled = data.turn_notifications_enabled;
            this.successfullyUpdated = true;
        })
    },
    resetTurnNotifications() {
      this.successfullyUpdated = false;
    }
  }
}
</script>

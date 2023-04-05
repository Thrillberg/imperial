<template>
  <v-container>
    <div
      v-for="(error, index) in errors"
      :key="index"
    >
      {{ error }}
    </div>
    <div
      v-if="$attrs.profile.id === $route.params.id"
      class="border border-gray-400 rounded p-4 my-2 inline-block w-full"
    >
      <b>Settings</b>
      <div class="flex justify-around">
        <div>
          <p>Send me turn notifications via email</p>
          <div>
            <input
              v-model="turnNotificationsEnabled"
              type="radio"
              :value="true"
              @change="resetTurnNotifications"
            >
            <label>On</label>
          </div>
          <div>
            <input
              v-model="turnNotificationsEnabled"
              type="radio"
              :value="false"
              @change="resetTurnNotifications"
            >
            <label>Off</label>
          </div>
        </div>
        <div>
          <p>Send me turn notifications via Discord</p>
          <p class="text-xs">
            Leave blank if you do not want turn notifications on Discord
          </p>
          <div>
            <label class="text-sm">Discord User Id</label>
            <input
              v-model="discordId"
              type="text"
              placeholder="123456789123456789"
              class="rounded p-2 border border-green-800 my-2"
              @input="resetTurnNotifications"
            >
          </div>
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
    <div
      v-if="gamesFetched"
      class="py-4"
    >
      <p class="pb-4">
        {{ user.name }} has finished {{ finishedGames.length }} {{ finishedGameString }} and won {{ wonGames.length }} {{ wonGameString }}.
      </p>
      <b>{{ user.name }}'s Finished Games</b>
      <div class="flex border-b border-black mt-2">
        <div class="w-1/3 sm:w-1/5">
          <b>Name</b>
        </div>
        <div class="hidden sm:w-1/5 sm:inline-block">
          <b>Players</b>
        </div>
        <div class="w-1/3 sm:w-1/5">
          <b>Winner</b>
        </div>
        <div class="hidden sm:w-1/5 sm:inline-block">
          <b>Variant</b>
        </div>
        <div class="w-1/3 sm:w-1/5">
          <b>Finished On</b>
        </div>
      </div>
      <div
        v-for="game of finishedGames"
        :key="game.id"
      >
        <router-link
          :to="{ path: '/game/' + game.id }"
          class="flex justify-between items-center hover:bg-gray-200 py-2"
        >
          <div class="w-1/3 sm:w-1/5">
            {{ game.name }}
          </div>
          <div class="hidden sm:w-1/5 sm:inline-block">
            {{ game.players.length }}
          </div>
          <div class="w-1/3 sm:w-1/5">
            {{ truncate(game.winner_name) }}
          </div>
          <div class="hidden sm:w-1/5 sm:inline-block">
            {{ variant(game.base_game) }}
          </div>
          <div class="w-1/3 sm:w-1/5">
            {{ toDate(game.last_move_at) }}
          </div>
        </router-link>
      </div>
    </div>
    <div
      v-else
      class="py-4"
    >
      Loading...
    </div>
  </v-container>
</template>

<script>
import { DateTime } from 'luxon';

export default {
  name: 'User',
  data() {
    return {
      errors: [],
      user: {},
      finishedGames: [],
      wonGames: [],
      gamesFetched: false,
      successfullyUpdated: false,
      turnNotificationsEnabled: false,
      discordId: '',
    };
  },
  computed: {
    finishedGameString() {
      return this.finishedGames.length === 1 ? 'game' : 'games';
    },
    wonGameString() {
      return this.wonGames.length === 1 ? 'game' : 'games';
    },
  },
  created() {
    fetch(`/api/users/${this.$route.params.id}`)
      .then((response) => response.json())
      .then((data) => {
        this.user = data.user;
        this.finishedGames = data.games.filter(
          (game) => !!game.winner_name,
        ).sort((a, b) => a.last_move_at < b.last_move_at);
        this.wonGames = this.finishedGames.filter(
          (game) => game.winner_name === this.user.name,
        );
        this.turnNotificationsEnabled = data.user.turn_notifications_enabled;
        this.discordId = data.user.discord_id;
        this.gamesFetched = true;
        document.title = `${this.user.name}'s Profile - Imperial`;
      });
  },
  methods: {
    save() {
      fetch('/api/users/update', {
        method: 'PUT',
        body: JSON.stringify({
          id: this.$cookies.get('user_id'),
          turn_notifications_enabled: this.turnNotificationsEnabled,
          discord_id: this.discordId,
        }),
        headers: { 'Content-Type': 'application/json' },
      })
        .then((response) => response.json())
        .then((data) => {
          this.turnNotificationsEnabled = data.turn_notifications_enabled;
          this.discordId = data.discord_id;
          this.successfullyUpdated = true;
        });
    },
    resetTurnNotifications() {
      this.successfullyUpdated = false;
    },
    toDate(timestamp) {
      return DateTime.fromISO(timestamp).toLocaleString();
    },
    variant(baseGame) {
      if (baseGame === 'imperial') {
        return 'Imperial';
      } if (baseGame === 'imperial2030') {
        return 'Imperial 2030';
      }
    },
    truncate(string) {
      if (string.length > 10) {
        return `${string.slice(0, 10)}...`;
      }

      return string;
    },
  },
};
</script>

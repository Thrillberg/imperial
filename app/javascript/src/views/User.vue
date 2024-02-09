<template>
  <v-container>
    <div
      v-for="(error, index) in errors"
      :key="index"
    >
      {{ error }}
    </div>
    <v-card
      v-if="$attrs.profile.id === $route.params.id"
      class="border border-gray-400 rounded p-4 my-2 inline-block w-full"
    >
      <v-card-item>
        <v-card-title>Settings</v-card-title>
      </v-card-item>
      <v-card-text>
        <v-radio-group
          v-model="turnNotificationsEnabled"
          prepend-icon="mdi-email-outline"
          label="Send me turn notifications via email"
        >
          <v-radio
            label="On"
            :value="true"
            @change="resetTurnNotifications"
          />
          <v-radio
            label="Off"
            :value="false"
            @change="resetTurnNotifications"
          />
        </v-radio-group>
      </v-card-text>
      <v-card-text>
        <v-text-field
          v-model="discordId"
          label="Discord User Id"
          placeholder="123456789123456789"
          hint="Leave blank if you do not want turn notifications on Discord"
          persistent-hint
          @input="resetTurnNotifications"
        >
          <template #prepend>
            <component
              :is="discordLogo"
              class="v-icon v-icon--size-default"
              fill="#5865F2"
            />
          </template>
        </v-text-field>
      </v-card-text>
      <v-card-text>
        <v-btn
          color="primary-darken-1"
          @click="save"
        >
          Save
        </v-btn>
      </v-card-text>
    </v-card>
    <p class="pb-4">
      {{ user.name }} has finished {{ finishedGames.length }} {{ finishedGameString }} and won
      {{ wonGames.length }} {{ wonGameString }}.
    </p>
    <span class="text-h5">{{ user.name }}'s Finished Games</span>
    <v-table
      density="compact"
      hover
    >
      <thead>
        <tr>
          <th>Name</th>
          <th>Players</th>
          <th>Winner</th>
          <th>Variant</th>
          <th>Finished On</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="game of finishedGames"
          :key="game.id"
        >
          <td>
            <router-link :to="{ path: '/game/' + game.id }">
              <span>{{ game.name }}</span>
            </router-link>
          </td>
          <td>
            {{ game.players.length }}
          </td>
          <td>
            {{ truncate(game.winner_name) }}
          </td>
          <td>
            {{ variant(game.baseGame) }}
          </td>
          <td>
            {{ toDate(game.last_move_at) }}
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script>
import { DateTime } from 'luxon';
import { markRaw } from 'vue';
import discordLogo from '../assets/discord.svg';

export default {
  name: 'User',
  data() {
    return {
      discordLogo: markRaw(discordLogo),
      errors: [],
      user: {},
      finishedGames: [],
      wonGames: [],
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
        ).sort((a, b) => Date.parse(b.last_move_at) - Date.parse(a.last_move_at));
        this.wonGames = this.finishedGames.filter(
          (game) => game.winner_name === this.user.name,
        );
        this.turnNotificationsEnabled = data.user.turn_notifications_enabled;
        this.discordId = data.user.discord_id;
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
        return 'Imperial (Classic)';
      } if (baseGame === 'imperialEurope2030') {
        return 'Imperial (2030 Rules)';
      } if (baseGame === 'imperial2030') {
        return 'Imperial 2030';
      } if (baseGame === 'imperialAsia') {
        return 'Imperial Asia';
      }

      return 'Imperial';
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

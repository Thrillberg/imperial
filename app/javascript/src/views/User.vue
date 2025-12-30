<template>
  <v-container v-if="loading">
    <v-skeleton-loader
      type="heading, paragraph"
      class="mb-4"
    />
    <v-skeleton-loader
      type="table"
    />
  </v-container>
  <v-container v-else>
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
          prepend-icon="$emailOutline"
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
    <v-card>
      <v-card-title>{{ user.name }}</v-card-title>
      <v-card-subtitle>
        <p>Finished <b>{{ finishedGamesCount }}</b> {{ finishedGameString }}.</p>
        <p>Won <b>{{ wonGamesCount }}</b> {{ wonGameString }} ({{ Math.floor((wonGamesCount / finishedGamesCount) * 100) }}%).</p>
        <p>Member since <b>{{ toDateMonthYear(createdAt) }}</b>.</p>
      </v-card-subtitle>
      <v-table
        density="compact"
        hover
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Players</th>
            <th>Winner</th>
            <th>Base Game</th>
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
              {{ game.players_count }}
            </td>
            <td>
              {{ truncate(game.winner_name) }}
            </td>
            <td>
              {{ getBaseGame(game.base_game) }}
            </td>
            <td>
              {{ toDate(game.last_move_at) }}
            </td>
          </tr>
        </tbody>
      </v-table>
      <v-pagination
        v-model="meta.page"
        :length="meta.total_pages"
        @update:model-value="fetchFinishedGames"
      />
    </v-card>
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
      successfullyUpdated: false,
      turnNotificationsEnabled: false,
      discordId: '',
      user: null,
      loading: false,
      finishedGames: [],
      finishedGamesCount: 0,
      wonGamesCount: 0,
      createdAt: null,
      meta: {
        page: 1,
        total_pages: 1,
        total_count: 0,
      },
    };
  },
  computed: {
    finishedGameString() {
      return this.finishedGamesCount === 1 ? 'game' : 'games';
    },
    wonGameString() {
      return this.wonGamesCount === 1 ? 'game' : 'games';
    },
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler() {
        this.fetchFinishedGames(1);
      },
    },
  },
  mounted() {
    this.fetchFinishedGames(1);
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
    fetchFinishedGames(page = 1) {
      this.loading = true;

      fetch(`/api/users/${this.$route.params.id}?page=${page}`)
        .then((response) => response.json())
        .then((data) => {
          this.user = data.user;
          this.finishedGames = data.user.finished_games;
          this.finishedGamesCount = data.user.finished_games_count;
          this.wonGamesCount = data.user.won_games_count;
          this.createdAt = data.user.created_at;
          this.meta = data.user.meta;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    resetTurnNotifications() {
      this.successfullyUpdated = false;
    },
    toDate(timestamp) {
      return DateTime.fromISO(timestamp).toLocaleString();
    },
    toDateMonthYear(timestamp) {
      return DateTime.fromISO(timestamp).toLocaleString({ month: 'long', year: 'numeric' });
    },
    getBaseGame(baseGame) {
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
      if (string?.length > 10) {
        return `${string.slice(0, 10)}...`;
      }

      return string;
    },
  },
};
</script>

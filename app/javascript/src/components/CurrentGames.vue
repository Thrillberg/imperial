<template>
  <div class="text-h5">
    Current Games
  </div>
  <v-table
    density="compact"
    hover
  >
    <thead>
      <tr>
        <th>Name</th>
        <th>Players</th>
        <th>Started At</th>
        <th>Last Move At</th>
        <th>Variant</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="game of games"
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
          {{ toTime(game.startedAt) }}
        </td>
        <td>
          {{ toTime(game.lastMoveAt) }}
        </td>
        <td>
          {{ variant(game.baseGame) }}
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
import toTime from '../toTime';

export default {
  name: 'CurrentGames',
  props: { games: { type: Array, default: () => [] } },
  methods: {
    toTime(date) {
      return toTime(date);
    },
    variant(baseGame) {
      if (baseGame === 'imperial') {
        return 'Imperial';
      } if (baseGame === 'imperial2030') {
        return 'Imperial 2030';
      } if (baseGame === 'imperialAsia') {
        return 'Imperial Asia';
      }
      return '';
    },
  },
};
</script>

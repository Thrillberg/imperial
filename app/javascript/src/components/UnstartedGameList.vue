<template>
  <span class="text-h5">Open Games</span>
  <v-table
    density="compact"
    hover
  >
    <thead>
      <tr>
        <th>Name</th>
        <th>Players</th>
        <th>Host</th>
        <th>Open Since</th>
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
          {{ game.host }}
        </td>
        <td>
          {{ toTime(game.createdAt) }}
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
  name: 'UnstartedGameList',
  props: {
    games: { type: Array, default: () => [] }, profile: { type: Object, default: () => {} },
  },
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

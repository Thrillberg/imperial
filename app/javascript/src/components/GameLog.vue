<template>
  <v-container>
    <v-list>
      <GameLogEntry
        v-for="(entry, index) in processedLog"
        :key="index"
        :events="entry"
        :board="board"
        :index="processedLog.length - index - 1"
      />
    </v-list>
  </v-container>
</template>

<script>
import GameLogEntry from './GameLogEntry.vue';

export default {
  name: 'GameLog',
  components: { GameLogEntry },
  props: { log: Array, logTimestamps: Array, board: Object },
  computed: {
    processedLog() {
      // TODO: Pull these and their analogoues in action.js out into constants somewhere else
      const annotatedActions = [
        'playerGainsCash',
        'playerTradedInForABond',
        'playerAutoSkipsBondPurchase',
        'playerPaysForRondel',
        'playerInvests',
        'nationGainsTreasury',
        'nationGainsPowerPoints',
        'nationPaysPlayer',
        'investorCardHolderChanged',
        'nationControllerChanged',
      ];
      const rawlog = this.log || [];
      const timestamps = this.logTimestamps || [];
      const entries = [];
      let index = 0;
      rawlog.forEach((action) => {
        let timestamp = '';
        if (!annotatedActions.includes(action.type)) {
          timestamp = timestamps[index];
          index++;
        }
        if (action.type === 'initialize' || action.type === 'rondel') {
          entries.push({ event: [{ action, timestamp }] });
        } else {
          entries[entries.length - 1].event.push({ action, timestamp });
        }
      });
      return entries.reverse();
    },
  },
};
</script>

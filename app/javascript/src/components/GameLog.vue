<template>
  <div class="border border-black rounded p-2 m-2">
    <GameLogEntry
      v-for="(entry, index) in processedLog"
        :events="entry"
        :board="board"
        :key="index"
    ></GameLogEntry>
  </div>
</template>

<script>
import GameLogEntry from "./GameLogEntry.vue";
export default {
  name: "GameLog",
  props: { log: Array, logTimestamps: Array, board: Object },
  components: { GameLogEntry },
  computed: {
    processedLog() {
      // TODO: Pull these and their analogoues in action.js out into constants somewhere else
      const annotatedActions = [
        "playerGainsCash",
        "playerTradedInForABond",
        "playerAutoSkipsBondPurchase",
        "playerPaysForRondel",
        "playerInvests",
        "nationGainsTreasury",
        "nationGainsPowerPoints",
        "nationPaysPlayer"
      ];
      let rawlog = this.log || [];
      let timestamps = this.logTimestamps || [];
      let entries = [];
      let index = 0;
      rawlog.forEach((action) => {
        let timestamp = "";
        if (!annotatedActions.includes(action.type)) {
          timestamp = timestamps[index];
          index++
        }
        if (action.type === "initialize" || action.type === "rondel") {
          entries.push({event: [{ action, timestamp }]});
        } else {
          entries[entries.length - 1].event.push({ action, timestamp });
        }
      });
      return entries.reverse();
    }
  }
}
</script>

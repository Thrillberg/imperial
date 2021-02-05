<template>
  <div class="border border-black rounded p-2 m-2">
    <GameLogEntry
      v-for="(entry, index) in processedLog()"
        :events="entry"
        :key="index"
    ></GameLogEntry>
  </div>
</template>

<script>
import GameLogEntry from "./GameLogEntry.vue";
export default {
  name: "GameLog",
  props: { log: Array },
  components: { GameLogEntry },
  methods: {
    processedLog() {
      let rawlog = this.log || [];
      let entries = [];
      rawlog.forEach((action) => {
        if (action.type === "initialize" || action.type === "rondel") {
          entries.push({event: [action]});
        }
        else {
          entries[entries.length - 1].event.push(action);
        }
      });
      return entries.reverse();
    } 
  }
}
</script>
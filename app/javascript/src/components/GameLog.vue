<template>
  <div class="border border-black rounded p-2 m-2">
    
    <div>
      <GameLogEntry
        v-for="(entry, index) in processedLog()"
          :events="entry"
          :key="index"
      ></GameLogEntry>
    </div>
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
      let rawlog = this.log;
      let entries = [];
      rawlog.forEach((action) => {
        if (action.type === "initialize") {
          entries.push({event: action});
        } else if (action.type === "rondel") {
          entries.push({event: [action]});
        }
        else {
          entries[entries.length - 1].event.push(action);
        }
      });
      return entries.slice().reverse();
    } 
  }
}
</script>
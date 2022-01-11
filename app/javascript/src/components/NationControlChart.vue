<template>
  <div class="w-3/4 m-auto">
    <GChart
      type="Timeline"
      :settings="{ packages: ['timeline'] }"
      :data="chartData()"
      :options="chartOptions()"
    />
  </div>
</template>

<script>
import { GChart } from "vue-google-charts";

import Imperial from "../../lib/imperial.js";

import { nationColors } from "../../../../nationColors.js";

export default {
  components: { GChart },
  data: () => ({
    ticks: []
  }), 
  props: { game: Object },
  mounted() {
    let imperialGame = new Imperial(this.game.board);
    this.labels = Object.keys(this.game.players)
    this.game.log.forEach((action) => {
      imperialGame.tick(action)
      let update = {};
      for (const [nation, data] of imperialGame.nations) {
        update[nation.value] = data.controller;
      }
      this.ticks.push(update)
    });
  },
  methods: {
    chartData() {
      let data = [
        [
          {label: "player", type: "string"},
          {label: "player name and nation", type: "string"},
          {type: "string", role: "style"},
          {label: "start", type: "number"},
          {label: "end", type: "number"}
        ]
      ];
      for (const player in this.game.players) {
        for (const [nation,] of this.game.nations) {
          let tickIndex = 0;
          let controller = "";
          this.ticks.forEach(tick => {
            if (tick[nation.value] !== controller) {
              // Nation is changing hands
              if (tick[nation.value] === player) {
                // Player just got nation
                data.push([player, nation.value, nationColors[nation.value], tickIndex])
              } else if (controller === player) {
                // Player just lost nation
                data[data.length - 1].push(tickIndex)
              }
            }
            controller = tick[nation.value]
            tickIndex += 1
          });
          if (data[data.length - 1].length === 4) {
            data[data.length - 1].push(this.ticks.length)
          }
        }
      }
      return data;
    },
    chartOptions() {
      return {
        enableInteractivity: false,
        height: 450,
        timeline: { showRowLabels: true }
      }
    }
  }
}
</script>

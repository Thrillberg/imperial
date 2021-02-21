<template>
  <div class="flex flex-grow justify-center" :class="currentNation()">
    <div class="p-3">
      <p><b>{{ stringify(nation) }}</b></p>
      <svg xmlns="http://www.w3.org/2000/svg" height="40" width="60">
        <Flag
          :nation="nation"
          :height="(40).toString()"
          :filter="controller === current_player ? '' : 'grayscale'"
        ></Flag>
      </svg>
      <p>{{ controller }}</p>
    </div>
    <div class="flex flex-col justify-center">
      <div>{{ treasury }}m</div>
      <div>{{ power_points }} power</div>
      <div>{{ tax_chart_position }} tax</div>
    </div>
  </div>
</template>

<script>
import Flag from "./flags/Flag.vue";

import stringify from "../stringify.js";

export default {
  name: "NationComponent",
  components: { Flag },
  props: {
    current_nation: String,
    current_player: String,
    controller: String,
    nation: String,
    power_points: Number,
    tax_chart_position: Number,
    treasury: Number
  },
  methods: {
    currentNation() {
      if (this.current_nation === this.nation && this.controller === this.current_player) {
        return `bg-${this.nation} border-4 border-black`
      };

      if (this.current_nation === this.nation) {
        return `bg-${this.nation}`
      };

      return ""
    },
    stringify(nation) {
      return stringify(nation);
    }
  }
};
</script>

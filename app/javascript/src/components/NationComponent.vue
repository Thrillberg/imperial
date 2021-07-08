<template>
  <div class="p-0.5 border border-gray-500" :class="currentNation() + width()">
    <p><b>{{ stringify(nation) }}</b></p>
    <div class="flex">
      <div class="p-2">
        <svg xmlns="http://www.w3.org/2000/svg" height="30" width="45">
          <Flag
            :nation="nation"
            :filter="controller === current_player ? '' : 'grayscale'"
          ></Flag>
        </svg>
        <p>{{ controller }}</p>
      </div>
      <div class="flex flex-col justify-center">
        <div :class="canPayOut ? '' : 'text-red-500 font-bold'">{{ treasury }}m</div>
        <div>{{ power_points }} power</div>
      </div>
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
    baseGame: String,
    canPayOut: Boolean,
    current_nation: String,
    current_player: String,
    controller: String,
    nation: String,
    power_points: Number,
    treasury: Number
  },
  methods: {
    currentNation() {
      if (this.current_nation === this.nation && this.controller === this.current_player) {
        return `bg-${this.nation} border-4 border-black `
      }

      if (this.current_nation === this.nation) {
        return `bg-${this.nation} `
      }

      return ""
    },
    width() {
      if (this.baseGame === "imperial") {
        return "lg:w-1/3 xl:w-1/3 2xl:w-1/6"
      } else if (this.baseGame === "imperial2030") {
        return "w-1/6"
      }
    },
    stringify(nation) {
      return stringify(nation);
    }
  }
};
</script>

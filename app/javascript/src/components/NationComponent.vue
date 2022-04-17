<template>
  <div class="p-0.5" :class="currentNation() + width()">
    <p><b>{{ stringify(nation) }}</b></p>
    <svg xmlns="http://www.w3.org/2000/svg" height="30" width="45">
      <Flag
        :nation="nation"
        :filter="controller === current_player ? '' : 'grayscale'"
      ></Flag>
    </svg>
    <div class="flex flex-col justify-center">
      <div :class="canPayOut ? '' : 'text-red-500 font-bold'">${{ treasury }}mil</div>
      <div>{{ power_points }} power</div>
      <div
        v-if="winner"
        class="text-center font-bold text-xl"
      >
        x{{ Math.floor(power_points / 5) }}
      </div>
    </div>
    <p class="pt-2 text-base">{{ truncate(controller) }}</p>
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
    treasury: Number,
    winner: String
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
        return "w-1/3 md:w-full lg:w-full xl:w-full 2xl:w-full"
      } else if (this.baseGame === "imperial2030") {
        return "w-1/3 lg:w-1/3 xl:w-1/3 2xl:w-1/6"
      }
    },
    stringify(nation) {
      return stringify(nation);
    },
    truncate(string) {
      string = string || "";
      if (string.length > 10) {
        return string.slice(0, 10) + "...";
      }

      return string;
    },
  }
};
</script>

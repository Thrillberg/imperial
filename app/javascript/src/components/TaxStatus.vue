<template>
  <div>
    <button
      class="rounded py-2 px-6 m-1 sm:m-4 bg-green-200 cursor-pointer"
      v-if="!showTaxStatus"
      @click="showTaxStatus = true"
    >
      Show tax status
    </button>
    <button
      class="rounded py-2 px-6 m-1 sm:m-4 bg-green-200 cursor-pointer"
      v-if="showTaxStatus"
      @click="showTaxStatus = false"
    >
      Hide tax status
    </button>
    <div v-if="showTaxStatus">
      <div class="flex justify-between">
        <span class="w-1/3"></span>
        <span class="w-1/5">Flags</span>
        <span class="w-1/5">Tax amount</span>
        <span class="w-1/5">Power Points</span>
      </div>
      <div v-for="[nation,] of game.nations" :key="nation.value" class="flex justify-between">
        <span class="w-1/3">
          <strong>{{ stringify(nation.value) }}</strong>
        </span>
        <span class="w-1/5"> {{ flagsPlaced(nation) }} </span>
        <span class="w-1/5"> {{ nextTaxAmount(nation) }} </span>
        <span class="w-1/5"> {{ nextTaxationPowerPoints(nation) }} </span>
      </div>
      <p class="text-sm">This shows the power points and tax chart positions of each nation if they were to tax <i>right now</i>.</p>
    </div>
  </div>
</template>

<script>
import { nextTaxationPowerPoints } from "../taxChartHelpers.js";
import stringify from "../stringify.js";

export default {
  name: "TaxStatus",
  props: { game: Object },
  data: () => ({ showTaxStatus: false }),
  methods: {
    stringify(nation) {
      return stringify(nation)
    },
    flagsPlaced(nation) {
      return this.game.flagCount(nation || this.game.currentNation);
    },
    nextTaxAmount(nation) {
      return `$${this.game.getTaxes(nation || this.game.currentNation)}m`;
    },
    nextTaxationPowerPoints(nation) {
      const uncappedPowerPoints = nextTaxationPowerPoints(this.game, nation);

      if (uncappedPowerPoints > 25) {
        return `25 (${uncappedPowerPoints})`;
      } else {
        return uncappedPowerPoints.toString();
      }
    },
  }
}
</script>

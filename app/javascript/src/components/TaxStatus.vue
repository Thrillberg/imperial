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
        <span class="w-1/6">Flags</span>
        <span class="w-1/6">Tax Amount</span>
        <span class="w-1/6">Nation Profit</span>
        <span class="w-1/6">Power Points</span>
      </div>
      <div v-for="[nation,] of game.nations" :key="nation.value" class="flex justify-between">
        <span class="w-1/3">
          <strong>{{ stringify(nation.value) }}</strong>
        </span>
        <span class="w-1/6"> {{ flagsPlaced(nation) }} </span>
        <span class="w-1/6"> {{ nextTaxAmount(nation) }} </span>
        <span class="w-1/6"> {{ nextNationProfit(nation) }} </span>
        <span class="w-1/6"> {{ nextTaxationPowerPoints(nation) }} </span>
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
    stringify(nationName) {
      return stringify(nationName)
    },
    flagsPlaced(nationName) {
      return this.game.flagCount(nationName || this.game.currentNation);
    },
    nextTaxAmount(nationName) {
      return `$${this.game.getTaxes(nationName || this.game.currentNation)}m`;
    },
    nextNationProfit(nationName) {
      nationName = nationName || this.game.currentNation;
      const taxes = this.game.getTaxes(nationName);
      const nationProfit = this.game.nationTaxationProfit(nationName, taxes);

      if (nationProfit < 0) {
        return `-$${Math.abs(nationProfit)}m`;
      } else {
        return `$${nationProfit}m`;
      }
    },
    nextTaxationPowerPoints(nationName) {
      const uncappedPowerPoints = nextTaxationPowerPoints(this.game, nationName);

      if (uncappedPowerPoints > 25) {
        return `25 (${uncappedPowerPoints})`;
      } else {
        return uncappedPowerPoints.toString();
      }
    },
  }
}
</script>

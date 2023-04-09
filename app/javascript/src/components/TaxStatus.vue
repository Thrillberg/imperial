<template>
  <div>
    <button
      v-if="!showTaxStatus"
      class="rounded py-2 px-6 m-1 sm:m-4 bg-green-200 cursor-pointer"
      @click="showTaxStatus = true"
    >
      Show tax status
    </button>
    <button
      v-if="showTaxStatus"
      class="rounded py-2 px-6 m-1 sm:m-4 bg-green-200 cursor-pointer"
      @click="showTaxStatus = false"
    >
      Hide tax status
    </button>
    <div v-if="showTaxStatus">
      <div class="flex justify-between">
        <span class="w-1/3" />
        <span class="w-1/6">Flags</span>
        <span class="w-1/6">Tax Revenue</span>
        <span class="w-1/6">Nation Profit</span>
        <span class="w-1/6">Power Points</span>
      </div>
      <div
        v-for="[nation,] of game.nations"
        :key="nation.value"
        class="flex justify-between"
      >
        <span class="w-1/3">
          <strong>{{ displayNationName(nation.value) }}</strong>
        </span>
        <span class="w-1/6"> {{ flagsPlaced(nation) }} </span>
        <span class="w-1/6"> {{ displayMonetaryValue_InMillions(nextTaxRevenue(nation)) }} </span>
        <span class="w-1/6"> {{ displayMonetaryValue_InMillions(nextNationProfit(nation)) }} </span>
        <span class="w-1/6"> {{ nextTaxationPowerPoints(nation) }} </span>
      </div>
      <p class="text-sm">
        This shows the power points and tax chart positions of each nation if they were to tax <i>right now</i>.
      </p>
    </div>
  </div>
</template>

<script>
import { displayMonetaryValueInMillions, displayNationName } from '../stringify';
import { nextTaxationPowerPoints } from '../taxChartHelpers';

export default {
  name: 'TaxStatus',
  props: { game: { type: Object, default: () => {} } },
  data: () => ({ showTaxStatus: false }),
  methods: {
    displayNationName(nation) {
      return displayNationName(nation);
    },
    displayMonetaryValue_InMillions(value) {
      return displayMonetaryValueInMillions(value);
    },
    flagsPlaced(nationName) {
      return this.game.flagCount(nationName);
    },
    nextTaxRevenue(nationName) {
      return this.game.taxRevenueOf(nationName);
    },
    nextNationProfit(nationName) {
      const taxRevenue = this.game.taxRevenueOf(nationName);
      return this.game.nationTaxationProfit(nationName, taxRevenue);
    },
    nextTaxationPowerPoints(nationName) {
      const uncappedPowerPoints = nextTaxationPowerPoints(this.game, nationName);

      if (uncappedPowerPoints > 25) {
        return `25 (${uncappedPowerPoints})`;
      }
      return uncappedPowerPoints.toString();
    },
  },
};
</script>

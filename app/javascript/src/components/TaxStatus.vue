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
        <span class="w-1/3">Power points</span>
        <span v-if="game.baseGame === 'imperial'" class="w-1/3">Tax chart position</span>
      </div>
      <div v-for="[nation,] of game.nations" :key="nation.value" class="flex justify-between">
        <span class="w-1/3">
          <strong>{{ stringify(nation.value) }}</strong>
        </span>
        <span class="w-1/3">
          {{ nextTaxationPowerPoints(nation) }}
        </span>
        <span v-if="game.baseGame === 'imperial'" class="w-1/3">
          {{ nextTaxChartPosition(nation) }}
        </span>
      </div>
      <p class="text-sm">This shows the power points and tax chart positions of each nation if they were to tax <i>right now</i>.</p>
    </div>
  </div>
</template>

<script>
import { nextTaxChartPosition, nextTaxationPowerPoints } from "../taxChartHelpers.js";
import stringify from "../stringify.js";

export default {
  name: "TaxStatus",
  props: { game: Object },
  data: () => ({ showTaxStatus: false }),
  methods: {
    nextTaxationPowerPoints(nation) {
      return nextTaxationPowerPoints(this.game, nation);
    },
    nextTaxChartPosition(nation) {
      return nextTaxChartPosition(this.game, nation);
    },
    stringify(nation) {
      return stringify(nation)
    }
  }
}
</script>

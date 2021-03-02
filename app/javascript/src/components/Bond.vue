<template>
  <div :class="'m-2 border-2 border-' + border() +'-500 p-1 tooltip bg-' + bond.nation.value" :style="filter === 'grayscale' ? {filter: 'grayscale(1)'} : {}">
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="20">
      <Flag :nation="bond.nation.value" width="30" />
    </svg>
    {{ bond.number }}:{{ bond.cost }}
    <div v-if="!!tradedBond" class="tooltip-text border border-red-500 p-1 rounded mt-3 bg-white">
      Purchase for {{ this.tradedBondString() }}.
    </div>
    <div v-else-if="canBePurchased" class="tooltip-text border border-green-500 p-1 rounded mt-3 bg-white">
      Purchase for {{ bond.cost }}m.
    </div>
  </div>
</template>

<script>
import Flag from "./flags/Flag.vue";

import stringify from "../stringify.js";

export default {
  name: "Bond",
  props: {
    bond: Object,
    filter: String,
    tradedBond: Object,
    canBePurchased: Boolean
  },
  components: { Flag },
  methods: {
    border() {
      if (!!this.tradedBond) {
        return "red";
      } else {
        return "green";
      }
    },
    tradedBondString() {
      return `${stringify(this.tradedBond.nation.value)} - ${this.tradedBond.number}:${this.tradedBond.cost}(trade in)${this.extraCashString()}`;
    },
    extraCashString() {
      const difference = this.bond.cost - this.tradedBond.cost;
      if (difference > 0) {
        return ` and ${difference}m cash`
      } else {
        return ""
      }
    }
  }
};
</script>

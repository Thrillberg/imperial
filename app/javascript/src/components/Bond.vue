<template>
  <div
    :class="'m-1 border-2 border-' + border() +'-500 p-1 tooltip bg-' + bond.nation.value"
    :style="filter === 'grayscale' ? {filter: 'grayscale(1)'} : {}"
    @click="click"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="20">
      <Flag :nation="bond.nation.value" width="30" />
    </svg>
    {{ bond.number }}:{{ bond.cost }}
    <div v-if="canBePurchased && !isBeingAppliedToTradeIn" class="tooltip-text border border-green-500 p-1 rounded mt-3 bg-white">
      Purchase for {{ bond.cost }}m.
    </div>
    <div v-if="canBePurchased && isBeingAppliedToTradeIn" class="tooltip-text border border-green-500 p-1 rounded mt-3 bg-white">
      Purchase for {{ bond.cost - tradedInValue }}m plus the {{ tradedInValue }}m bond.
    </div>
  </div>
</template>

<script>
import Flag from "./flags/Flag.vue";

export default {
  name: "Bond",
  props: {
    toggleTradeIn: Function,
    tradedInValue: Number,
    bond: Object,
    canBeAppliedToTradeIn: Boolean,
    isBeingAppliedToTradeIn: Boolean,
    filter: String,
    canBePurchased: Boolean
  },
  components: { Flag },
  methods: {
    click() {
      if (this.canBeAppliedToTradeIn) {
        this.toggleTradeIn(this.bond)
      }
    },
    border() {
      if (this.isBeingAppliedToTradeIn) {
        return "yellow";
      } else {
        return "green";
      }
    }
  }
};
</script>

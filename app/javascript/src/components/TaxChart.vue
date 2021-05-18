<template>
  <div class="flex flex-row-reverse justify-evenly border border-gray-500 mx-0.5">
    <TaxChartSlot
      v-for="taxChartSlot in taxes"
      v-bind:taxSlot="taxChartSlot.slot"
      v-bind:nations="taxChartSlot.nations"
      v-bind:key="taxChartSlot.slot"
    ></TaxChartSlot>
    <div class="flex flex-col justify-between">
      <div>Tax</div>
      <div>Points</div>
    </div>
  </div>
</template>

<script>
import TaxChartSlot from "./TaxChartSlot.vue";

export default {
  name: "TaxChart",
  components: {
    TaxChartSlot
  },
  props: {
    taxes: Array
  }
};
</script>

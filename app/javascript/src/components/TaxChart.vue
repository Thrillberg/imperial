<template>
  <div
    class="w-40 float-right border border border-solid border-black bg-teal-200"
  >
    <div class="flex justify-evenly text-2xl">
      <span class="m-2">Tax</span>
      <span class="w-24" />
      <span class="m-2">Points</span>
    </div>
    <hr class="border-black" />
    <div class="flex flex-col justify-evenly">
      <TaxChartSlot
        v-for="taxChartSlot in taxes"
        v-bind:taxSlot="taxChartSlot.slot"
        v-bind:nations="taxChartSlot.nations"
        v-bind:key="taxChartSlot.slot"
      ></TaxChartSlot>
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

<template>
  <div class="flex flex-row-reverse justify-evenly border border-gray-500 mx-0.5">
    <TaxChartSlot
      v-for="taxChartSlot in taxes"
      :bonus="taxChartSlot.bonus"
      :taxSlot="taxChartSlot.slot"
      :nations="taxChartSlot.nations"
      :powerPointIncrease="taxChartSlot.powerPointIncrease"
      :showBonus="showBonus"
      :key="taxChartSlot.slot"
    ></TaxChartSlot>
    <div class="flex flex-col justify-between">
      <div>Tax</div>
      <div v-if="showBonus">Bonus</div>
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
    showBonus: Boolean,
    taxes: Array
  }
};
</script>

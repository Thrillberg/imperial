<template>
  <div v-if="taxChartVisible" class="flex flex-row-reverse justify-evenly border border-gray-500 mx-0.5">
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
    <div
      class="text-xl 2xl:text-3xl border rounded-full h-7 w-7 2xl:h-12 2xl:w-12 flex items-center justify-center bg-green-200 my-auto cursor-pointer"
      v-on:click="toggleTaxChart"
    >
      ?
    </div>
  </div>
  <div v-else class="flex flex-row justify-evenly border border-gray-500 mx-0.5 py-2">
    <div
      class="text-xl 2xl:text-2xl border rounded-full h-7 w-7 2xl:h-12 2xl:w-12 flex items-center justify-center bg-green-200 my-auto cursor-pointer"
      v-on:click="toggleTaxChart"
    >
      ◀
    </div>
    <div>
      <b>0x</b>
      <div class="text-sm">0-4 power points</div>
    </div>
    <div>
      <b>1x</b>
      <div class="text-sm">5-9 power points</div>
    </div>
    <div>
      <b>2x</b>
      <div class="text-sm">10-14 power points</div>
    </div>
    <div>
      <b>3x</b>
      <div class="text-sm">15-19 power points</div>
    </div>
    <div>
      <b>4x</b>
      <div class="text-sm">20-24 power points</div>
    </div>
    <div>
      <b>5x</b>
      <div class="text-sm">25 power points</div>
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
  data: () => {
    return {
      taxChartVisible: true
    }
  },
  props: {
    showBonus: Boolean,
    taxes: Array
  },
  methods: {
    toggleTaxChart() {
      this.taxChartVisible = !this.taxChartVisible
    }
  },
};
</script>

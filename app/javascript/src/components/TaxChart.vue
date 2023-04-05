<template>
  <v-row
    v-if="taxChartVisible"
    class="flex-row-reverse justify-space-evenly"
  >
    <TaxChartSlot
      v-for="taxChartSlot in taxes"
      :key="taxChartSlot.slot"
      :bonus="taxChartSlot.bonus"
      :tax-slot="taxChartSlot.slot"
      :nations="taxChartSlot.nations"
      :power-point-increase="taxChartSlot.powerPointIncrease"
      :show-bonus="showBonus"
    />
    <div class="flex flex-col justify-between">
      <div>Tax</div>
      <div v-if="showBonus">
        Bonus
      </div>
      <div>Points</div>
    </div>
    <v-btn
      icon="mdi-help"
      color="primary"
      @click="toggleTaxChart"
    />
  </v-row>
  <div
    v-else
    class="flex flex-row justify-evenly border border-gray-500 mx-0.5 py-2"
  >
    <div
      class="text-xl 2xl:text-2xl border rounded-full h-7 w-7 2xl:h-12 2xl:w-12 flex items-center justify-center bg-green-200 my-auto cursor-pointer"
      @click="toggleTaxChart"
    >
      ◀
    </div>
    <div>
      <b>0x</b>
      <div class="text-sm">
        0-4 power points
      </div>
    </div>
    <div>
      <b>1x</b>
      <div class="text-sm">
        5-9 power points
      </div>
    </div>
    <div>
      <b>2x</b>
      <div class="text-sm">
        10-14 power points
      </div>
    </div>
    <div>
      <b>3x</b>
      <div class="text-sm">
        15-19 power points
      </div>
    </div>
    <div>
      <b>4x</b>
      <div class="text-sm">
        20-24 power points
      </div>
    </div>
    <div>
      <b>5x</b>
      <div class="text-sm">
        25 power points
      </div>
    </div>
  </div>
</template>

<script>
import TaxChartSlot from './TaxChartSlot.vue';

export default {
  name: 'TaxChart',
  components: {
    TaxChartSlot,
  },
  props: {
    showBonus: Boolean,
    taxes: Array,
  },
  data: () => ({
    taxChartVisible: true,
  }),
  methods: {
    toggleTaxChart() {
      this.taxChartVisible = !this.taxChartVisible;
    },
  },
};
</script>

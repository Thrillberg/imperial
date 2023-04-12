<template>
  <v-dialog
    v-model="dialog"
    width="auto"
  >
    <template #activator="{ props }">
      <v-btn
        color="primary"
        v-bind="props"
      >
        Tax chart
      </v-btn>
    </template>

    <v-card>
      <v-card-title>Tax Chart</v-card-title>
      <v-card-text>
        <v-row
          class="flex-row-reverse"
          justify="space-evenly"
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
        </v-row>
        <v-table>
          <thead>
            <tr>
              <th>0x</th><th>1x</th><th>2x</th><th>3x</th><th>4x</th><th>5x</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0-4 power points</td>
              <td>5-9 power points</td>
              <td>10-14 power points</td>
              <td>15-19 power points</td>
              <td>20-24 power points</td>
              <td>25 power points</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary-darken-1"
          block
          @click="dialog = false"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import TaxChartSlot from './TaxChartSlot.vue';

export default {
  name: 'TaxChart',
  components: {
    TaxChartSlot,
  },
  props: {
    showBonus: { type: Boolean, default: false },
    taxes: { type: Array, default: () => [] },
  },
  data: () => ({
    dialog: false,
  }),
};
</script>

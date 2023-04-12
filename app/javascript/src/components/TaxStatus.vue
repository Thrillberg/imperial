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
        Tax status
      </v-btn>
    </template>

    <v-card>
      <v-card-title>Tax Status</v-card-title>
      <v-card-subtitle>
        This shows the power points and tax chart positions of each nation if they were to tax <i>right now</i>.
      </v-card-subtitle>
      <v-card-text>
        <v-table>
          <thead>
            <tr>
              <th />
              <th>
                Flags
              </th>
              <th>
                Tax Revenue
              </th>
              <th>
                Nation Profit
              </th>
              <th>
                Power Points
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="[nation,] of game.nations"
              :key="nation.value"
            >
              <td>
                <strong>{{ displayNationName(nation.value) }}</strong>
              </td>
              <td>
                {{ flagsPlaced(nation) }}
              </td>
              <td>
                {{ displayMonetaryValue_InMillions(nextTaxRevenue(nation)) }}
              </td>
              <td>
                {{ displayMonetaryValue_InMillions(nextNationProfit(nation)) }}
              </td>
              <td>
                {{ nextTaxationPowerPoints(nation) }}
              </td>
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
import { displayMonetaryValueInMillions, displayNationName } from '../stringify';
import { nextTaxationPowerPoints } from '../taxChartHelpers';

export default {
  name: 'TaxStatus',
  props: { game: { type: Object, default: () => {} } },
  data: () => ({ dialog: false }),
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

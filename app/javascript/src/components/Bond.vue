<template>
  <v-tooltip
    :disabled="!canBePurchased"
    :text="tooltipText"
  >
    <template #activator="{ props }">
      <v-sheet
        class="d-inline-block mx-2 px-2 py-2"
        :color="backgroundColor()"
        :elevation="isBeingAppliedToTradeIn ? 10 : 0"
        rounded
        :style="filter === 'grayscale' ? {filter: 'grayscale(1)'} : {}"
        v-bind="props"
        @click="$emit('click', bond)"
      >
        <v-row>
          <v-col>
            <Flag
              :nation="nation"
              width="30"
              height="20"
            />
          </v-col>
        </v-row>
        <div class="d-flex justify-center">
          {{ bond.number }}:{{ bond.cost }}
        </div>
      </v-sheet>
    </template>
  </v-tooltip>
</template>

<script>
import Flag from './flags/Flag.vue';

export default {
  name: 'Bond',
  components: { Flag },
  props: {
    toggleTradeIn: { type: Function, default: () => {} },
    tradedInValue: { type: Number, default: 0 },
    bond: { type: Object, default: () => {} },
    isBeingAppliedToTradeIn: Boolean,
    filter: { type: String, default: '' },
    canBePurchased: Boolean,
  },
  emits: ['click'],
  computed: {
    nation() {
      if (this.bond.nation.value === 'CN' && this.bond.nation.label === 'NationAsia') {
        return 'CNAsia';
      }
      return this.bond.nation.value;
    },
    tooltipText() {
      if (this.canBePurchased && !this.isBeingAppliedToTradeIn) {
        return `Purchase for ${this.bond.cost}m.`;
      }

      if (this.canBePurchased && this.isBeingAppliedToTradeIn) {
        return `Purchase for ${this.bond.cost - this.tradedInValue} m plus the ${this.tradedInValue}m bond.`;
      }

      return '';
    },
  },
  methods: {
    backgroundColor() {
      if (this.bond.nation.value === 'GE' && this.bond.nation.label === 'NationAsia') {
        return 'GEAsia';
      }
      return this.bond.nation.value;
    },
  },
};
</script>

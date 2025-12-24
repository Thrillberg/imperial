<template>
  <v-tooltip
    :disabled="!canBePurchased"
    :text="tooltipText"
  >
    <template #activator="{ props }">
      <div class="d-inline-block position-relative">
        <v-sheet
          class="d-inline-block mx-1 px-2 my-1 py-2"
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
        <svg
          v-if="typeOfOwnership !== 'none'"
          class="position-absolute"
          style="top: 4; right: 8; z-index: 10;"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="17"
          height="17"
          :fill="ownershipFillColor"
          stroke="#000000"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>
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
    typeOfOwnership: { type: String, default: 'none' },
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
    ownershipFillColor() {
      if (this.typeOfOwnership === 'new') {
        return '#FFD700';
      } if (this.typeOfOwnership === 'incumbent') {
        return '#C0C0C0';
      }

      return '#000000';
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

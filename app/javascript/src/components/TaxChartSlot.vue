<template>
  <v-col>
    <b>
      {{ taxSlot }}
    </b>
    <div
      v-if="!showBonus"
      class="flex flex-wrap h-5"
    >
      <svg
        v-for="nation in nations"
        :key="nation"
        width="14px"
        height="14px"
        viewBox="0 0 14 14"
        version="1.1"
        class="m-0.5"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <g>
          <circle
            :cx="7"
            :cy="7"
            r="7"
            stroke-width="0.5"
            stroke="black"
            :fill="fill(nation)"
          />
        </g>
      </svg>
    </div>
    <div v-if="showBonus">
      {{ bonus }}
    </div>
    <div>+ {{ powerPointIncrease }}</div>
  </v-col>
</template>

<script>
export default {
  name: 'TaxChartSlot',
  props: {
    bonus: { type: Number, default: 0 },
    taxSlot: { type: Number, default: 0 },
    nations: { type: Array, default: () => [] },
    powerPointIncrease: { type: Number, default: 0 },
    showBonus: { type: Boolean, default: false },
  },
  methods: {
    fill(nation) {
      switch (nation) {
        case 'AH':
          return '#EBE084';
        case 'IT':
          return '#6E8D4E';
        case 'FR':
          return '#54BFF9';
        case 'GB':
          return '#EF7F72';
        case 'GE':
          return '#8F8F8F';
        case 'RU':
          return '#9C6BAE';
        case 'CN':
          return '#ebe084';
        case 'IN':
          return 'silver';
        case 'BR':
          return '#6E8D4E';
        case 'US':
          return '#EF7F72';
        case 'EU':
          return '#54bff9';
        default:
          return '#FFFFFF';
      }
    },
  },
};
</script>

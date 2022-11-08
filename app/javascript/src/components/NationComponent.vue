<template>
  <div
    class="p-0.5"
    :class="currentNationClass() + width()"
  >
    <p><b>{{ stringify(nation) }}</b></p>
    <Flag
      :nation="nation"
      :filter="controller === currentPlayer ? '' : 'grayscale'"
      height="30"
      width="45"
    />
    <div class="flex flex-col justify-center">
      <div :class="canPayOut ? '' : 'text-red-500 font-bold'">
        ${{ treasury }}mil
      </div>
      <div>{{ powerPoints }} power</div>
      <div
        v-if="winner"
        class="text-center font-bold text-xl"
      >
        x{{ Math.floor(powerPoints / 5) }}
      </div>
    </div>
    <p class="pt-2 text-base">
      {{ truncate(controller) }}
    </p>
  </div>
</template>

<script>
import Flag from './flags/Flag.vue';

import stringify from '../stringify';

export default {
  name: 'NationComponent',
  components: { Flag },
  props: {
    baseGame: { type: String, default: '' },
    canPayOut: Boolean,
    currentNation: { type: String, default: '' },
    currentPlayer: { type: String, default: '' },
    controller: { type: String, default: '' },
    nation: { type: String, default: '' },
    powerPoints: { type: Number, default: 0 },
    treasury: { type: Number, default: 0 },
    winner: { type: String, default: '' },
  },
  methods: {
    currentNationClass() {
      if (this.currentNation === this.nation && this.controller === this.currentPlayer) {
        return `bg-${this.nation} border-4 border-black `;
      }

      if (this.currentNation === this.nation) {
        return `bg-${this.nation} `;
      }

      return '';
    },
    width() {
      if (this.baseGame === 'imperial') {
        return 'w-1/3 md:w-full lg:w-full xl:w-full 2xl:w-full';
      }

      if (this.baseGame === 'imperial2030' || this.baseGame === 'imperialAsia') {
        return 'w-1/3 lg:w-1/3 xl:w-1/3 2xl:w-1/6';
      }

      return '';
    },
    stringify(nation) {
      return stringify(nation);
    },
    truncate(string) {
      string = string || '';
      if (string.length > 10) {
        return `${string.slice(0, 10)}...`;
      }

      return string;
    },
  },
};
</script>

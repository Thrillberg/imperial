<template>
  <v-col>
    <v-card :class="currentNationClass()">
      <v-card-text>
        <div><b>{{ displayNationName(nation) }}</b></div>
        <Flag
          :nation="nation"
          :filter="controller === currentPlayer ? '' : 'grayscale'"
          height="20"
          width="30"
        />
        <div :class="canPayOut ? '' : 'text-red font-weight-bold'">
          ${{ treasury }}mil
        </div>
        <div>{{ powerPoints }} power</div>
        <div
          v-if="winner"
          class="text-center font-bold text-xl"
        >
          x{{ Math.floor(powerPoints / 5) }}
        </div>
        {{ truncate(controller) }}
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import Flag from './flags/Flag.vue';

import { displayNationName } from '../stringify';

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
      if (this.baseGame === 'imperial' || this.baseGame === 'imperialEurope2030' || this.baseGame === 'imperialAsia') {
        return 'w-1/3 md:w-full lg:w-full xl:w-full 2xl:w-full';
      }

      if (this.baseGame === 'imperial2030') {
        return 'w-1/3 lg:w-1/3 xl:w-1/3 2xl:w-1/6';
      }

      return '';
    },
    truncate(string) {
      string = string || '';
      if (string.length > 10) {
        return `${string.slice(0, 10)}...`;
      }

      return string;
    },

    displayNationName(nation) {
      return displayNationName(nation);
    },
  },
};
</script>

<template>
  <div class="flex items-center">
    <div
      v-if="index"
      class="text-5xl"
    >
      {{ index }}
    </div>
    <div
      class="p-2 m-1 border border-gray-500"
      :class="player.name === currentPlayer ? 'bg-green-300' : ''"
    >
      <div class="flex">
        <div
          v-if="!index"
          class="text-xs -mt-2 -ml-2 h-5 mr-0.5 p-0.5 bg-gray-600 text-white"
        >
          {{ turnIndex }}
        </div>
        <span class="mx-0.5">
          <span
            v-if="onlineUsers.includes(player.name)"
            class="h-2 w-2 bg-blue-700 border-blue-700 border-2 rounded-full inline-block"
          />
          <router-link
            v-if="player.id"
            :to="{ path: '/users/' + player.id }"
            class="underline"
          >
            <b>{{ player.name }}</b>
          </router-link>
          <span v-else>
            <b>{{ player.name }}</b>
          </span>
          <Flag
            v-for="controlledNation in controlledNations(player.name)"
            :key="controlledNation"
            :nation="controlledNation"
            width="30"
            height="20"
            class="inline-block mx-0.5"
          />
        </span>
      </div>
      <div>${{ player.cash }}mil</div>
      <div>{{ player.rawScore + player.cash }} VP</div>
      <div class="flex flex-wrap justify-center">
        <Bond
          v-for="bond in sortedBonds(player.bonds)"
          :key="bond.nation.value + bond.cost"
          :bond="bond"
          :toggle-trade-in="toggleTradeIn"
          :is-being-applied-to-trade-in="isBeingAppliedToTradeIn(bond)"
          :class="{ 'cursor-pointer': canTradeIn(bond) }"
          @click="applyToTradeIn(bond)"
        />
      </div>
      <div v-if="player.name === game.investorCardHolder">
        Investor Card
      </div>
      <div v-if="game.swissBanks.includes(player.name)">
        Swiss Bank
      </div>
    </div>
  </div>
</template>

<script>
import Bond from './Bond.vue';
import Flag from './flags/Flag.vue';

import { Nation, Nation2030, NationAsia } from '../../Domain/constants';

export default {
  name: 'Player',
  components: {
    Bond,
    Flag,
  },
  props: {
    currentPlayer: { type: String, default: '' },
    onlineUsers: { type: Array, default: () => [] },
    player: { type: Object, default: () => {} },
    profile: { type: Object, default: () => {} },
    game: { type: Object, default: () => {} },
    index: { type: Number, default: 0 },
    name: { type: String, default: '' },
    purchasingBond: Boolean,
    tradedInBondNation: { type: String, default: '' },
    tradedInValue: { type: Number, default: 0 },
    turnIndex: { type: Number, default: 0 },
  },
  emits: ['toggleTradeIn', 'cancelApplyToTradeIn'],
  methods: {
    applyToTradeIn(bond) {
      if (this.canTradeIn(bond)) {
        this.toggleTradeIn(bond);
      }
    },
    canTradeIn(bond) {
      let availableBondsMatchNation = false;
      for (const availableBond of this.game.availableActions) {
        if (availableBond.payload?.nation === bond.nation) {
          availableBondsMatchNation = true;
        }
      }
      if (
        this.purchasingBond
        && this.game.players[this.currentPlayer].bonds.has(bond)
        && availableBondsMatchNation
      ) {
        return true;
      }

      return false;
    },
    sortedBonds(bonds) {
      const nations = [
        Nation.AH,
        Nation.IT,
        Nation.FR,
        Nation.GB,
        Nation.GE,
        Nation.RU,
        Nation2030.RU,
        Nation2030.CN,
        Nation2030.IN,
        Nation2030.BR,
        Nation2030.US,
        Nation2030.EU,
        NationAsia.CN,
        NationAsia.JP,
        NationAsia.FR,
        NationAsia.GB,
        NationAsia.TR,
        NationAsia.RU,
        NationAsia.GE,
      ];
      const sortedByNation = [...bonds].sort((bond1, bond2) => {
        if (nations.indexOf(bond1.nation) > nations.indexOf(bond2.nation)) {
          return 1;
        }
        return -1;
      });
      const sortedBonds = sortedByNation.sort((bond1, bond2) => {
        if (bond1.nation === bond2.nation && bond1.cost > bond2.cost) {
          return 1;
        }
        return -1;
      });
      return sortedBonds;
    },
    toggleTradeIn(bond) {
      this.$emit('toggleTradeIn', bond);
    },
    cancelApplyToTradeIn(bond) {
      this.$emit('cancelApplyToTradeIn', bond);
    },
    isBeingAppliedToTradeIn(bond) {
      if (bond.cost === this.tradedInValue && bond.nation.value === this.tradedInBondNation) {
        return true;
      }

      return false;
    },
    cursorClass() {
      if (this.purchasingBond) {
        return 'cursor-pointer';
      }

      return '';
    },
    controlledNations(playerName) {
      let out = [];
      for (const [nation] of this.game.nations) {
        if (this.game.nations.get(nation).controller === playerName) {
          if (nation.value === 'CN' && nation.label === 'NationAsia') {
            out = out.concat('CNAsia');
          } else {
            out = out.concat(nation.value);
          }
        }
      }
      return out;
    },
  },
};
</script>

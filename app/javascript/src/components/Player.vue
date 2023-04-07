<template>
  <v-card :color="player.name === currentPlayer ? 'primary' : ''">
    <v-card-item>
      <v-card-title>
        <span
          v-if="index"
          class="text-5xl"
        >
          {{ index }}
        </span>
        <span
          v-else
          class="text-caption mr-2"
        >
          {{ turnIndex }}
        </span>
        <v-chip
          :to="player.id ? '/users/' + player.id : ''"
          class="mr-2"
        >
          <template #prepend>
            <v-icon
              v-if="onlineUsers.includes(player.name)"
              color="blue"
            >
              mdi-circle-medium
            </v-icon>
          </template>
          {{ player.name }}
        </v-chip>
        <Flag
          v-for="controlledNation in controlledNations(player.name)"
          :key="controlledNation"
          :nation="controlledNation"
          width="45"
          height="30"
        />
      </v-card-title>
      <v-card-subtitle>
        <div>${{ player.cash }}mil</div>
        <div>{{ player.rawScore + player.cash }} VP</div>
      </v-card-subtitle>
    </v-card-item>
    <v-card-text>
      <Bond
        v-for="bond in sortedBonds(player.bonds)"
        :key="bond.nation.value + bond.cost"
        :bond="bond"
        :toggle-trade-in="toggleTradeIn"
        :is-being-applied-to-trade-in="isBeingAppliedToTradeIn(bond)"
        :class="{ 'cursor-pointer': canTradeIn(bond) }"
        @click="applyToTradeIn(bond)"
      />
      <div v-if="player.name === game.investorCardHolder">
        Investor Card
      </div>
      <div v-if="game.swissBanks.includes(player.name)">
        Swiss Bank
      </div>
    </v-card-text>
  </v-card>
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

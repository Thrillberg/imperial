<template>
  <div class="p-2 m-1 border border-gray-500" :class="player.name === current_player ? 'bg-green-300' : ''">
    <p>
      <span
        v-if="online_users.includes(player.name)"
        class="h-2 w-2 bg-blue-700 border-blue-700 border-2 rounded-full inline-block"
      >
      </span>
      <b>{{ player.name }}</b>
    </p>
    <span>Cash: {{ player.cash }}m</span>
    <div>Raw score: {{ player.rawScore }}</div>
    <div class="flex flex-wrap">
      <Bond
        v-for="bond in sortedBonds(player.bonds)"
        :bond="bond"
        :toggleTradeIn="toggleTradeIn"
        :canBeAppliedToTradeIn="canTradeIn(bond)"
        :isBeingAppliedToTradeIn="isBeingAppliedToTradeIn(bond)"
        :class="{ 'cursor-pointer': canTradeIn(bond) }"
        :key="bond.nation.value + bond.cost"
      />
    </div>
    <div v-if="player.name === game.investorCardHolder">Investor Card</div>
    <div v-if="game.swissBanks.includes(player.name)">Swiss Bank</div>
  </div>
</template>

<script>
import Bond from "./Bond.vue";

import { Nation, Nation2030 } from "../../lib/constants.js";

export default {
  name: "Player",
  components: {
    Bond
  },
  props: {
    current_player: String,
    online_users: Array,
    player: Object,
    profile: Object,
    game: Object,
    name: String,
    purchasingBond: Boolean,
    tradedInBondNation: String,
    tradedInValue: Number
  },
  methods: {
    canTradeIn(bond) {
      let availableBondsMatchNation = false;
      for (const availableBond of this.game.availableActions) {
        if (availableBond.payload?.nation === bond.nation) {
          availableBondsMatchNation = true
        }
      }
      if (
        this.purchasingBond &&
        this.game.players[this.current_player].bonds.has(bond) &&
        availableBondsMatchNation
      ) {
        return true
      }
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
        Nation2030.EU
      ]
      const sortedByNation = [...bonds].sort((bond1, bond2) => {
        if (nations.indexOf(bond1.nation) > nations.indexOf(bond2.nation)) {
          return 1
        } else {
          return -1
        }
      });
      const sortedBonds = sortedByNation.sort((bond1, bond2) => {
        if (bond1.nation === bond2.nation && bond1.cost > bond2.cost) {
          return 1
        }
        return -1
      });
      return sortedBonds;
    },
    toggleTradeIn(bond) {
      this.$emit("toggleTradeIn", bond);
    },
    cancelApplyToTradeIn(bond) {
      this.$emit("cancelApplyToTradeIn", bond);
    },
    isBeingAppliedToTradeIn(bond) {
      if (bond.cost === this.tradedInValue && bond.nation.value === this.tradedInBondNation) {
        return true
      }
    },
    cursorClass() {
      if (this.purchasingBond) {
        return "cursor-pointer"
      }
    }
  }
};
</script>

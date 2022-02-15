<template>
  <div class="flex items-center">
    <div v-if="index" class="text-5xl">
      {{ index }}
    </div>
    <div class="p-2 m-1 border border-gray-500" :class="player.name === current_player ? 'bg-green-300' : ''">
      <div class="flex justify-between">
        <div v-if="!index" class="text-xs -mt-2 -ml-2 h-5 mr-0.5 p-0.5 bg-gray-600 text-white">
          {{ turnIndex }}
        </div>
        <span class="mx-0.5">
          <span
            v-if="online_users.includes(player.name)"
            class="h-2 w-2 bg-blue-700 border-blue-700 border-2 rounded-full inline-block"
          >
          </span>
          <router-link v-if="player.id" :to="{ path: '/users/' + player.id }" class="underline">
            <b>{{ player.name }}</b>
          </router-link>
          <div v-else>
            <b>{{ player.name }}</b>
          </div>
        </span>
        <span>{{ player.cash }}m</span>
        <span>{{ player.rawScore + player.cash }} points</span>
      </div>
      <div class="flex flex-wrap justify-center">
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
    index: Number,
    name: String,
    purchasingBond: Boolean,
    tradedInBondNation: String,
    tradedInValue: Number,
    turnIndex: Number
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

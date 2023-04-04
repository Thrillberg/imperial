<template>
  <div>
    <div class="text-lg m-2">
      Purchase a bond - You have {{ game.players[currentPlayer].cash }}m in cash.
    </div>
    <div class="flex flex-wrap">
      <div
        v-for="bond of game.availableBonds"
        :key="bond.nation+bond.cost"
      >
        <Bond
          v-if="canBePurchased(bond)"
          :bond="bond"
          :can-be-purchased="true"
          class="cursor-pointer"
          :is-being-applied-to-trade-in="tradedInValue > 0"
          :traded-in-value="tradedInValue"
          @click="purchase(bond)"
        />
        <Bond
          v-else
          :bond="bond"
          :filter="'grayscale'"
        />
      </div>
    </div>
    <div
      class="rounded m-2 p-2 bg-green-800 text-white cursor-pointer inline-block mt-8"
      @click="skipBondPurchase"
    >
      Do not buy a bond
    </div>
  </div>
</template>

<script>
import Bond from './Bond.vue';

export default {
  name: 'BondPurchase',
  components: { Bond },
  props: {
    game: { type: Object, default: () => {} },
    currentPlayer: { type: String, default: '' },
    profile: { type: Object, default: () => {} },
    tradedInBondNation: { type: String, default: '' },
    tradedInValue: { type: Number, default: 0 },
  },
  emits: ['purchaseBond', 'skip'],
  methods: {
    canBePurchased(bond) {
      let canBePurchased = false;
      for (const action of this.game.availableActions) {
        if (
          action.payload.cost === bond.cost
          && action.payload.nation === bond.nation
        ) {
          if (this.tradedInValue > 0) {
            if (
              action.payload.tradeInValue === this.tradedInValue
              && action.payload.nation.value === this.tradedInBondNation
            ) {
              canBePurchased = true;
            }
          } else if (action.payload.tradeInValue === 0) {
            canBePurchased = true;
          }
        }
      }
      return canBePurchased;
    },
    purchase(bond) {
      this.$emit('purchaseBond', bond);
    },
    skipBondPurchase() {
      this.$emit('skip');
    },
  },
};
</script>

<template>
  <div>
    <div class="text-lg m-2">Purchase a bond - You have {{ game.players[current_player].cash }}m in cash.</div>
    <div class="flex flex-wrap">
      <div v-for="bond of game.availableBonds">
        <Bond
          v-if="canBePurchased(bond)"
          :bond="bond"
          :canBePurchased="true"
          :purchase="purchase"
          class="cursor-pointer"
          :isBeingAppliedToTradeIn="tradedInValue > 0"
          :tradedInValue="tradedInValue"
          :key="bond.cost+bond.nation.value"
        />
        <Bond
          v-else
          :bond="bond"
          :filter="'grayscale'"
          :key="bond.cost+bond.nation.value"
        />
      </div>
    </div>
    <div @click="skipBondPurchase" class="rounded m-2 p-2 bg-green-800 text-white cursor-pointer inline-block mt-8">
      Do not buy a bond
    </div>
  </div>
</template>

<script>
import Bond from "../components/Bond.vue";

export default {
  name: "BondPurchase",
  components: { Bond },
  props: { game: Object, current_player: String, profile: Object, tradedInValue: Number },
  methods: {
    canBePurchased(bond) {
      let canBePurchased = false;
      for (const action of this.game.availableActions) {
        if (action.payload.cost === bond.cost && action.payload.nation === bond.nation && action.payload.tradeInValue === this.tradedInValue) {
          canBePurchased = true;
        }
      }
      return canBePurchased;
    },
    purchase(bond) {
      this.$emit("purchaseBond", bond);
    },
    skipBondPurchase: function() {
      this.$emit("skip");
    },
  }
}
</script>

<template>
  <div v-if="purchasingBond">
    <div class="text-lg m-2">Purchase a bond - You have {{ game.players[current_player].cash }}m in cash.</div>
    <div class="flex flex-wrap">
      <div v-for="bond of game.availableBonds">
        <Bond
          v-if="canBePurchased(bond)"
          :bond="bond"
          :tradedBond="tradedBond({cost: bond.cost, nation: bond.nation, player: game.currentPlayerName})"
          @click.native="purchase(bond)"
          class="cursor-pointer"
        />
        <Bond
          v-else
          :bond="bond"
          :filter="'grayscale'"
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
  props: { game: Object, current_player: String, profile: Object },
  computed: {
    purchasingBond: function () {
      const purchasingBond = this.game.availableActions.size > 0 &&
        Array.from(this.game.availableActions).every(
          (action) => action.type === "bondPurchase" || action.type === "skipBondPurchase"
        );
      return purchasingBond && (this.profile.username === this.controllingPlayerName || (this.game.soloMode && this.profile.username in this.game.players));
    },
  },
  methods: {
    canBePurchased(bond) {
      let canBePurchased = false;
      for (const action of this.game.availableActions) {
        if (action.payload.cost === bond.cost && action.payload.nation === bond.nation) {
          canBePurchased = true;
        }
      }
      return canBePurchased;
    },
    tradedBond: function({cost, nation, player}) {
      const playerObj = this.game.players[player];
      if (playerObj.cash < cost) {
        let topBond = {cost: 0};
        for (const bond of playerObj.bonds) {
          if (bond.nation === nation) {
            if (bond.cost > topBond.cost) {
              topBond = bond;
            }
          }
        }
        return topBond;
      }
    },
    purchase(bond) {
      this.$emit("purchaseBond", bond);
    },
    skipBondPurchase: function() {
      this.$emit("skip");;
    },
  }
}
</script>

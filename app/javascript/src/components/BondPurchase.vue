<template>
  <v-dialog
    v-model="dialog"
    width="50%"
  >
    <v-card>
      <v-card-title>Purchase a bond - You have {{ game.players[currentPlayer].cash }}m in cash.</v-card-title>
      <v-card-text>
        <v-row>
          <v-col
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
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary-darken-1"
          block
          @click="skipBondPurchase"
        >
          Do not buy a bond
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
  data() { return { dialog: true }; },
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
          } else {
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

<template>
  <v-dialog
    v-model="dialog"
    width="50%"
  >
    <template #activator="{ props }">
      <v-col>
        <v-btn
          color="primary"
          v-bind="props"
        >
          Buy a bond
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          color="error"
          @click="skipBondPurchase"
        >
          Do not buy a bond
        </v-btn>
      </v-col>
    </template>

    <v-card>
      <v-card-title>
        <v-toolbar color="surface">
          Purchase a bond - You have {{ game.players[currentPlayer].cash }}m in cash.

          <template #append>
            <v-btn
              icon="$close"
              @click="dialog = false"
            />
          </template>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col :cols="game.auction?.inAuction ? '12' : '9'">
            <v-sheet
              v-for="bond of game.availableBonds"
              :key="bond.nation+bond.cost"
              class="ma-2 d-inline-block"
            >
              <Bond
                v-if="canBePurchased(bond)"
                :bond="bond"
                :can-be-purchased="true"
                :is-being-applied-to-trade-in="tradedInValue > 0"
                :traded-in-value="tradedInValue"
                :type-of-ownership="typeOfOwnership(bond)"
                @click="purchase(bond)"
              />
              <Bond
                v-else
                :bond="bond"
                :filter="'grayscale'"
              />
            </v-sheet>
          </v-col>
          <v-divider
            v-if="!game.auction?.inAuction"
            vertical
          />
          <v-col
            v-if="!game.auction?.inAuction"
            cols="3"
          >
            Your bonds that can be upgraded
            <v-sheet
              v-for="bond of upgradeableBonds"
              :key="bond.nation+bond.cost"
              class="ma-2 d-inline-block"
            >
              <Bond
                :bond="bond"
                :is-being-applied-to-trade-in="tradedInValue > 0"
                :traded-in-value="tradedInValue"
                @click="$emit('toggleTradeIn', bond)"
              />
            </v-sheet>
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
  emits: ['purchaseBond', 'skip', 'toggleTradeIn'],
  data() { return { dialog: true }; },
  computed: {
    upgradeableBonds() {
      const upgradeableBonds = [];

      for (const playerBond of this.game.players[this.currentPlayer].bonds) {
        let availableBondsMatchNation = false;
        for (const availableBond of this.game.availableActions) {
          if (availableBond.payload?.nation === playerBond.nation) {
            availableBondsMatchNation = true;
          }
        }

        if (
          this.game.players[this.currentPlayer].bonds.has(playerBond)
          && availableBondsMatchNation
        ) {
          upgradeableBonds.push(playerBond);
        }
      }

      return upgradeableBonds;
    },
  },
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
    typeOfOwnership(bond) {
      if (
        (this.game.totalInvestmentInNation(this.currentPlayer, bond.nation) + bond.cost)
          > this.game.totalInvestmentInNation(this.game.nations.get(bond.nation).controller, bond.nation)
      ) {
        return this.game.nations.get(bond.nation).controller === this.currentPlayer ? 'incumbent' : 'new';
      }

      return 'none';
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

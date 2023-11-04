<template>
  <v-row class="mb-7">
    <v-col>
      <svg
        width="350px"
        height="350px"
        viewBox="-20 -20 240 240"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <RondelSlot
          v-for="(rondel_slot, index) in slots"
          :key="rondel_slot.type"
          :index="index"
          :is-valid="isValid(rondel_slot.type)"
          :nations="nationsOnSlot(rondel_slot.type)"
          :rondel-slot="rondel_slot"
          @circle-hovered="handleCircleHovered"
          @slot-clicked="slotClicked(rondel_slot.type)"
          @slot-hovered="slotHovered(rondel_slot.type)"
          @slot-silent="slotSilent()"
        />
      </svg>
    </v-col>
  </v-row>

  <v-row v-if="!!helperText">
    <v-col>
      <v-card
        color="secondary"
        width="350px"
      >
        <v-card-text v-if="onInvestorSlot">
          <div
            v-for="[bearer, amount] of bondBearers"
            :key="bearer"
          >
            <b>{{ bearer }}</b> would receive {{ displayMonetaryValue_InMillions(amount) }}
          </div>
          <div v-if="game.variant !== 'withoutInvestorCard'">
            <b>{{ game.investorCardHolder }}</b> has the investor card
          </div>
        </v-card-text>
        <v-card-text v-if="onTaxationSlot">
          <div v-if="game.baseGame === 'imperial' || game.baseGame === 'imperialEurope2030'">
            <b>Tax Revenue</b> will go from
            {{ displayMonetaryValue_InMillions(game.nations.get(game.currentNation).taxChartPosition) }} to
            {{ displayMonetaryValue_InMillions(nextTaxChartPosition) }}
          </div>
          <div>
            <b>{{ game.currentPlayerName }}</b> would receive {{ displayMonetaryValue_InMillions(playerBonus) }}
          </div>
          <div>
            <b>{{ displayNationName(game.currentNation.value) }}</b>'s treasury would change by
            {{ displayMonetaryValue_InMillions(nationProfit) }}
          </div>
          <div>
            <b>{{ displayNationName(game.currentNation.value) }}</b>'s power points would be {{ nextTaxationPowerPoints }}
          </div>
        </v-card-text>
        <v-card-text v-if="cost > 0">
          <b>Cost: {{ displayMonetaryValue_InMillions(cost) }}</b>
        </v-card-text>
        <v-card-text v-if="displayHelperFlag">
          <Flag
            :nation="helperNation"
            height="20"
            width="30"
            class="inline-block pr-1"
          />
          <span>{{ helperText }}</span>
        </v-card-text>
        <v-card-text v-else>
          <span>{{ helperText }}</span>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { displayMonetaryValueInMillions, displayNationName } from '../stringify';
import { nextTaxationPowerPoints } from '../taxChartHelpers';
import Flag from './flags/Flag.vue';

import RondelSlot from './RondelSlot.vue';

export default {
  name: 'Rondel',
  components: {
    RondelSlot,
    Flag,
  },
  props: {
    game: { type: Object, default: () => {} },
    name: { type: String, default: '' },
    paused: Boolean,
    hostingThisGame: Boolean,
  },
  emits: ['tick-with-action'],
  data() {
    return {
      cost: 0,
      displayHelperFlag: false,
      helperNation: '',
      helperText: '',
      onInvestorSlot: false,
      onTaxationSlot: false,
      slots: [
        { type: 'production1', label: 'Production', color: '#8C8798' },
        { type: 'maneuver1', label: 'Maneuver', color: '#7EA850' },
        { type: 'investor', label: 'Investor', color: '#8EDFFF' },
        { type: 'import', label: 'Import', color: '#F39D81' },
        { type: 'production2', label: 'Production', color: '#8C8798' },
        { type: 'maneuver2', label: 'Maneuver', color: '#7EA850' },
        { type: 'taxation', label: 'Taxation', color: '#FFD281' },
        { type: 'factory', label: 'Factory', color: '#8DBCFB' },
      ],
    };
  },
  computed: {
    bondBearers() {
      const bearers = {};
      for (const player of Object.keys(this.game.players)) {
        for (const bond of this.game.players[player].bonds) {
          if (bond.nation === this.game.currentNation) {
            if (bearers[player]) {
              bearers[player] += bond.number;
            } else {
              bearers[player] = bond.number;
            }
          }
        }
      }
      const bearersArray = Object.keys(bearers).map(
        (name) => [name, bearers[name]],
      ).sort((a, b) => a[1] - b[1]);
      let remainingTreasury = this.game.nations.get(this.game.currentNation).treasury;
      return bearersArray.map((bearer) => {
        if (remainingTreasury === 0) return false;
        if (remainingTreasury >= bearer[1]) {
          remainingTreasury -= bearer[1];
          return bearer;
        }
        const lastPayment = remainingTreasury;
        remainingTreasury = 0;
        return [bearer[0], lastPayment];
      }).filter(Boolean);
    },
    nextTaxChartPosition() {
      const taxRevenue = this.game.taxRevenueOf(this.game.currentNation);
      return this.game.getTaxChartPosition(taxRevenue);
    },
    playerBonus() {
      const taxRevenue = this.game.taxRevenueOf(this.game.currentNation);
      return this.game.playerBonusAfterUnitMaintenanceCosts(this.game.currentNation, taxRevenue);
    },
    nationProfit() {
      const taxRevenue = this.game.taxRevenueOf(this.game.currentNation);
      return this.game.nationTaxationProfit(this.game.currentNation, taxRevenue);
    },
    nextTaxationPowerPoints() {
      return nextTaxationPowerPoints(this.game, this.game.currentNation);
    },
  },
  methods: {
    displayNationName(nation) {
      return displayNationName(nation);
    },
    displayMonetaryValue_InMillions(value) {
      return displayMonetaryValueInMillions(value);
    },
    isValid(slot) {
      if (this.paused) return false;

      if (this.validSlots().includes(slot)
        && (this.game.currentPlayerName === this.name || (this.game.soloMode && this.hostingThisGame))) {
        return true;
      }

      return false;
    },
    nationsOnSlot(slot) {
      const nations = [];
      for (const [nation, data] of this.game.nations) {
        if (slot === data.rondelPosition) {
          if (nation.value === 'GE' && nation.label === 'NationAsia') {
            nations.push('GEAsia');
          } else {
            nations.push(nation.value);
          }
        }
      }
      return nations;
    },
    slotHovered(slot) {
      if (this.showRondelHelperText()) {
        switch (slot) {
          case 'investor': {
            this.onInvestorSlot = true;
            this.onTaxationSlot = false;
            if (this.game.variant === 'withoutInvestorCard') {
              this.helperText = 'Nation pays players interest';
            } else {
              this.helperText = 'Nation pays players interest, investor card holder receives '
              + `${this.displayMonetaryValue_InMillions(2)} and may purchase a bond, Swiss Banks may invest.`;
            }
            break;
          }
          case 'import': {
            this.onInvestorSlot = false;
            this.onTaxationSlot = false;
            this.helperText = `Nation may purchase up to 3 units for ${this.displayMonetaryValue_InMillions(1)} each, `
              + 'to be placed anywhere in their home territory.';
            break;
          }
          case 'production1':
          case 'production2': {
            this.onInvestorSlot = false;
            this.onTaxationSlot = false;
            this.helperText = 'Unoccupied factories produce an army or fleet.';
            break;
          }
          case 'maneuver1':
          case 'maneuver2': {
            this.onInvestorSlot = false;
            this.onTaxationSlot = false;
            this.helperText = 'Units may move. Fleets must move first, followed by armies.';
            break;
          }
          case 'taxation': {
            this.onInvestorSlot = false;
            this.onTaxationSlot = true;
            this.helperText = `Nation taxes (${this.displayMonetaryValue_InMillions(2)} per unoccupied factory and `
            + `${this.displayMonetaryValue_InMillions(1)} per flag in) its empire. `
            + 'Power points are increased and nation receives tax, less soldiers\' pay '
            + `(${this.displayMonetaryValue_InMillions(1)} per unit). `
            + 'Player is paid a bonus accordingly.';
            break;
          }
          case 'factory': {
            this.onInvestorSlot = false;
            this.onTaxationSlot = false;
            this.helperText = `Nation builds a factory for ${this.displayMonetaryValue_InMillions(5)}. `
            + 'If the nation has insufficient funds, the governor of the nation will fund the rest of the costs.';
            break;
          }
          default: { break; }
        }

        this.cost = 0;
        for (const action of this.game.availableActions) {
          if (action.payload.slot === slot) {
            if (action.payload.cost) {
              this.cost += action.payload.cost;
            }

            break;
          }
        }
      }
    },
    showRondelHelperText() {
      if (this.paused) return false;

      this.displayHelperFlag = false;
      let allActionsAreRondel = true;
      for (const action of this.game.availableActions) {
        if (action.type !== 'rondel' && action.type !== 'undo') {
          allActionsAreRondel = false;
        }
      }
      return allActionsAreRondel && (
        this.game.currentPlayerName === this.name || (this.game.soloMode && this.hostingThisGame)
      );
    },
    slotSilent() {
      this.displayHelperFlag = false;
      this.helperText = '';
    },
    slotClicked(slot) {
      if (
        this.game.currentPlayerName === this.name || (this.game.soloMode && this.hostingThisGame)
      ) {
        for (const action of this.game.availableActions) {
          if (action.payload.slot === slot) {
            this.$emit('tick-with-action', action);
          }
        }
      }
    },
    handleCircleHovered(nation) {
      this.displayHelperFlag = true;
      this.helperNation = nation;
      this.helperText = displayNationName(nation);
    },
    validSlots() {
      const slots = [];
      for (const action of this.game.availableActions) {
        if (action.type === 'rondel') {
          slots.push(action.payload.slot);
        }
      }
      return slots;
    },
  },
};
</script>

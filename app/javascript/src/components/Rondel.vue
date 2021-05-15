<template>
  <div>
    <div class="flex justify-around">
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
          v-on:slot-clicked="slotClicked(rondel_slot.type)"
          v-on:slot-hovered="slotHovered(rondel_slot.type)"
          v-on:slot-silent="slotSilent()"
          :index="index"
          :is_valid="isValid(rondel_slot.type)"
          :nations="nationsOnSlot(rondel_slot.type)"
          :rondel_slot="rondel_slot"
          :key="rondel_slot.type"
        ></RondelSlot>
      </svg>
    </div>
    <div v-if="!!helperText" class="w-1/2 mx-auto border border-gray-600 rounded m-2 p-2">
      <div v-if="onInvestorSlot" class="mb-2">
        <div v-for="(amount, bearer) in bondBearers" :key="bearer">
          <b>{{ bearer }}</b> would receive {{ amount }}m
        </div>
        <div v-if="game.variant !== 'withoutInvestorCard'">
          <b>{{ game.investorCardHolder }}</b> has the investor card
        </div>
      </div>
      <div v-if="onTaxationSlot" class="mb-2">
        <div v-if="game.baseGame === 'imperial'">
          <div>
            <b>Current Tax Chart Position:</b> {{ game.nations.get(game.currentNation).taxChartPosition }}
          </div>
          <div>
            <b>Next Tax Chart Position:</b> {{ nextTaxChartPosition() }}
          </div>
          <div>
            <b>{{ game.currentPlayerName }}</b> would receive {{ nextTaxChartPosition() - game.nations.get(game.currentNation).taxChartPosition }}m
          </div>
          <div>
            <b>{{ stringify(game.currentNation.value) }}</b> would receive {{ nationTaxes() }}m
          </div>
        </div>
        <div v-else-if="game.baseGame === 'imperial2030'">
          <div>
            <b>{{ game.currentPlayerName }}</b> would receive {{ playerRevenue2030() }}m
          </div>
          <div>
            <b>{{ stringify(game.currentNation.value) }}</b> would receive {{ nationRevenue2030() }}m
          </div>
        </div>
      </div>
      <div v-if="!!cost">
        <b>Cost: {{ cost }}m</b>
      </div>
      <div>{{ helperText }}</div>
    </div>
  </div>
</template>

<script>
import stringify from "../stringify.js";

import RondelSlot from "./RondelSlot.vue";

export default {
  name: "Rondel",
  components: {
    RondelSlot
  },
  props: {
    game: Object,
    name: String
  },
  computed: {
    bondBearers() {
      let bearers = {};
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
      return bearers;
    }
  },
  methods: {
    isValid(slot) {
      if (
        this.validSlots().includes(slot) &&
        (this.game.currentPlayerName === this.name ||
        (this.game.soloMode && this.name in this.game.players))
      ) {
        return true;
      }

      return false;
    },
    nationsOnSlot(slot) {
      let nations = [];
      for (const [nation, data] of this.game.nations) {
        if (slot === data.rondelPosition) {
          nations.push(nation.value);
        }
      }
      return nations;
    },
    slotHovered(slot) {
      if (this.showRondelHelperText()) {
        switch(slot) {
          case "investor": {
            this.onInvestorSlot = true;
            this.onTaxationSlot = false;
            if (this.game.variant === "withoutInvestorCard") {
              this.helperText = "Nation pays players interest"
            } else {
              this.helperText = "Nation pays players interest, investor card holder receives 2m and may purchase a bond, Swiss Banks may invest."
            }
            break;
          }
          case "import": {
            this.onInvestorSlot = false;
            this.onTaxationSlot = false;
            this.helperText = "Nation may purchase up to 3 units for 1m each, to be placed anywhere in their home territory."
            break;
          }
          case "production1":
          case "production2": {
            this.onInvestorSlot = false;
            this.onTaxationSlot = false;
            this.helperText = "Unoccupied factories produce an army or fleet."
            break;
          }
          case "maneuver1":
          case "maneuver2": {
            this.onInvestorSlot = false;
            this.onTaxationSlot = false;
            this.helperText = "Units may move. Fleets must move first, followed by armies."
            break;
          }
          case "taxation": {
            this.onInvestorSlot = false;
            this.onTaxationSlot = true;
            this.helperText = "Player receives tax (2m per unoccupied factory and 1m per dot) from the nation. Power points are increased and nation receives tax, less soldiers' pay (1m per unit)."
            break;
          }
          case "factory": {
            this.onInvestorSlot = false;
            this.onTaxationSlot = false;
            this.helperText = "Nation builds a factory for 5m."
            break;
          }
        }
        this.cost = ""
        for (const action of this.game.availableActions) {
          if (action.payload.slot === slot) {
            this.cost = action.payload.cost
          }
        }
      }
    },
    showRondelHelperText: function() {
      let allActionsAreRondel = true;
      for (const action of this.game.availableActions) {
        if (action.type !== "rondel" && action.type !== "undo") {
          allActionsAreRondel = false;
        }
      }
      return allActionsAreRondel && (
        this.game.currentPlayerName === this.name || (this.game.soloMode && this.name in this.game.players)
      )
    },
    slotSilent() {
      this.helperText = "";
    },
    slotClicked: function(slot) {
      if (this.game.currentPlayerName === this.name || (this.game.soloMode && this.name in this.game.players)) {
        for (const action of this.game.availableActions) {
          if (action.payload.slot === slot) {
            this.$emit("tick-with-action", action);
          }
        }
      }
    },
    validSlots() {
      let slots = [];
      for (const action of this.game.availableActions) {
        if (action.type === "rondel") {
          slots.push(action.payload.slot);
        }
      }
      return slots;
    },
    nextTaxChartPosition() {
      const nation = this.game.currentNation;
      const factories = this.game.unoccupiedFactoryCount(nation);
      const flags = this.game.flagCount(nation);
      const currentTaxChartPosition = this.game.nations.get(nation).taxChartPosition;

      let taxChartPosition = factories * 2 + flags;
      if (taxChartPosition > 20) taxChartPosition = 20;
      if (taxChartPosition < currentTaxChartPosition) taxChartPosition = currentTaxChartPosition;

      return taxChartPosition;
    },
    nationTaxes() {
      const nation = this.game.currentNation;
      let taxes = this.nextTaxChartPosition() - this.game.unitCount(nation)
      if (taxes < 0) taxes = 0;
      return taxes;
    },
    playerRevenue2030() {
      const taxes = this.game.unoccupiedFactoryCount(this.game.currentNation) * 2 + this.game.flagCount(this.game.currentNation);
      const bonusByTaxes = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 1,
        7: 1,
        8: 1,
        9: 1,
        10: 2,
        11: 2,
        12: 3,
        13: 3,
        14: 4,
        15: 4,
        16: 5,
        17: 5,
        18: 5,
        19: 5,
        20: 5,
        21: 5,
        22: 5,
        23: 5
      }
      return bonusByTaxes[taxes];
    },
    nationRevenue2030() {
      const taxes = this.game.unoccupiedFactoryCount(this.game.currentNation) * 2 + this.game.flagCount(this.game.currentNation);
      return taxes - this.game.unitCount(this.game.currentNation) - this.playerRevenue2030();
    },
    stringify(string) {
      return stringify(string)
    }
  },
  data() {
    return {
      cost: "",
      helperText: "",
      onInvestorSlot: false,
      onTaxationSlot: false,
      slots: [
        { type: "production1", label: "Production", color: "#8C8798" },
        { type: "maneuver1", label: "Maneuver", color: "#7EA850" },
        { type: "investor", label: "Investor", color: "#8EDFFF" },
        { type: "import", label: "Import", color: "#F39D81" },
        { type: "production2", label: "Production", color: "#8C8798" },
        { type: "maneuver2", label: "Maneuver", color: "#7EA850" },
        { type: "taxation", label: "Taxation", color: "#FFD281" },
        { type: "factory", label: "Factory", color: "#8DBCFB" }
      ]
    };
  }
};
</script>

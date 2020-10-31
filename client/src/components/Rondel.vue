<template>
  <svg
    class="rondel"
    width="450px"
    height="450px"
    viewBox="-20 -20 240 240"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <RondelSlot
      v-for="(rondel_slot, index) in slots"
      v-on:slot-clicked="slotClicked(rondel_slot.type)"
      v-bind:index="index"
      v-bind:is_valid="isValid(rondel_slot.type)"
      v-bind:nations="nationsOnSlot(rondel_slot.type)"
      v-bind:rondel_slot="rondel_slot"
      v-bind:key="rondel_slot.type"
    ></RondelSlot>
  </svg>
</template>

<script>
import RondelSlot from "./RondelSlot.vue";

export default {
  name: "Rondel",
  components: {
    RondelSlot,
  },
  props: {
    soloMode: Boolean,
    game: Object,
    name: String,
  },
  methods: {
    isValid(slot) {
      if (
        this.validSlots().includes(slot) &&
        (this.game.currentPlayerName === this.name || this.soloMode)
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
    slotClicked: function (slot) {
      if (this.game.currentPlayerName === this.name || this.soloMode) {
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
  },
  data() {
    return {
      slots: [
        { type: "production1", label: "Production", color: "#8C8798" },
        { type: "maneuver1", label: "Maneuver", color: "#7EA850" },
        { type: "investor", label: "Investor", color: "#8EDFFF" },
        { type: "import", label: "Import", color: "#F39D81" },
        { type: "production2", label: "Production", color: "#8C8798" },
        { type: "maneuver2", label: "Maneuver", color: "#7EA850" },
        { type: "taxation", label: "Taxation", color: "#FFD281" },
        { type: "factory", label: "Factory", color: "#8DBCFB" },
      ],
    };
  },
};
</script>

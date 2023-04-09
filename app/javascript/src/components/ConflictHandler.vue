<template>
  <div
    v-if="game.handlingConflict && (profile.username === controllingPlayerName || (game.soloMode && hostingThisGame))"
  >
    <div
      v-if="fighting()"
      class="text-center inline-flex"
    >
      <button
        v-on:click="coexist"
        class="rounded p-2 m-1 sm:m-4 bg-green-800 text-white cursor-pointer"
      >
        Coexist
      </button>
      <button
        v-for="fightAction in fightActions()"
        v-on:click="$emit('tick-with-action', fightAction)"
        :key="fightAction.payload.incumbent.value + fightAction.payload.targetType"
        class="rounded p-2 m-1 sm:m-4 bg-green-800 text-white cursor-pointer"
      >
        Fight {{ displayNationName(fightAction.payload.incumbent.value) }} ({{ fightAction.payload.targetType }})
      </button>
    </div>
    <div
      v-if="occupying()"
      class="text-center inline-flex"
    >
      <button
        v-on:click="friendlyEntrance"
        class="rounded p-2 m-1 sm:m-4 bg-green-800 text-white cursor-pointer"
      >
        Enter friendly
      </button>
      <button
        v-on:click="unfriendlyEntrance"
        class="rounded p-2 m-1 sm:m-4 bg-green-800 text-white cursor-pointer"
      >
        Enter unfriendly
      </button>
    </div>
  </div>
  <div v-else-if="fighting() && (profile.username === controllingPlayerName || (game.soloMode && hostingThisGame))" class="text-center">
    <button
      v-for="fightAction in fightActions()"
      v-on:click="$emit('tick-with-action', fightAction)"
      :key="fightAction.payload.province + fightAction.payload.challenger"
      class="rounded p-2 m-1 sm:m-4 bg-green-800 text-white cursor-pointer"
    >
    Fight {{ displayNationName(fightAction.payload.challenger.value) }} in {{ fightAction.payload.province }}
    </button>
  </div>
</template>

<script>
import { displayNationName } from "../stringify.js";

export default {
  name: "ConflictHandler",
  props: { game: Object, profile: Object, controllingPlayerName: String, hostingThisGame: Boolean },
  methods: {
    fighting() {
      let fighting = false;
      for (const action of this.game.availableActions) {
        if (action.type === "coexist" || action.type === "fight") {
          fighting = true;
        }
      }
      return fighting;
    },
    occupying() {
      let occupying = true;
      for (const action of this.game.availableActions) {
        if (action.type !== "friendlyEntrance" && action.type !== "unfriendlyEntrance" && action.type !== "undo") {
          occupying = false;
        }
      }
      return occupying;
    },
    coexist() {
      let coexistAction = {};
      for (const action of this.game.availableActions) {
        if (action.type === "coexist") {
          coexistAction = action;
        }
      }
      this.$emit("tick-with-action", coexistAction);
    },
    fight() {
      let fightAction = {};
      for (const action of this.game.availableActions) {
        if (action.type === "fight") {
          fightAction = action;
        }
      }
      this.$emit("tick-with-action", fightAction);
    },
    friendlyEntrance() {
      let friendlyEntranceAction = {};
      for (const action of this.game.availableActions) {
        if (action.type === "friendlyEntrance") {
          friendlyEntranceAction = action;
        }
      }
      this.$emit("tick-with-action", friendlyEntranceAction);
    },
    unfriendlyEntrance() {
      let unfriendlyEntranceAction = {};
      for (const action of this.game.availableActions) {
        if (action.type === "unfriendlyEntrance") {
          unfriendlyEntranceAction = action;
        }
      }
      this.$emit("tick-with-action", unfriendlyEntranceAction);
    },
    fightActions() {
      let fightActions = [];
      for (const action of this.game.availableActions) {
        if (action.type === "fight") {
          fightActions.push(action)
        }
      }
      return fightActions;
    },
    displayNationName(nation) {
      return displayNationName(nation);
    },
  }
}
</script>

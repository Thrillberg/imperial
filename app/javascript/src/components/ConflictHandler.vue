<template>
  <div
    v-if="game.handlingConflict && (profile.username === controllingPlayerName || (game.soloMode && profile.username in game.players))"
    class="text-center text-lg"
  >
    <div v-if="fighting()">
      <div
        v-on:click="coexist"
        class="rounded p-2 bg-green-800 text-white cursor-pointer"
      >
        Coexist
      </div>
      <div
        v-for="fightAction in fightActions()"
        v-on:click="$emit('tick-with-action', fightAction)"
        :key="fightAction.payload.incumbent.value"
        class="rounded p-2 bg-green-800 text-white cursor-pointer"
      >
      Fight {{ stringify(fightAction.payload.incumbent.value) }}
      </div>
    </div>
    <div v-if="occupying()">
      <div
        v-on:click="friendlyEntrance"
        class="rounded p-2 bg-green-800 text-white cursor-pointer"
      >
        Enter friendly
      </div>
      <div
        v-on:click="unfriendlyEntrance"
        class="rounded p-2 bg-green-800 text-white cursor-pointer"
      >
        Enter unfriendly
      </div>
    </div>
  </div>
  <div v-else-if="fighting() && (profile.username === controllingPlayerName || (game.soloMode && profile.username in game.players))" class="text-center text-lg">
    <div
      v-for="fightAction in fightActions()"
      v-on:click="$emit('tick-with-action', fightAction)"
      :key="fightAction.payload.province"
      class="rounded p-2 bg-green-800 text-white cursor-pointer"
    >
      Fight in {{ fightAction.payload.province }}
    </div>
  </div>
</template>

<script>
import stringify from "../stringify.js";

export default {
  name: "ConflictHandler",
  props: { game: Object, profile: Object, controllingPlayerName: String },
  methods: {
    fighting: function() {
      let fighting = false;
      for (const action of this.game.availableActions) {
        if (action.type === "coexist" || action.type === "fight") {
          fighting = true;
        }
      }
      return fighting;
    },
    occupying: function() {
      let occupying = true;
      for (const action of this.game.availableActions) {
        if (action.type !== "friendlyEntrance" && action.type !== "unfriendlyEntrance" && action.type !== "undo") {
          occupying = false;
        }
      }
      return occupying;
    },
    coexist: function() {
      let coexistAction = {};
      for (const action of this.game.availableActions) {
        if (action.type === "coexist") {
          coexistAction = action;
        }
      }
      this.$emit("tick-with-action", coexistAction);
    },
    fight: function() {
      let fightAction = {};
      for (const action of this.game.availableActions) {
        if (action.type === "fight") {
          fightAction = action;
        }
      }
      this.$emit("tick-with-action", fightAction);
    },
    friendlyEntrance: function() {
      let friendlyEntranceAction = {};
      for (const action of this.game.availableActions) {
        if (action.type === "friendlyEntrance") {
          friendlyEntranceAction = action;
        }
      }
      this.$emit("tick-with-action", friendlyEntranceAction);
    },
    unfriendlyEntrance: function() {
      let unfriendlyEntranceAction = {};
      for (const action of this.game.availableActions) {
        if (action.type === "unfriendlyEntrance") {
          unfriendlyEntranceAction = action;
        }
      }
      this.$emit("tick-with-action", unfriendlyEntranceAction);
    },
    fightActions: function() {
      let fightActions = [];
      for (const action of this.game.availableActions) {
        if (action.type === "fight") {
          fightActions.push(action)
        }
      }
      return fightActions;
    },
    stringify(string) {
      return stringify(string)
    }
  }
}
</script>

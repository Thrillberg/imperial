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
        v-on:click="fight"
        class="rounded p-2 bg-green-800 text-white cursor-pointer"
      >
        Fight
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
</template>

<script>
export default {
  name: "ConflictHandler",
  props: { game: Object, profile: Object, controllingPlayerName: String },
  methods: {
    fighting: function() {
      let fighting = true;
      for (const action of this.game.availableActions) {
        if (action.type !== "coexist" && action.type !== "fight") {
          fighting = false;
        }
      }
      return fighting;
    },
    occupying: function() {
      let occupying = true;
      for (const action of this.game.availableActions) {
        if (action.type !== "friendlyEntrance" && action.type !== "unfriendlyEntrance") {
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
      this.tickWithAction(coexistAction);
    },
    fight: function() {
      let fightAction = {};
      for (const action of this.game.availableActions) {
        if (action.type === "fight") {
          fightAction = action;
        }
      }
      this.tickWithAction(fightAction);
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
    }
  }
}
</script>

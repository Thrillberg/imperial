<template>
  <div
    v-if="game.winner"
    class="border border-gray-500 rounded p-2 m-1 text-center bg-green-200"
  >
    <b>Game over!</b> {{ game.winner }} won the game.
  </div>
  <div
    v-else
    class="border border-gray-500 rounded p-2 m-1 text-center"
    :class="alertCurrentPlayer"
  >
    <span v-html="playerIs"></span>
    {{ stringify(Array.from(game.availableActions)) }}.
  </div>
</template>

<script>
export default {
  name: "TurnStatus",
  props: ["game", "profile", "controllingPlayerName"],
  computed: {
    alertCurrentPlayer() {
      if (this.game.currentPlayerName === this.profile.username) {
        return `bg-${this.game.currentNation.value}`;
      }
      return "";
    },
    playerIs() {
      if (this.controllingPlayerName === "") {
        return "<b>Swiss Banks</b> are "
      } else if (this.game.currentPlayerName === this.profile.username) {
        return "<b>You</b> are "
      } else {
        return `<b>${this.game.currentPlayerName}</b> is `
      }
    }
  },
  methods: {
    stringify(actions) {
      const actionsWithoutUndo = [];
      for (const action of actions) {
        if (action.type !== "undo") {
          actionsWithoutUndo.push(action)
        }
      }
      if (actionsWithoutUndo.every(action => action.type === "rondel")) {
        return "choosing a rondel slot"
      } else if (actionsWithoutUndo.every(action => action.type === "buildFactory")) {
        return "choosing where to build a factory"
      } else if (actionsWithoutUndo.every(action => action.type === "maneuver" || action.type === "endManeuver")) {
        return "choosing where to maneuver their military units. Fleets move first, then armies"
      } else if (actionsWithoutUndo.every(action => action.type === "bondPurchase" || action.type === "skipBondPurchase")) {
        return "choosing a bond to purchase"
      } else if (actionsWithoutUndo.every(action => action.type === "import")) {
        return "choosing where to import additional military units"
      } else if (actionsWithoutUndo.every(action => action.type === "fight" || action.type === "coexist")) {
        return "choosing whether to fight or coexist"
      } else if (actionsWithoutUndo.every(action => action.type === "forceInvestor" || action.type === "skipForceInvestor")) {
        return "choosing whether to force the current nation to stop on the Investor rondel slot"
      } else if (actionsWithoutUndo.every(action => action.type === "destroyFactory" || action.type === "skipDestroyFactory")) {
        return "choosing whether to destroy a factory"
      } else {
        return "doing something mysterious"
      }
    }
  }
}
</script>

<template>
  <div class="border border-gray-500 rounded p-2 m-2">
    <b>{{ game.currentPlayerName }}</b> is {{ stringify(Array.from(game.availableActions)) }}.
  </div>
</template>

<script>
export default {
  name: "TurnStatus",
  props: ["game"],
  methods: {
    stringify(actions) {
      if (actions.every(action => action.type === "rondel")) {
        return "choosing a rondel slot"
      } else if (actions.every(action => action.type === "buildFactory")) {
        return "choosing where to build a factory"
      } else if (actions.every(action => action.type === "maneuver" || action.type === "endManeuver")) {
        return "choosing where to maneuver their military units"
      } else if (actions.every(action => action.type === "bondPurchase" || action.type === "skipBondPurchase")) {
        return "choosing a bond to purchase"
      } else if (actions.every(action => action.type === "import")) {
        return "choosing where to import additional military units"
      } else if (actions.every(action => action.type === "fight" || action.type === "coexist")) {
        return "choosing whether to fight or coexist"
      } else if (actions.every(action => action.type === "forceInvestor" || action.type === "skipForceInvestor")) {
        return "choosing whether to force the current nation to stop on the Investor rondel slot"
      } else if (actions.every(action => action.type === "destroyFactory" || action.type === "skipDestroyFactory")) {
        return "choosing whether to destroy a factory"
      } else {
        return "doing something mysterious"
      }
    }
  }
}
</script>

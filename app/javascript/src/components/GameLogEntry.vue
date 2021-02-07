<template>
  <div class="border border-black bg-gray-100 rounded p-2 m-2 rondel">
    <div v-for="(action, index) in event" :key="index">
      <div v-if="action.type === 'initialize'">
        <p>{{ action.payload.soloMode ? "Solo game started!" : "Game started!" }}</p>
        <p v-for="(player, index) in action.payload.players" :key="index">
          <svg 
            class="inline-block mr-1" 
            xmlns="http://www.w3.org/2000/svg" 
            width="30" 
            height="20"
            >
            <Flag :nation="player.nation.value" width="30"></Flag>
          </svg>
          <span v-html=initializeAction(player)></span>
        </p>
      </div>
      <div v-else-if="action.type === 'rondel'">
        <svg 
          class="inline-block mr-1" 
          xmlns="http://www.w3.org/2000/svg" 
          width="30" 
          height="20"
          >
          <Flag :nation="action.payload.nation.value" width="30"></Flag>
        </svg>{{ processAction(action) }}
      </div>  
      <div v-else>
        - {{ processAction(action) }}
      </div>
    </div>
  </div>
</template>

<script>
import Flag from "./flags/Flag.vue";
import stringify from "../stringify.js";
export default {
  name: "GameLogEntry",
  props: { events: Object, index: Number },
  computed: {
    event: function() {
      return this.events.event
    }
  },
  components: { Flag },
  methods: {
    capitalize(word) {
      if (word) {
      return (word[0].toUpperCase() + word.substring(1));
      } else {
        return "";
      }
    },
    processAction(action) {
      let notImplemented = "NOT IMPLEMENTED";
      switch (action.type) {
        case "initialize":
          return notImplemented;
        case "rondel":
          return this.rondelAction(action.payload);
        case "buildFactory":
          return this.buildFactoryAction(action.payload);
        case "bondPurchase":
          return this.bondPurchaseAction(action.payload);
        case "import":
          return this.importAction(action.payload);
        case "production":
          return notImplemented;
        case "maneuver":
          return this.maneuverAction(action.payload);
        case "coexist":
          return this.coexistAction(action.payload);
        case "fight":
          return this.fightAction(action.payload);
        case "endManeuver":
          return this.endManeuverAction(action.payload);
        case "forceInvestor":
          return notImplemented;
        case "skipForceInvestor":
          return notImplemented;
        case "endGame":
          return "Game Over!";
      }
      return notImplemented;
    },
    initializeAction(player) {
      let name = player.id;
      let nation = stringify(player.nation.value);
      return `<strong>${nation}</strong> is controlled by <strong>${name}</strong>`;
    },
    rondelAction(payload) {
      let nation = stringify(payload.nation.value);
      let slot = this.capitalize(payload.slot).replace(/\d/g,"");
      return `${nation} advanced to the ${slot} rondel slot.`;
    },
    buildFactoryAction(payload) {
      let province = this.capitalize(payload.province);
      return `Built a factory in ${province}.`;
    },
    bondPurchaseAction(payload) {
      let player = payload.player;
      let cost = payload.cost;
      let nation = stringify(payload.nation.value);
      return `${player} bought ${cost}M in bonds from ${nation}.`;
    },
    importAction(payload) {
      let provincesList = payload.placements.map((item) => { return this.capitalize(item.province) });
      let province = provincesList[0];
      let provinces = provincesList.slice(0,-1).join(", ") + " and " + provincesList.slice(-1);
      let provincesText = provincesList.length > 1 ? provinces : province;
      let army = provincesList.length > 1 ? "armies" : "army";
      return `Imported a total of ${provincesList.length} ${army} into ${provincesText}.`;
    },
    maneuverAction(payload) {
      let origin = this.capitalize(payload.origin);
      let destination = this.capitalize(payload.destination);
      return `Moved an army from ${origin} to ${destination}.`;
    },
    coexistAction(payload) {
      let province = this.capitalize(payload.province);
      let nations = stringify(payload.incumbent.value) + " and " + stringify(payload.challenger.value);
      return `Armies from ${nations} are peacefully coexisting in ${province}.`;
    },
    fightAction(payload) {
      let province = this.capitalize(payload.province);
      let incumbent = stringify(payload.incumbent.value);
      let challenger = stringify(payload.challenger.value);
      return `The armies from ${challenger} have picked a fight with ${incumbent} in ${province}.`;
    },
    endManeuverAction(payload) {
      return `Military maneuvers have ended for now.`
    }
  }
}
</script>

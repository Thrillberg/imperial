<template>
  <div class="border border-black bg-gray-100 rounded p-2 m-2 rondel">
    <div v-for="({action, timestamp}, index) in event" :key="index">
      <div v-if="action.type === 'initialize'">
        <div class="flex justify-between">
          <p>{{ action.payload.soloMode ? "Solo game started!" : "Game started!" }}</p>
          <p>{{ toString(timestamp) }}</p>
        </div>
        <p>Variant: {{ action.payload.variant || "standard" }}</p>
        <p v-for="(player, index) in action.payload.players" :key="index">
          <svg 
            v-if="!!player.nation"
            class="inline-block mr-1" 
            xmlns="http://www.w3.org/2000/svg" 
            width="30" 
            height="20"
            >
            <Flag :nation="player.nation.value" width="30"></Flag>
          </svg>
          <span v-if="!action.payload.variant || action.payload.variant === 'standard'" v-html=initializeAction(player)></span>
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
        </svg>
        <div class="flex justify-between">
          <p>{{ processAction(action) }}</p>
          <p>{{ toString(timestamp) }}</p>
        </div>
      </div>  
      <div v-else class="flex justify-between">
        <p>- {{ processAction(action) }}</p>
        <p>{{ toString(timestamp) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { DateTime } from "luxon";

import Flag from "./flags/Flag.vue";
import stringify from "../stringify.js";

export default {
  name: "GameLogEntry",
  props: { events: Object, index: Number, board: Object },
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
        case "undo":
          return `${action.payload.player} performed an undo on their last action.`;
        case "rondel":
          return this.rondelAction(action.payload);
        case "buildFactory":
          return this.buildFactoryAction(action.payload);
        case "skipBuildFactory":
          return `${action.payload.player} chose not to build a factory for ${stringify(action.payload.nation.value)}.`;
        case "bondPurchase":
          return this.bondPurchaseAction(action.payload);
        case "skipBondPurchase":
          return `${action.payload.player} chose not to buy a bond.`;
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
        case "destroyFactory":
          return this.destroyFactoryAction(action.payload);
        case "skipDestroyFactory":
          return `A factory was not destroyed in ${action.payload.province}.`
        case "endManeuver":
          return this.endManeuverAction();
        case "forceInvestor":
          return `${action.payload.player} forced a move on the Investor slot.`
        case "skipForceInvestor":
          return `${action.payload.player} did not force a move on the Investor slot.`
        case "endGame":
          return "Game Over!";
        case "playerGainsCash":
          return `${action.payload.player} gained ${action.payload.amount}m in taxes.`;
        case "nationGainsTreasury":
          return `${stringify(action.payload.nation.value)} gained ${action.payload.amount}m in taxes.`;
        case "nationGainsPowerPoints":
          return `${stringify(action.payload.nation.value)} gained ${action.payload.powerPoints} power points.`;
        case "nationPaysPlayer":
          return `${stringify(action.payload.nation.value)} paid ${action.payload.player} ${action.payload.amount}m.`;
        case "playerTradedInForABond":
          return `${action.payload.player} traded in their ${stringify(action.payload.bondNation.value)} bond for ${action.payload.bondCost}m.`;
        case "playerAutoSkipsBondPurchase":
          return `${action.payload.player} could not buy a bond from ${stringify(action.payload.bondNation.value)} because of insufficient funds.`;
        case "playerPaysForRondel": {
          let slot = this.capitalize(action.payload.slot).replace(/\d/g,"");
          return `${action.payload.player} paid ${action.payload.cost}m to move to the ${slot} slot on the rondel.`;
        }
        case "playerInvests": {
          return `${action.payload.player} received 2m for holding the investor card.`;
        }
        case "unfriendlyEntrance": {
          return `${action.payload.challenger} has violently entered ${action.payload.province} (${action.payload.incumbent}).`
        }
        case "friendlyEntrance": {
          return `${action.payload.challenger} has peacefully entered ${action.payload.province} (${action.payload.incumbent}).`
        }
        case "blockCanal": {
          return "A canal has been blocked."
        }
        case "unblockCanal": {
          return "A canal has not been blocked."
        }
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
      return `Built a factory in ${province} for 5m.`;
    },
    bondPurchaseAction(payload) {
      let player = payload.player;
      let cost = payload.cost;
      let nation = stringify(payload.nation.value);
      return `${player} bought the ${cost}m bond from ${nation}.`;
    },
    importAction(payload) {
      let provincesList = payload.placements.map((item) => { return this.capitalize(item.province) });
      let province = provincesList[0];
      let provinces = provincesList.slice(0,-1).join(", ") + " and " + provincesList.slice(-1);
      let provincesText = provincesList.length > 1 ? provinces : province;
      let unit = provincesList.length > 1 ? "units" : "unit";
      return `Imported a total of ${provincesList.length} ${unit} into ${provincesText}.`;
    },
    maneuverAction(payload) {
      let unit;
      if (this.board.graph.get(payload.destination).isOcean) {
        unit = "a fleet";
      } else {
        unit = "an army";
      }
      let origin = this.capitalize(payload.origin);
      let destination = this.capitalize(payload.destination);
      return `Moved ${unit} from ${origin} to ${destination}.`;
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
      return `${challenger} has picked a fight with ${incumbent} in ${province}.`;
    },
    destroyFactoryAction(payload) {
      let province = this.capitalize(payload.province);
      return `Factory destroyed in ${province}.`;
    },
    endManeuverAction() {
      return `Military maneuvers have ended for now.`
    },
    toString(timestamp) {
      if (timestamp !== "" && timestamp) {
        let out = DateTime.fromISO(timestamp).toLocaleString(DateTime.DATETIME_FULL);
        if (out === "Invalid DateTime") {
          out = "Automated";
        }
        return out;
      }

      return "Automated";
    }
  }
}
</script>

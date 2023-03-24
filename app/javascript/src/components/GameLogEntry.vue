<template>
  <div class="border border-black bg-gray-100 rounded p-2 m-2 rondel">
    <div
      v-for="({action, timestamp}, i) in event"
      :key="i"
    >
      <div v-if="action.type === 'initialize'">
        <div class="flex justify-between">
          <p>{{ action.payload.soloMode ? "Solo game started!" : "Game started!" }}</p>
          <p>{{ toString(timestamp) }}</p>
        </div>
        <p>Variant: {{ action.payload.variant || "standard" }}</p>
        <p
          v-for="(player, innerIndex) in action.payload.players"
          :key="innerIndex"
        >
          <Flag
            v-if="!!player.nation"
            :nation="getNation(player.nation)"
            class="inline-block mr-1"
            width="30"
            height="20"
          />
          <span
            v-if="!action.payload.variant || action.payload.variant === 'standard'"
            v-html="initializeAction(player)"
          />
        </p>
      </div>
      <div v-else-if="action.type === 'rondel'">
        <b>Turn {{ index }}: </b>
        <Flag
          :nation="getNation(action.payload.nation)"
          class="inline-block mr-1"
          width="30"
          height="20"
        />
        <b>{{ action.playerName }}</b>
        <div class="flex justify-between">
          <p>{{ renderAction(action) }}</p>
          <p>{{ toString(timestamp) }}</p>
        </div>
      </div>
      <div
        v-else
        class="flex justify-between"
      >
        <p>- {{ renderAction(action) }}</p>
        <p>{{ toString(timestamp) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { DateTime } from 'luxon';

import Flag from './flags/Flag.vue';
import {
  capitalize,
  displayLocationName, displayNationName, displayMonetaryValue_InMillions,
  unitTypeByDestination_Singular, unitTypeByDestination_Plural
} from '../stringify';

export default {
  name: 'GameLogEntry',
  components: { Flag },
  props: {
    events: { type: Object, default: () => {} },
    index: { type: Number, default: 0 },
    board: { type: Object, default: () => {} },
  },
  computed: {
    event() {
      return this.events.event;
    },
  },
  methods: {
    capitalize(word) {
      return capitalize(word);
    },
    displayLocationName(word) {
      return displayLocationName(word);
    },
    displayMonetaryValue_InMillions(value) {
      return displayMonetaryValue_InMillions(value);
    },
    unitTypeByDestination_Singular(destination) {
      return unitTypeByDestination_Singular(this.board.graph.get(destination).isOcean);
    },
    unitTypeByDestination_Plural(destination) {
      return unitTypeByDestination_Plural(this.board.graph.get(destination).isOcean);
    },
    displayNationName(nation) {
      return displayNationName(nation);
    },
    renderAction(action) {
      const notImplemented = 'NOT IMPLEMENTED';
      switch (action.type) {
        case 'initialize':
          return notImplemented;
        case 'undo':
          return `${action.payload.player} performed an undo on their last action.`;
        case 'rondel':
          return this.rondelAction(action.payload);
        case 'buildFactory':
          return this.buildFactoryAction(action.payload);
        case 'skipBuildFactory':
          return `${action.payload.player} chose not to build a factory for ${this.displayNationName(action.payload.nation.value)}.`;
        case 'couldNotBuildFactory':
          return `There were insufficient funds to build a factory for ${this.displayNationName(action.payload.nation.value)}.`;
        case 'bondPurchase':
          return this.bondPurchaseAction(action.payload);
        case 'skipBondPurchase':
          return `${action.payload.player} chose not to buy a bond.`;
        case 'import':
          return this.importAction(action.payload);
        case 'production':
          return notImplemented;
        case 'maneuver':
          return this.maneuverAction(action.payload);
        case 'coexist':
          return this.coexistAction(action.payload);
        case 'fight':
          return this.fightAction(action.payload);
        case 'destroyFactory':
          return this.destroyFactoryAction(action.payload);
        case 'skipDestroyFactory':
          return `A factory was not destroyed in ${action.payload.province}.`;
        case 'endManeuver':
          return this.endManeuverAction();
        case 'forceInvestor':
          return `${action.payload.player} forced a move on the Investor slot.`;
        case 'skipForceInvestor':
          return `${action.payload.player} did not force a move on the Investor slot.`;
        case 'endGame':
          return 'Game Over!';
        case 'playerGainsCash':
          return `${action.payload.player} gained ${action.payload.amount}m in taxes.`;
        case 'nationGainsTreasury':
          return `${this.displayNationName(action.payload.nation.value)} has changed by ${action.payload.amount}m in taxes.`;
        case 'nationGainsPowerPoints':
          return `${this.displayNationName(action.payload.nation.value)} gained ${action.payload.powerPoints} power points.`;
        case 'nationPaysPlayer':
          return `${this.displayNationName(action.payload.nation.value)} paid ${action.payload.player} ${action.payload.amount}m.`;
        case 'investorCardHolderChanged':
          return `${action.payload.oldInvestorCardHolder} has passed the investor card to ${action.payload.newInvestorCardHolder}.`;
        case 'nationControllerChanged':
          return `Control of ${this.displayNationName(action.payload.nation.value)} has passed from ${action.payload.oldNationController} to ${action.payload.newNationController}.`;
        case 'playerTradedInForABond':
          return `${action.payload.player} traded in their ${this.displayNationName(action.payload.bondNation.value)} bond for ${action.payload.bondCost}m.`;
        case 'playerAutoSkipsBondPurchase':
          return `${action.payload.player} could not buy a bond from ${this.displayNationName(action.payload.bondNation.value)} because of insufficient funds.`;
        case 'playerPaysForRondel': {
          const slot = this.capitalize(action.payload.slot).replace(/\d/g, '');
          return `${action.payload.player} paid ${action.payload.cost}m to move to the ${slot} slot on the rondel.`;
        }
        case 'playerInvests': {
          return `${action.payload.player} received 2m for holding the investor card.`;
        }
        case 'unfriendlyEntrance': {
          return `${this.displayNationName(action.payload.challenger.value)} has violently entered ${this.displayLocationName(action.payload.province)} (${this.displayNationName(action.payload.incumbent.value)}).`;
        }
        case 'friendlyEntrance': {
          return `${this.displayNationName(action.payload.challenger.value)} has peacefully entered ${this.displayLocationName(action.payload.province)} (${this.displayNationName(action.payload.incumbent.value)}).`;
        }
        case 'blockCanal': {
          return 'A canal has been blocked.';
        }
        case 'unblockCanal': {
          return 'A canal has not been blocked.';
        }
        default: { return notImplemented; }
      }
    },
    initializeAction(player) {
      const name = player.id;
      const nation = this.displayNationName(player.nation.value);
      return `<strong>${nation}</strong> is controlled by <strong>${name}</strong>`;
    },
    getNation(nation) {
      if (nation.value === 'CN' && nation.label === 'NationAsia') {
        return 'CNAsia';
      }
      return nation.value;
    },
    rondelAction(payload) {
      const nation = this.displayNationName(payload.nation.value);
      const slot = this.capitalize(payload.slot).replace(/\d/g, '');
      return `${nation} advanced to the ${slot} rondel slot.`;
    },
    buildFactoryAction(payload) {
      const province = this.displayLocationName(payload.province);
      const totalCost = payload.nationCosts ? payload.nationCosts + payload.playerCosts : 5;

      const factoryDescription = `a factory in ${province} for ${this.displayMonetaryValue_InMillions(totalCost)}.`;

      if (payload.nationCosts) {
        const nation = this.displayNationName(this.board.graph.get(payload.province).nation.value);
        const { player } = payload;
        
        if (payload.playerCosts === 0) {
          return "Built " + factoryDescription;
        } else {
          return `${player} funded ${nation} ${this.displayMonetaryValue_InMillions(payload.playerCosts)} to build ` + factoryDescription;
        }
      } else {
        return "Built " + factoryDescription;
      }
    },
    bondPurchaseAction(payload) {
      const { player } = payload;
      const { cost } = payload;
      const nation = this.displayNationName(payload.nation.value);
      return `${player} bought the ${cost}m bond from ${nation}.`;
    },
    importAction(payload) {
      const provincesList = payload.placements.map((item) => this.displayLocationName(item.province));
      const province = provincesList[0];
      const provinces = `${provincesList.slice(0, -1).join(', ')} and ${provincesList.slice(-1)}`;
      const provincesText = provincesList.length > 1 ? provinces : province;
      const unit = provincesList.length > 1 ? 'units' : 'unit';
      return `Imported a total of ${provincesList.length} ${unit} into ${provincesText}.`;
    },
    maneuverAction(payload) {
      const unit = this.unitTypeByDestination_Singular(payload.destination);
      const origin = this.displayLocationName(payload.origin);
      const destination = this.displayLocationName(payload.destination);

      return `Moved ${unit} from ${origin} to ${destination}.`;
    },
    coexistAction(payload) {
      const units = this.capitalize(this.unitTypeByDestination_Plural(payload.province));
      // technically it could be a fleet in port sharing the province with an army

      const province = this.displayLocationName(payload.province);
      const nations = `${this.displayNationName(payload.incumbent.value)} and ${this.displayNationName(payload.challenger.value)}`;

      return `${units} from ${nations} are peacefully coexisting in ${province}.`;
    },
    fightAction(payload) {
      const province = this.displayLocationName(payload.province);
      const incumbent = this.displayNationName(payload.incumbent.value);
      const challenger = this.displayNationName(payload.challenger.value);
      return `${challenger} has picked a fight with ${incumbent} in ${province}.`;
    },
    destroyFactoryAction(payload) {
      const province = this.displayLocationName(payload.province);
      return `Factory destroyed in ${province}.`;
    },
    endManeuverAction() {
      return 'Military maneuvers have ended for now.';
    },
    toString(timestamp) {
      if (timestamp !== '' && timestamp) {
        let out = DateTime.fromISO(timestamp).toLocaleString(DateTime.DATETIME_FULL);
        if (out === 'Invalid DateTime') {
          out = 'Automated';
        }
        return out;
      }

      return 'Automated';
    },
  },
};
</script>

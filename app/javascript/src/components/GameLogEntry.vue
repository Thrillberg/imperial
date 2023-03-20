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
          <p>{{ processAction(action) }}</p>
          <p>{{ toString(timestamp) }}</p>
        </div>
      </div>
      <div
        v-else
        class="flex justify-between"
      >
        <p>- {{ processAction(action) }}</p>
        <p>{{ toString(timestamp) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { DateTime } from 'luxon';

import Flag from './flags/Flag.vue';
import stringify from '../stringify';

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
      if (word) {
        switch (word) {
          case 'bayofbiscay': return 'Bay of Biscay';
          case 'blacksea': return 'Black Sea';
          case 'westernmediterraneansea': return 'Western Mediterranean Sea';
          case 'easternmediterraneansea': return 'Eastern Mediterranean Sea';
          case 'northsea': return 'North Sea';
          case 'northatlantic': return 'North Atlantic';
          case 'balticsea': return 'Baltic Sea';
          case 'englishchannel': return 'English Channel';
          case 'westbalkan': return 'West Balkan';
          case 'stpetersburg': return 'St. Petersburg';
          case 'northpacific': return 'North Pacific';
          case 'southpacific': return 'South Pacific';
          case 'caribbeansea': return 'Caribbean Sea';
          case 'southatlantic': return 'South Atlantic';
          case 'gulfofguinea': return 'Gulf of Guinea';
          case 'mediterraneansea': return 'Mediterranean Sea';
          case 'indianocean': return 'Indian Ocean';
          case 'seaofjapan': return 'Sea of Japan';
          case 'chinasea': return 'China Sea';
          case 'tasmansea': return 'Tasman Sea';
          case 'northafrica': return 'North Africa';
          case 'southafrica': return 'South Africa';
          case 'eastafrica': return 'East Africa';
          case 'neareast': return 'Near East';
          case 'newzealand': return 'New Zealand';
          case 'newdelhi': return 'New Delhi';
          case 'riodejaneiro': return 'Rio de Janeiro';
          case 'newyork': return 'New York';
          case 'neworleans': return 'New Orleans';
          case 'sanfrancisco': return 'San Francisco';
          default: return (word[0].toUpperCase() + word.substring(1));
        }
      }
      return '';
    },
    unitTypeByDestination_Singular(destination) {
      if (this.board.graph.get(destination).isOcean) {
        return 'a fleet';
      } else {
        return 'an army';
      }
    },
    unitTypeByDestination_Plural(destination) {
      if (this.board.graph.get(destination).isOcean) {
        return 'fleets';
      } else {
        return 'armies';
      }
    },
    processAction(action) {
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
          return `${action.payload.player} chose not to build a factory for ${stringify(action.payload.nation.value)}.`;
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
          return `${stringify(action.payload.nation.value)} has changed by ${action.payload.amount}m in taxes.`;
        case 'nationGainsPowerPoints':
          return `${stringify(action.payload.nation.value)} gained ${action.payload.powerPoints} power points.`;
        case 'nationPaysPlayer':
          return `${stringify(action.payload.nation.value)} paid ${action.payload.player} ${action.payload.amount}m.`;
        case 'investorCardHolderChanged':
          return `${action.payload.oldInvestorCardHolder} has passed the investor card to ${action.payload.newInvestorCardHolder}.`;
        case 'nationControllerChanged':
          return `Control of ${stringify(action.payload.nation.value)} has passed from ${action.payload.oldNationController} to ${action.payload.newNationController}.`;
        case 'playerTradedInForABond':
          return `${action.payload.player} traded in their ${stringify(action.payload.bondNation.value)} bond for ${action.payload.bondCost}m.`;
        case 'playerAutoSkipsBondPurchase':
          return `${action.payload.player} could not buy a bond from ${stringify(action.payload.bondNation.value)} because of insufficient funds.`;
        case 'playerPaysForRondel': {
          const slot = this.capitalize(action.payload.slot).replace(/\d/g, '');
          return `${action.payload.player} paid ${action.payload.cost}m to move to the ${slot} slot on the rondel.`;
        }
        case 'playerInvests': {
          return `${action.payload.player} received 2m for holding the investor card.`;
        }
        case 'unfriendlyEntrance': {
          return `${stringify(action.payload.challenger.value)} has violently entered ${this.capitalize(action.payload.province)} (${stringify(action.payload.incumbent.value)}).`;
        }
        case 'friendlyEntrance': {
          return `${stringify(action.payload.challenger.value)} has peacefully entered ${this.capitalize(action.payload.province)} (${stringify(action.payload.incumbent.value)}).`;
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
      const nation = stringify(player.nation.value);
      return `<strong>${nation}</strong> is controlled by <strong>${name}</strong>`;
    },
    getNation(nation) {
      if (nation.value === 'CN' && nation.label === 'NationAsia') {
        return 'CNAsia';
      }
      return nation.value;
    },
    rondelAction(payload) {
      const nation = stringify(payload.nation.value);
      const slot = this.capitalize(payload.slot).replace(/\d/g, '');
      return `${nation} advanced to the ${slot} rondel slot.`;
    },
    buildFactoryAction(payload) {
      const province = this.capitalize(payload.province);
      return `Built a factory in ${province} for 5m.`;
    },
    bondPurchaseAction(payload) {
      const { player } = payload;
      const { cost } = payload;
      const nation = stringify(payload.nation.value);
      return `${player} bought the ${cost}m bond from ${nation}.`;
    },
    importAction(payload) {
      const provincesList = payload.placements.map((item) => this.capitalize(item.province));
      const province = provincesList[0];
      const provinces = `${provincesList.slice(0, -1).join(', ')} and ${provincesList.slice(-1)}`;
      const provincesText = provincesList.length > 1 ? provinces : province;
      const unit = provincesList.length > 1 ? 'units' : 'unit';
      return `Imported a total of ${provincesList.length} ${unit} into ${provincesText}.`;
    },
    maneuverAction(payload) {
      const unit = this.unitTypeByDestination_Singular(payload.destination);
      const origin = this.capitalize(payload.origin);
      const destination = this.capitalize(payload.destination);

      return `Moved ${unit} from ${origin} to ${destination}.`;
    },
    coexistAction(payload) {
      const units = this.capitalize(this.unitTypeByDestination_Plural(payload.province));
      // technically it could be a fleet in port sharing the province with an army

      const province = this.capitalize(payload.province);
      const nations = `${stringify(payload.incumbent.value)} and ${stringify(payload.challenger.value)}`;

      return `${units} from ${nations} are peacefully coexisting in ${province}.`;
    },
    fightAction(payload) {
      const province = this.capitalize(payload.province);
      const incumbent = stringify(payload.incumbent.value);
      const challenger = stringify(payload.challenger.value);
      return `${challenger} has picked a fight with ${incumbent} in ${province}.`;
    },
    destroyFactoryAction(payload) {
      const province = this.capitalize(payload.province);
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

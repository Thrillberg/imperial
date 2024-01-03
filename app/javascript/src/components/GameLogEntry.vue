<template>
  <v-list-item
    v-for="({action, timestamp}, i) in event"
    :key="i"
    :style="{
      backgroundColor: backgroundColor(action),
      color: textColor(action)
    }"
  >
    <v-list
      v-if="action.type === 'initialize'"
      dense
    >
      <v-list-item>
        <v-list-title>
          <b>{{ action.payload.soloMode ? "Solo game started!" : "Game started!" }}</b>
        </v-list-title>
      </v-list-item>
      <v-list-item>
        <v-list-title>
          Variant: {{ action.payload.variant || "standard" }}
        </v-list-title>
      </v-list-item>
      <v-list
        v-if="!action.payload.variant || action.payload.variant === 'standard'"
        density="compact"
      >
        <v-list-item
          v-for="(player, innerIndex) in action.payload.players"
          :key="innerIndex"
        >
          <template #prepend>
            <Flag
              v-if="!!player.nation"
              :nation="getNation(player.nation)"
              class="inline-block mr-1"
              width="30"
              height="20"
            />
          </template>
          <v-list-title>{{ initializeAction(player) }}</v-list-title>
        </v-list-item>
      </v-list>
    </v-list>
    <v-list-item v-else-if="action.type === 'rondel'">
      <template #prepend>
        <Flag
          :nation="getNation(action.payload.nation)"
          class="inline-block mr-1"
          width="30"
          height="20"
        />
      </template>
      <v-list-item-title>{{ 'Turn ' + index }}</v-list-item-title>
      <b>{{ action.playerName }}</b>
      <div class="d-flex justify-space-between">
        <p>{{ rondelAction(action.payload) }}</p>
      </div>
    </v-list-item>
    <v-list-item
      v-else-if="
        ['bondPurchase', 'skipBondPurchase'].includes(action.type) && action.payload.nation
      "
    >
      <v-list-title>{{ renderAction(action) }}</v-list-title>
    </v-list-item>
    <v-list-item
      v-else-if="
        ['playerAutoSkipsBondPurchase'].includes(action.type) && action.payload.bondNation
      "
    >
      <v-list-title>{{ renderAction(action) }}</v-list-title>
    </v-list-item>
    <v-list-item v-else>
      <v-list-title>{{ renderAction(action) }}</v-list-title>
    </v-list-item>
    <template #append>
      {{ timestampToString(timestamp) }}
    </template>
  </v-list-item>
</template>

<script>
import { DateTime } from 'luxon';
import { nationColors } from '../../../../nationColors';

import {
  capitalize,
  displayLocationName,
  displayMonetaryValueInMillions,
  displayNationName,
  unitTypeByDestinationPlural,
  unitTypeByDestinationSingular,
} from '../stringify';
import Flag from './flags/Flag.vue';

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
      return displayMonetaryValueInMillions(value);
    },
    unitTypeByDestination_Singular(destination) {
      return unitTypeByDestinationSingular(this.board.graph.get(destination).isOcean);
    },
    unitTypeByDestination_Plural(destination) {
      return unitTypeByDestinationPlural(this.board.graph.get(destination).isOcean);
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
          return `${action.payload.player} chose not to build a factory for `
            + `${this.displayNationName(action.payload.nation.value)}.`;
        case 'couldNotBuildFactory':
          return `There were insufficient funds to build a factory for ${this.displayNationName(action.payload.nation.value)}.`;
        case 'bondPurchase':
          return this.bondPurchaseAction(action.payload);
        case 'skipBondPurchase':
          if (action.payload.nation) {
            return `${action.payload.player} chose not to buy a bond from ${this.displayNationName(
              action.payload.nation.value,
            )}.`;
          }

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
          return `${this.displayNationName(action.payload.nation.value)} paid `
            + `${action.payload.player} ${action.payload.amount}m.`;
        case 'investorCardHolderChanged':
          return `${action.payload.oldInvestorCardHolder} has passed the investor card to `
            + `${action.payload.newInvestorCardHolder}.`;
        case 'nationControllerChanged':
          return `Control of ${this.displayNationName(action.payload.nation.value)} has passed from `
            + `${action.payload.oldNationController} to ${action.payload.newNationController}.`;
        case 'playerTradedInForABond':
          return `${action.payload.player} traded in their ${this.displayNationName(action.payload.bondNation.value)} bond `
            + `for ${action.payload.bondCost}m.`;
        case 'playerAutoSkipsBondPurchase':
          return `${action.payload.player} could not buy a bond from ${this.displayNationName(action.payload.bondNation.value)} `
            + 'because of insufficient funds.';
        case 'playerPaysForRondel': {
          const slot = this.capitalize(action.payload.slot).replace(/\d/g, '');
          return `${action.payload.player} paid ${action.payload.cost}m to move to the ${slot} slot on the rondel.`;
        }
        case 'playerInvests': {
          return `${action.payload.player} received 2m for holding the investor card.`;
        }
        case 'unfriendlyEntrance': {
          return `${this.displayNationName(action.payload.challenger.value)} has violently entered `
            + `${this.displayLocationName(action.payload.province)} (${this.displayNationName(action.payload.incumbent.value)}).`;
        }
        case 'friendlyEntrance': {
          return `${this.displayNationName(action.payload.challenger.value)} has peacefully entered `
            + `${this.displayLocationName(action.payload.province)} (${this.displayNationName(action.payload.incumbent.value)}).`;
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
      return `${nation} is controlled by ${name}`;
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
      return `${nation} → ${slot}`;
    },
    buildFactoryAction(payload) {
      const province = this.displayLocationName(payload.province);
      const totalCost = payload.nationCosts ? payload.nationCosts + payload.playerCosts : 5;

      const factoryDescription = `a factory in ${province} for ${this.displayMonetaryValue_InMillions(totalCost)}.`;

      if (payload.playerCosts) {
        const nation = this.displayNationName(this.board.graph.get(payload.province).nation.value);
        const { player } = payload;

        return `${player} funded ${nation} ${this.displayMonetaryValue_InMillions(payload.playerCosts)} `
          + `to build ${factoryDescription}`;
      }
      return `Built ${factoryDescription}`;
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
      const units = this.capitalize(this.unitTypeByDestination_Singular(payload.province));
      // technically it could be a fleet in port sharing the province with an army

      const province = this.displayLocationName(payload.province);
      const nations = `${this.displayNationName(payload.incumbent.value)} and `
        + `${this.displayNationName(payload.challenger.value)}`;

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
    timestampToString(timestamp) {
      if (timestamp !== '' && timestamp) {
        let out = DateTime.fromISO(timestamp).toLocaleString(DateTime.DATETIME_SHORT);
        if (out === 'Invalid DateTime') {
          out = '';
        }
        return out;
      }

      return '';
    },
    nationColors(nation) {
      return nationColors[nation];
    },
    rondelColors(slot) {
      return {
        production1: '#8C8798',
        maneuver1: '#7EA850',
        investor: '#8EDFFF',
        import: '#F39D81',
        production2: '#8C8798',
        maneuver2: '#7EA850',
        taxation: '#FFD281',
        factory: '#8DBCFB',
      }[slot];
    },
    backgroundColor(action) {
      if (action.payload.slot) {
        return this.rondelColors(action.payload.slot);
      } if (action.payload.nation?.value) {
        return nationColors[action.payload.nation.value];
      } if (action.payload.bondNation?.value) {
        return nationColors[action.payload.bondNation.value];
      }
      return 'white';
    },
    textColor(action) {
      if (action.payload.slot) {
        return action.payload.slot.replace(/\d/g, '') === 'production' ? 'white' : 'black';
      } if (action.payload.nation?.value) {
        return ['IT', 'BR', 'JP', 'RU'].includes(action.payload.nation.value) ? 'white' : 'black';
      } if (action.payload.bondNation?.value) {
        return ['IT', 'BR', 'JP', 'RU'].includes(action.payload.bondNation.value) ? 'white' : 'black';
      }
      return 'black';
    },
  },
};
</script>

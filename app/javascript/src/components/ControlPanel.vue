<template>
  <v-sheet
    border
    rounded
    class="pa-2"
  >
    <v-row>
      <v-col
        v-if="canUndo()"
      >
        <v-btn
          color="secondary"
          @click="undo"
        >
          Undo
        </v-btn>
      </v-col>
      <v-col
        v-if="!purchasingBond"
      >
        <AvailableBonds :game="game" />
      </v-col>
      <v-col>
        <TaxStatus :game="game" />
      </v-col>
      <v-col>
        <TaxChart
          :show-bonus="game.baseGame === 'imperial2030' || game.baseGame === 'imperialEurope2030'"
          :taxes="taxes()"
        />
      </v-col>
      <BondPurchase
        v-if="!paused && purchasingBond"
        :game="game"
        :current-player="controllingPlayerName"
        :profile="profile"
        :traded-in-value="tradedInValue"
        :traded-in-bond-nation="tradedInBondNation"
        @purchase-bond="purchaseBond"
        @skip="skipPurchaseBond"
        @toggle-trade-in="(bond) => $emit('toggleTradeIn', bond)"
      />
      <v-col v-if="!paused && canEndManeuver">
        <v-btn
          color="error"
          @click="endManeuver"
        >
          End maneuver
        </v-btn>
      </v-col>
      <v-col
        v-if="!paused && game.importing
          && !chooseImportType
          && (profile.username === controllingPlayerName || (game.soloMode && hostingThisGame))"
      >
        <v-btn
          color="error"
          @click="$emit('runImport')"
        >
          End import
        </v-btn>
        <div class="m-2">
          You have
          <b>{{ game.maxImports - importPlacements.length }}</b> imports left.
        </div>
      </v-col>
      <v-col
        v-if="!paused && game.importing
          && !!chooseImportType
          && (profile.username === controllingPlayerName || (game.soloMode && hostingThisGame))"
      >
        <v-row justify="space-evenly">
          <v-col class="text-center">
            <v-btn
              color="primary-darken-1"
              @click="$emit('chooseImportType', 'army')"
            >
              Army
            </v-btn>
          </v-col>
          <v-col class="text-center">
            <v-btn
              color="primary-darken-1"
              @click="$emit('chooseImportType', 'fleet')"
            >
              Fleet
            </v-btn>
          </v-col>
        </v-row>
        Please choose if you want to import an <b>army</b> or a <b>fleet</b>.
      </v-col>
      <ConflictHandler
        v-if="!paused"
        :game="game"
        :profile="profile"
        :controlling-player-name="controllingPlayerName"
        :hosting-this-game="hostingThisGame"
        @tick-with-action="tickWithAction"
      />
      <v-col v-if="!paused && canForceInvestor">
        <v-btn
          color="primary-darken-1"
          @click="forceInvestor"
        >
          Force investor
        </v-btn>
        <v-btn
          color="primary-darken-1"
          @click="skipForceInvestor"
        >
          Do not force investor
        </v-btn>
      </v-col>
      <v-col v-if="!paused && canBlockCanal">
        <v-btn
          color="primary-darken-1"
          @click="blockCanal"
        >
          Block canal
        </v-btn>
        <v-btn
          color="primary-darken-1"
          @click="unblockCanal"
        >
          Do not block canal
        </v-btn>
      </v-col>
      <v-col
        v-if="!paused && game.buildingFactory
          && (profile.username === controllingPlayerName || (game.soloMode && hostingThisGame))"
      >
        <v-btn
          color="primary-darken-1"
          @click="$emit('skipBuildFactory')"
        >
          Skip building a factory
        </v-btn>
      </v-col>
      <v-col v-if="!paused && destroyingFactory()">
        <div class="text-lg">
          Do you want to destroy the factory at <b>{{ factoryToDestroy }}</b>?
        </div>
        <div class="flex flex-wrap justify-evenly">
          <v-btn
            color="primary-darken-1"
            @click="destroyFactory"
          >
            Yes
          </v-btn>
          <v-btn
            color="primary-darken-1"
            @click="skipDestroyFactory"
          >
            No
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
import Action from '../../Domain/action';

import AvailableBonds from './AvailableBonds.vue';
import BondPurchase from './BondPurchase.vue';
import ConflictHandler from './ConflictHandler.vue';
import TaxChart from './TaxChart.vue';
import TaxStatus from './TaxStatus.vue';

export default {
  name: 'ControlPanel',
  components: {
    AvailableBonds, BondPurchase, ConflictHandler, TaxStatus, TaxChart,
  },
  props: {
    game: { type: Object, default: () => {} },
    chooseImportType: { type: String, default: '' },
    controllingPlayerName: { type: String, default: '' },
    paused: { type: Boolean },
    profile: { type: Object, default: () => {} },
    importPlacements: { type: Array, default: () => [] },
    gameData: { type: Object, default: () => {} },
    tradedInBondNation: { type: String, default: '' },
    tradedInValue: { type: Number, default: 0 },
    hostingThisGame: { type: Boolean },
    upgradeableBonds: { type: Array, default: () => [] },
  },
  emits: ['runImport', 'chooseImportType', 'skipBuildFactory', 'purchaseBond', 'toggleTradeIn', 'endManeuver', 'tick'],
  data() {
    return { factoryToDestroy: '' };
  },
  computed: {
    purchasingBond() {
      const purchasingBond = this.game.availableActions.size > 0
        && Array.from(this.game.availableActions).every(
          (action) => action.type === 'bondPurchase' || action.type === 'skipBondPurchase' || action.type === 'undo',
        );
      return (
        purchasingBond
        && (
          this.profile.username === this.controllingPlayerName
          || (this.game.soloMode && this.hostingThisGame)
        )
      );
    },
    canForceInvestor() {
      if (this.game.availableActions.size > 0
        && Array.from(
          this.game.availableActions,
        ).every((action) => action.type === 'forceInvestor' || action.type === 'skipForceInvestor' || action.type === 'undo')
      ) {
        if (
          this.game.swissBanks.includes(this.profile.username)
          || (this.game.soloMode && this.hostingThisGame)
        ) {
          return true;
        }
      }
      return false;
    },
    canBlockCanal() {
      if (
        Array.from(this.game.availableActions).every(
          (action) => action.type === 'blockCanal'
            || action.type === 'unblockCanal'
            || action.type === 'undo',
        )
      ) {
        if (
          this.profile.username === this.controllingPlayerName
          || (this.game.soloMode && this.hostingThisGame)
        ) {
          if (this.game.winner === '') {
            return true;
          }
        }
      }
      return false;
    },
    canEndManeuver() {
      // We don't handle the case where control has passed because someone can block a canal
      // so there is the following exception.
      if (
        Array.from(this.game.availableActions).every(
          (action) => action.type === 'blockCanal'
            || action.type === 'unblockCanal'
            || action.type === 'undo',
        )
      ) {
        return false;
      }

      return this.game.maneuvering
      && this.factoryToDestroy === ''
      && this.game.provinceInConflict === ''
      && (
        this.profile.username === this.game.currentPlayerName
          || (this.game.soloMode && this.hostingThisGame)
      );
    },
  },
  methods: {
    purchaseBond(bond) {
      this.$emit('purchaseBond', bond);
    },
    skipPurchaseBond() {
      for (const action of this.game.availableActions) {
        if (action.type === 'skipBondPurchase') {
          this.tickWithAction(action);
        }
      }
    },
    endManeuver() {
      this.$emit('endManeuver', Action.endManeuver());
    },
    tickWithAction(action) {
      this.$emit('tick', action);
    },
    destroyingFactory() {
      if (
        this.profile.username !== this.controllingPlayerName
        && !(this.game.soloMode && this.hostingThisGame)
      ) {
        return false;
      }

      let destroyingFactory = false;
      for (const action of this.game.availableActions) {
        if (action.type === 'destroyFactory' || action.type === 'skipDestroyFactory') {
          destroyingFactory = true;
          this.factoryToDestroy = action.payload.province;
        }
      }
      return destroyingFactory;
    },
    destroyFactory() {
      let destroyAction = {};
      for (const action of this.game.availableActions) {
        if (action.type === 'destroyFactory') {
          destroyAction = action;
        }
      }
      this.tickWithAction(destroyAction);
      this.factoryToDestroy = '';
    },
    skipDestroyFactory() {
      let skipAction = {};
      for (const action of this.game.availableActions) {
        if (action.type === 'skipDestroyFactory') {
          skipAction = action;
        }
      }
      this.tickWithAction(skipAction);
      this.factoryToDestroy = '';
    },
    canUndo() {
      let canUndo = false;
      for (const action of this.game.availableActions) {
        if (
          action.type === 'undo' && (
            action.payload.player === this.profile.username
            || (this.game.soloMode && this.hostingThisGame)
          )
        ) {
          canUndo = true;
        }
      }

      return canUndo;
    },
    taxes() {
      if (this.game.baseGame === 'imperial') {
        return [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5].map((slot) => {
          const nations = [];
          for (const [nation, data] of this.game.nations) {
            if (data.taxChartPosition === slot) {
              nations.push(nation.value);
            }
          }
          const powerPointIncrease = slot - 5;
          return { slot, nations, powerPointIncrease };
        });
      } if (
        this.game.baseGame === 'imperial2030'
        || this.game.baseGame === 'imperialAsia'
        || this.game.baseGame === 'imperialEurope2030'
      ) {
        const taxes = [18, 16, 15, 14, 13, 12, 11, 10, 8, 6, 5];
        return taxes.map((slot, index) => {
          const nations = [];
          for (const [nation, data] of this.game.nations) {
            if (data.taxChartPosition >= slot) {
              nations.push(nation.value);
            }
          }
          const powerPointIncrease = taxes.length - index - 1;
          let bonus;
          switch (slot) {
            case 5: {
              bonus = 0;
              break;
            }
            case 6: {
              bonus = 1;
              break;
            }
            case 8: {
              bonus = 1;
              break;
            }
            case 10: {
              bonus = 2;
              break;
            }
            case 11: {
              bonus = 2;
              break;
            }
            case 12: {
              bonus = 3;
              break;
            }
            case 13: {
              bonus = 3;
              break;
            }
            case 14: {
              bonus = 4;
              break;
            }
            case 15: {
              bonus = 4;
              break;
            }
            case 16: {
              bonus = 5;
              break;
            }
            case 18: {
              bonus = 5;
              break;
            }
            default: {
              bonus = 0;
              break;
            }
          }
          return {
            slot, nations, powerPointIncrease, bonus,
          };
        });
      }

      return {};
    },
    undo() {
      for (const action of this.game.availableActions) {
        if (
          action.type === 'undo' && (
            action.payload.player === this.profile.username
            || (this.game.soloMode && this.hostingThisGame)
          )
        ) {
          this.tickWithAction(action);
        }
      }
    },
    forceInvestor() {
      for (const action of this.game.availableActions) {
        if (action.type === 'forceInvestor') {
          this.tickWithAction(action);
        }
      }
    },
    skipForceInvestor() {
      for (const action of this.game.availableActions) {
        if (action.type === 'skipForceInvestor') {
          this.tickWithAction(action);
        }
      }
    },
    blockCanal() {
      for (const action of this.game.availableActions) {
        if (action.type === 'blockCanal') {
          this.tickWithAction(action);
        }
      }
    },
    unblockCanal() {
      for (const action of this.game.availableActions) {
        if (action.type === 'unblockCanal') {
          this.tickWithAction(action);
        }
      }
    },
  },
};
</script>

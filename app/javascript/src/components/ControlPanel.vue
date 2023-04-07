<template>
  <v-row justify="space-evenly">
    <v-btn
      v-if="canUndo()"
      color="secondary"
      @click="undo"
    >
      Undo
    </v-btn>
    <AvailableBonds
      v-if="!purchasingBond"
      :game="game"
    />
    <TaxStatus :game="game" />
  </v-row>
  <v-row
    v-if="!paused"
    justify="space-evenly"
  >
    <v-col
      v-if="game.importing
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
      v-if="game.importing
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
    <v-btn
      v-if="canEndManeuver"
      color="error"
      @click="endManeuver"
    >
      End maneuver
    </v-btn>
    <ConflictHandler
      :game="game"
      :profile="profile"
      :controlling-player-name="controllingPlayerName"
      :hosting-this-game="hostingThisGame"
      @tick-with-action="tickWithAction"
    />
    <div
      v-if="canForceInvestor"
      class="text-center"
    >
      <button
        class="rounded p-2 m-1 sm:m-4 bg-green-800 text-white cursor-pointer"
        @click="forceInvestor"
      >
        Force investor
      </button>
      <button
        class="rounded p-2 m-1 sm:m-4 bg-green-800 text-white cursor-pointer"
        @click="skipForceInvestor"
      >
        Do not force investor
      </button>
    </div>
    <div
      v-if="canBlockCanal"
      class="text-center"
    >
      <button
        class="rounded p-2 m-1 sm:m-4 bg-green-800 text-white cursor-pointer"
        @click="blockCanal"
      >
        Block canal
      </button>
      <button
        class="rounded p-2 m-1 sm:m-4 bg-green-800 text-white cursor-pointer"
        @click="unblockCanal"
      >
        Do not block canal
      </button>
    </div>
    <v-btn
      v-if="game.buildingFactory
        && (profile.username === controllingPlayerName || (game.soloMode && hostingThisGame))"
      color="primary-darken-1"
      @click="$emit('skipBuildFactory')"
    >
      Skip building a factory
    </v-btn>
    <BondPurchase
      v-if="purchasingBond"
      :game="game"
      :current-player="controllingPlayerName"
      :profile="profile"
      :traded-in-value="tradedInValue"
      :traded-in-bond-nation="tradedInBondNation"
      @purchase-bond="purchaseBond"
      @skip="skipPurchaseBond"
      @toggle-trade-in="(bond) => $emit('toggleTradeIn', bond)"
    />
    <div v-if="destroyingFactory()">
      <div class="text-lg">
        Do you want to destroy the factory at <b>{{ factoryToDestroy }}</b>?
      </div>
      <div class="flex flex-wrap justify-evenly">
        <button
          class="rounded p-2 m-1 sm:m-4 bg-green-800 text-white cursor-pointer inline-block mt-8"
          @click="destroyFactory"
        >
          Yes
        </button>
        <button
          class="rounded p-2 m-1 sm:m-4 bg-green-800 text-white cursor-pointer inline-block mt-8"
          @click="skipDestroyFactory"
        >
          No
        </button>
      </div>
    </div>
  </v-row>
</template>

<script>
import Action from '../../Domain/action';

import AvailableBonds from './AvailableBonds.vue';
import BondPurchase from './BondPurchase.vue';
import ConflictHandler from './ConflictHandler.vue';
import TaxStatus from './TaxStatus.vue';

export default {
  name: 'ControlPanel',
  components: {
    AvailableBonds, BondPurchase, ConflictHandler, TaxStatus,
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
      && !this.game.handlingConflict
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

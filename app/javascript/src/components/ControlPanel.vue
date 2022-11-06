<template>
  <div class="flex flex-col sm:flex-row">
    <button
      v-if="canUndo()"
      class="rounded py-2 px-6 m-1 sm:m-4 bg-yellow-300 cursor-pointer self-start"
      @click="undo"
    >
      Undo
    </button>
    <div class="flex flex-wrap">
      <AvailableBonds
        v-if="!purchasingBond"
        :game="game"
      />
      <TaxStatus :game="game" />
    </div>
    <div v-if="!paused">
      <div
        v-if="game.importing
          && !chooseImportType
          && (profile.username === controllingPlayerName || (game.soloMode && hostingThisGame))"
        class="text-center inline-flex flex-col"
      >
        <button
          class="rounded py-2 px-6 m-1 sm:m-4 bg-red-500 text-white cursor-pointer"
          @click="$emit('runImport')"
        >
          End import
        </button>
        <div class="m-2">
          You have
          <b>{{ game.maxImports - importPlacements.length }}</b> imports left.
        </div>
      </div>
      <div
        v-if="game.importing
          && !!chooseImportType
          && (profile.username === controllingPlayerName || (game.soloMode && hostingThisGame))"
        class="text-center text-lg"
      >
        <button
          class="rounded p-2 m-1 sm:m-4 bg-green-800 text-white cursor-pointer"
          @click="$emit('chooseImportType', 'army')"
        >
          Army
        </button>
        <button
          class="rounded p-2 m-1 sm:m-4 bg-green-800 text-white cursor-pointer"
          @click="$emit('chooseImportType', 'fleet')"
        >
          Fleet
        </button>
        <div>Please choose if you want to import an <b>army</b> or a <b>fleet</b>.</div>
      </div>
      <button
        v-if="canEndManeuver"
        class="rounded py-2 px-6 m-1 sm:m-4 bg-red-500 text-white cursor-pointer self-start"
        @click="endManeuver"
      >
        End maneuver
      </button>
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
      <button
        v-if="game.buildingFactory
          && (profile.username === controllingPlayerName || (game.soloMode && hostingThisGame))"
        class="rounded py-2 px-6 m-1 sm:m-4 bg-green-800 text-white cursor-pointer"
        @click="$emit('skipBuildFactory')"
      >
        Skip building a factory
      </button>
      <BondPurchase
        v-if="purchasingBond"
        :game="game"
        :current_player="controllingPlayerName"
        :profile="profile"
        :traded-in-value="tradedInValue"
        @purchase-bond="purchaseBond"
        @skip="skipPurchaseBond"
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
    </div>
  </div>
</template>

<script>
import Action from '../../lib/action';

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
  },
  emits: ['runImport', 'chooseImportType', 'skipBuildFactory', 'purchaseBond', 'endManeuver', 'tick'],
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
        && Array.from(this.game.availableActions).every((action) => action.type === 'forceInvestor' || action.type === 'skipForceInvestor' || action.type === 'undo')) {
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
          return true;
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

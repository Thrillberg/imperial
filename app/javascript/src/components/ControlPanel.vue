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
      <AvailableBonds :game="game"></AvailableBonds>
      <TaxStatus :game="game"></TaxStatus>
    </div>
    <div v-if="!paused">
      <div
        v-if="game.importing && !chooseImportType && (profile.username === controllingPlayerName || (game.soloMode && profile.username in game.players))"
        class="text-center inline-flex flex-col"
      >
        <button
          @click="$emit('runImport')"
          class="rounded py-2 px-6 m-1 sm:m-4 bg-red-500 text-white cursor-pointer"
        >
          End import
        </button>
        <div class="m-2">
          You have
          <b>{{ this.game.maxImports - importPlacements.length }}</b> imports left.
        </div>
      </div>
      <div
        v-if="game.importing && !!chooseImportType && (profile.username === controllingPlayerName || (game.soloMode && profile.username in game.players))"
        class="text-center text-lg"
      >
        <button
          @click="$emit('chooseImportType', 'army')"
          class="rounded p-2 m-1 sm:m-4 bg-green-800 text-white cursor-pointer"
        >
          Army
        </button>
        <button
          @click="$emit('chooseImportType', 'fleet')"
          class="rounded p-2 m-1 sm:m-4 bg-green-800 text-white cursor-pointer"
        >
          Fleet
        </button>
        <div>Please choose if you want to import an <b>army</b> or a <b>fleet</b>.</div>
      </div>
      <button
        v-if="canEndManeuver"
        v-on:click="endManeuver"
        class="rounded py-2 px-6 m-1 sm:m-4 bg-red-500 text-white cursor-pointer self-start"
      >
        End maneuver
      </button>
      <ConflictHandler :game="game" :profile="profile" :controllingPlayerName="controllingPlayerName" v-on:tick-with-action="tickWithAction"></ConflictHandler>
      <div class="text-center" v-if="canForceInvestor">
        <button @click="forceInvestor" class="rounded p-2 m-1 sm:m-4 bg-green-800 text-white cursor-pointer">
          Force investor
        </button>
        <button @click="skipForceInvestor" class="rounded p-2 m-1 sm:m-4 bg-green-800 text-white cursor-pointer">
          Do not force investor
        </button>
      </div>
      <div class="text-center" v-if="canBlockCanal">
        <button @click="blockCanal" class="rounded p-2 m-1 sm:m-4 bg-green-800 text-white cursor-pointer">
          Block canal
        </button>
        <button @click="unblockCanal" class="rounded p-2 m-1 sm:m-4 bg-green-800 text-white cursor-pointer">
          Do not block canal
        </button>
      </div>
      <button
        v-if="game.buildingFactory && (profile.username === controllingPlayerName || (game.soloMode && profile.username in game.players))"
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
        :tradedInValue="tradedInValue"
        @purchaseBond="purchaseBond"
        @skip="this.skipPurchaseBond"
      ></BondPurchase>
      <div v-if="destroyingFactory">
        <div class="text-lg">Do you want to destroy the factory at <b>{{ this.factoryToDestroy }}</b>?</div>
        <div class="flex flex-wrap justify-evenly">
          <button @click="destroyFactory" class="rounded p-2 m-1 sm:m-4 bg-green-800 text-white cursor-pointer inline-block mt-8">
            Yes
          </button>
          <button @click="skipDestroyFactory" class="rounded p-2 m-1 sm:m-4 bg-green-800 text-white cursor-pointer inline-block mt-8">
            No
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Action from "../../lib/action.js";

import AvailableBonds from "../components/AvailableBonds.vue";
import BondPurchase from "../components/BondPurchase.vue";
import ConflictHandler from "../components/ConflictHandler.vue";
import TaxStatus from "../components/TaxStatus.vue";

export default {
  name: "ControlPanel",
  components: { AvailableBonds, BondPurchase, ConflictHandler, TaxStatus },
  props: [
    "game",
    "chooseImportType",
    "controllingPlayerName",
    "paused",
    "profile",
    "importPlacements",
    "gameData",
    "tradedInBondNation",
    "tradedInValue",
  ],
  computed: {
    purchasingBond() {
      const purchasingBond = this.game.availableActions.size > 0 &&
        Array.from(this.game.availableActions).every(
          (action) => action.type === "bondPurchase" || action.type === "skipBondPurchase" || action.type === "undo"
        );
      return purchasingBond && (this.profile.username === this.controllingPlayerName || (this.game.soloMode && this.profile.username in this.game.players));
    },
    canForceInvestor: function () {
      if (this.game.availableActions.size > 0 &&
        Array.from(this.game.availableActions).every((action) => action.type === "forceInvestor" || action.type === "skipForceInvestor" || action.type === "undo")) {
          if (this.game.swissBanks.includes(this.profile.username) || (this.game.soloMode && this.profile.username in this.game.players)) {
            return true;
          }
      }
      return false;
    },
    canBlockCanal: function () {
      if (
        Array.from(this.game.availableActions).every(
          (action) => action.type === "blockCanal" ||
            action.type === "unblockCanal" ||
            action.type === "undo"
        )
      ) {
        if (
          this.profile.username === this.currentPlayerName ||
          this.game.soloMode && this.profile.username in this.game.players
        ) {
          return true;
        }
      }
      return false;
    },
    canEndManeuver() {
      return this.game.maneuvering &&
      this.factoryToDestroy === "" &&
      !this.game.handlingConflict &&
      (
        this.profile.username === this.controllingPlayerName ||
          (this.game.soloMode && this.profile.username in this.game.players)
      )
    }
  },
  data() {
    return { factoryToDestroy: "" }
  },
  methods: {
    purchaseBond(bond) {
      this.$emit("purchaseBond", bond);
    },
    skipPurchaseBond() {
      for (const action of this.game.availableActions) {
        if (action.type === "skipBondPurchase") {
          this.tickWithAction(action);
        }
      }
    },
    endManeuver: function() {
      this.$emit("endManeuver", Action.endManeuver());
    },
    tickWithAction: function(action) {
      this.$emit("tick", action);
    },
    destroyingFactory: function () {
      if (
        this.profile.username !== this.controllingPlayerName &&
        !(this.game.soloMode && this.profile.username in this.game.players)
      ) {
        return false
      }

      let destroyingFactory = false;
      for (const action of this.game.availableActions) {
        if (action.type === "destroyFactory" || action.type === "skipDestroyFactory") {
          destroyingFactory = true;
          this.factoryToDestroy = action.payload.province;
        }
      }
      return destroyingFactory
    },
    destroyFactory: function() {
      let destroyAction = {};
      for (const action of this.game.availableActions) {
        if (action.type === "destroyFactory") {
          destroyAction = action;
        }
      }
      this.tickWithAction(destroyAction);
      this.factoryToDestroy = "";
    },
    skipDestroyFactory: function() {
      let skipAction = {};
      for (const action of this.game.availableActions) {
        if (action.type === "skipDestroyFactory") {
          skipAction = action;
        }
      }
      this.tickWithAction(skipAction);
    },
    canUndo() {
      if (this.paused) return false;

      let canUndo = false;
      for (const action of this.game.availableActionsWithUndo()) {
        if (
          this.game.log.length > 1 && action.type === "undo" && (
            action.payload.player === this.profile.username ||
            (this.game.soloMode && Object.keys(this.game.players).includes(this.profile.username))
          )
        ) {
          canUndo = true;
        }
      }
      return canUndo;
    },
    undo() {
      for (const action of this.game.availableActionsWithUndo()) {
        if (
          action.type === "undo" && (
            action.payload.player === this.profile.username || this.game.soloMode
          )
        ) {
          this.tickWithAction(action);
        }
      }
    },
    forceInvestor() {
      for (const action of this.game.availableActions) {
        if (action.type === "forceInvestor") {
          this.tickWithAction(action);
        }
      }
    },
    skipForceInvestor() {
      for (const action of this.game.availableActions) {
        if (action.type === "skipForceInvestor") {
          this.tickWithAction(action);
        }
      }
    },
    blockCanal() {
      for (const action of this.game.availableActions) {
        if (action.type === "blockCanal") {
          this.tickWithAction(action);
        }
      }
    },
    unblockCanal() {
      for (const action of this.game.availableActions) {
        if (action.type === "unblockCanal") {
          this.tickWithAction(action);
        }
      }
    },
  }
};
</script>

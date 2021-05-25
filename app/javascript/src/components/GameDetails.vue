<template>
  <div class="flex flex-col">
    <TaxChart v-if="show_tax_chart" :taxes="taxes()" />
    <div class="flex flex-wrap justify-evenly">
      <Player
        v-for="player in players()"
        v-on:toggleTradeIn="toggleTradeIn"
        :player="player"
        :current_player="controllingPlayerName"
        :game="game"
        :profile="profile"
        :online_users="online_users"
        :purchasingBond="purchasingBond"
        :tradedInBondNation="tradedInBondNation"
        :tradedInValue="tradedInValue"
        :key="player.name"
      ></Player>
    </div>
    <button
      v-if="canUndo()"
      class="rounded py-2 px-6 my-4 bg-green-800 text-white cursor-pointer"
      @click="undo"
    >
      Undo
    </button>
    <BondPurchase
      v-if="purchasingBond"
      :game="game"
      :current_player="controllingPlayerName"
      :profile="profile"
      :tradedInValue="tradedInValue"
      v-on:purchaseBond="purchaseBond"
      v-on:skip="this.skipPurchaseBond"
    ></BondPurchase>
    <div v-if="destroyingFactory">
      <div class="text-lg">Do you want to destroy the factory at <b>{{ this.game.log[this.game.log.length - 1].payload.destination }}</b>?</div>
      <div class="flex flex-wrap justify-evenly">
        <div @click="destroyFactory" class="rounded p-2 bg-green-800 text-white cursor-pointer inline-block mt-8">
          Yes
        </div>
        <div @click="skipDestroyFactory" class="rounded p-2 bg-green-800 text-white cursor-pointer inline-block mt-8">
          No
        </div>
      </div>
    </div>
    <div v-else>
      <Rondel
        v-bind:game="game"
        v-bind:name="profile.username"
        v-on:tick-with-action="tickWithAction"
      ></Rondel>
    </div>
    <div
      v-if="game.importing && !chooseImportType && (profile.username === controllingPlayerName || (game.soloMode && profile.username in game.players))"
      class="text-center text-lg"
    >
      <div>
        You have
        <b>{{ this.game.maxImports - importPlacements.length }}</b> imports left.
      </div>
      <div
        @click="$emit('runImport')"
        class="rounded p-2 bg-green-800 text-white cursor-pointer"
      >
        End import
      </div>
    </div>
    <div
      v-if="game.importing && !!chooseImportType && (profile.username === controllingPlayerName || (game.soloMode && profile.username in game.players))"
      class="text-center text-lg"
    >
      <div>Please choose if you want to import an <b>army</b> or a <b>fleet</b>.</div>
      <div
        @click="$emit('chooseImportType', 'army')"
        class="rounded p-2 bg-green-800 text-white cursor-pointer"
      >
        Army
      </div>
      <div
        @click="$emit('chooseImportType', 'fleet')"
        class="rounded p-2 bg-green-800 text-white cursor-pointer"
      >
        Fleet
      </div>
    </div>
    <div
      v-if="game.maneuvering && !destroyingFactory && !game.handlingConflict && (profile.username === controllingPlayerName || (game.soloMode && profile.username in game.players))"
      class="text-center text-lg"
    >
      <div
        v-on:click="endManeuver"
        class="rounded p-2 bg-green-800 text-white cursor-pointer"
      >
        End maneuver
      </div>
    </div>
    <ConflictHandler :game="game" :profile="profile" :controllingPlayerName="controllingPlayerName" v-on:tick-with-action="tickWithAction"></ConflictHandler>
    <div class="text-center" v-if="canForceInvestor">
      <button @click="forceInvestor" class="rounded p-2 bg-green-800 text-white cursor-pointer">
        Force investor
      </button>
      <button @click="skipForceInvestor" class="rounded p-2 bg-green-800 text-white cursor-pointer">
        Do not force investor
      </button>
    </div>
    <button
      v-if="game.buildingFactory && (profile.username === controllingPlayerName || (game.soloMode && profile.username in game.players))"
      class="rounded py-2 px-6 my-4 bg-green-800 text-white cursor-pointer"
      @click="$emit('skipBuildFactory')"
    >
      Skip building a factory
    </button>
  </div>
</template>

<script>
import Action from "../../lib/action.js";
import BondPurchase from "../components/BondPurchase.vue";
import ConflictHandler from "../components/ConflictHandler.vue";
import Player from "../components/Player.vue";
import Rondel from "../components/Rondel.vue";
import TaxChart from "../components/TaxChart.vue";

export default {
  name: "GameDetails",
  components: {
    BondPurchase,
    ConflictHandler,
    Player,
    Rondel,
    TaxChart
  },
  props: ["game", "chooseImportType", "controllingPlayerName", "profile", "importPlacements", "online_users", "show_tax_chart", "gameData"],
  computed: {
    purchasingBond() {
      const purchasingBond = this.game.availableActions.size > 0 &&
        Array.from(this.game.availableActions).every(
          (action) => action.type === "bondPurchase" || action.type === "skipBondPurchase" || action.type === "undo"
        );
      return purchasingBond && (this.profile.username === this.controllingPlayerName || (this.game.soloMode && this.profile.username in this.game.players));
    },
    destroyingFactory: function () {
      const destroyingFactory = this.game.availableActions.size > 0 &&
        Array.from(this.game.availableActions).every(
          (action) => action.type === "destroyFactory" || action.type === "skipDestroyFactory"
        );
      return destroyingFactory && (this.profile.username === this.controllingPlayerName || (this.game.soloMode && this.profile.username in this.game.players));
    },
    canForceInvestor: function () {
      if (this.game.availableActions.size > 0 &&
        Array.from(this.game.availableActions).every((action) => action.type === "forceInvestor" || action.type === "skipForceInvestor" || action.type === "undo")) {
          if (this.game.swissBanks.includes(this.profile.username) || (this.game.soloMode && this.profile.username in this.game.players)) {
            return true;
          }
      }
      return false;
    }
  },
  data() {
    return {
      tradedInBondNation: "",
      tradedInValue: 0
    }
  },
  methods: {
    players() {
      let players = {};
      for (const name in this.game.players) {
        this.gameData.players.forEach(dataPlayer => {
          if (name === dataPlayer.name) {
            players[name] = Object.assign(
              {},
              this.game.players[name],
              {id: dataPlayer.id}
            );
          }
        });
        if (!players[name]) {
          // Computer player
          players[name] = this.game.players[name];
        }
      }
      return players;
    },
    powerPoints() {
      return [...Array(26).keys()].map(slot => {
        let nations = [];
        for (const [nation, data] of this.game.nations) {
          if (data.powerPoints === slot) {
            nations.push(nation.value);
          }
        }
        return { slot, nations };
      });
    },
    taxes() {
      return [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5].map(slot => {
        let nations = [];
        for (const [nation, data] of this.game.nations) {
          if (data.taxChartPosition === slot) {
            nations.push(nation.value);
          }
        }
        return { slot, nations };
      });
    },
    tickWithAction: function(action) {
      this.$emit("tick", action);
    },
    purchaseBond(bond) {
      for (const action of this.game.availableActions) {
        if (
          bond.cost === action.payload.cost &&
          bond.nation.value === action.payload.nation.value &&
          action.payload.tradeInValue === this.tradedInValue
        ) {
          this.tickWithAction(action);
          this.tradedInValue = 0;
        }
      }
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
    destroyFactory: function() {
      let destroyAction = {};
      for (const action of this.game.availableActions) {
        if (action.type === "destroyFactory") {
          destroyAction = action;
        }
      }
      this.tickWithAction(destroyAction);
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
    toggleTradeIn(bond) {
      if (this.tradedInValue > 0) {
        this.tradedInBondNationValue = "";
        this.tradedInValue = 0;
      } else {
        this.tradedInBondNation = bond.nation.value;
        this.tradedInValue = bond.cost;
      }
    }
  }
};
</script>

<template>
  <div class="flex flex-col text-sm">
    <div class="flex flex-wrap justify-evenly">
      <Player
        v-for="player in game.players"
        v-bind:player="player"
        v-bind:current_player="controllingPlayerName"
        v-bind:game="game"
        v-bind:profile="profile"
        v-bind:key="player.name"
      ></Player>
    </div>
    <div class="flex flex-wrap justify-evenly p-4 border border-gray-500 rounded">
      <NationComponent
        v-for="[nation] of game.nations"
        :current_nation="game.currentNation === nation ? 'current_nation' : ''"
        :nation="nation.value"
        :treasury="game.nations.get(nation).treasury"
        :power_points="game.nations.get(nation).powerPoints"
        :tax_chart_position="game.nations.get(nation).taxChartPosition"
        :is_controller="game.nations.get(nation).controller === profile.username"
        :key="nation.value"
      ></NationComponent>
    </div>
    <div v-if="purchasingBond">
      <div class="text-lg">Purchase a bond</div>
      <div class="flex flex-wrap">
        <div v-for="action of game.availableActions">
          <Bond
            v-if="action.type === 'bondPurchase'"
            :bond="getBond(action)"
            :tradedBond="tradedBond(action.payload)"
            @click.native="tickWithAction(action)"
            class="cursor-pointer"
          />
        </div>
      </div>
      <div @click="skipBondPurchase" class="rounded p-2 bg-green-800 text-white cursor-pointer inline-block mt-8">
        Do not buy a bond
      </div>
    </div>
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
      v-if="game.importing && (profile.username === controllingPlayerName || (game.soloMode && profile.username in game.players))"
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
      v-if="game.maneuvering && !destroyingFactory && (profile.username === controllingPlayerName || (game.soloMode && profile.username in game.players))"
      class="text-center text-lg"
    >
      <div
        v-on:click="endManeuver"
        class="rounded p-2 bg-green-800 text-white cursor-pointer"
      >
        End maneuver
      </div>
    </div>
    <div
      v-if="game.handlingConflict && (profile.username === controllingPlayerName || (game.soloMode && profile.username in game.players))"
      class="text-center text-lg"
    >
      <div
        v-on:click="coexist"
        class="rounded p-2 bg-green-800 text-white cursor-pointer"
      >
        Coexist
      </div>
      <div
        v-on:click="fight"
        class="rounded p-2 bg-green-800 text-white cursor-pointer"
      >
        Fight
      </div>
    </div>
    <div class="buttons" v-if="canForceInvestor">
      <ActionComponent
        v-for="action in game.availableActions"
        v-bind:key="JSON.stringify(action)"
        v-bind:action="action"
        v-bind:text="actionToText(action)"
        v-bind:dispatch="tickWithAction"
      ></ActionComponent>
    </div>
  </div>
</template>

<script>
import Action from "../../lib/action.js";
import ActionComponent from "../components/ActionComponent.vue";
import Bond from "../components/Bond.vue";
import NationComponent from "../components/NationComponent.vue";
import Player from "../components/Player.vue";
import Rondel from "../components/Rondel.vue";

export default {
  name: "GameDetails",
  components: {
    ActionComponent,
    Bond,
    NationComponent,
    Player,
    Rondel
  },
  props: ["game", "controllingPlayerName", "profile", "importPlacements"],
  computed: {
    purchasingBond: function () {
      const purchasingBond = this.game.availableActions.size > 0 &&
        Array.from(this.game.availableActions).every(
          (action) => action.type === "bondPurchase" || action.type === "skipBondPurchase"
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
        Array.from(this.game.availableActions).every((action) => action.type === "forceInvestor" || action.type === "skipForceInvestor")) {
          this.controllingPlayerName = "";
          if (this.game.swissBanks.includes(this.profile.username) || (this.game.soloMode && this.profile.username in this.game.players)) {
            return true;
          }
      }
    }
  },
  methods: {
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
    actionToText: function(action) {
      if (action.type === "bondPurchase") {
        return `Purchase a ${action.payload.nation.value} bond for ${action.payload.cost}`;
      } else if (action.type === "coexist") {
        return `Coexist`;
      } else if (action.type === "fight") {
        return `Fight`;
      } else if (action.type === "forceInvestor") {
        return "Force investor";
      } else if (action.type === "skipForceInvestor") {
        return "Do not force investor";
      }
    },
    endManeuver: function() {
      this.$emit("endManeuver", Action.endManeuver());
    },
    skipBondPurchase: function() {
      let skipAction = {};
      for (const action of this.game.availableActions) {
        if (action.type === "skipBondPurchase") {
          skipAction = action;
        }
      }
      this.tickWithAction(skipAction);
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
    coexist: function() {
      let coexistAction = {};
      for (const action of this.game.availableActions) {
        if (action.type === "coexist") {
          coexistAction = action;
        }
      }
      this.tickWithAction(coexistAction);
    },
    fight: function() {
      let fightAction = {};
      for (const action of this.game.availableActions) {
        if (action.type === "fight") {
          fightAction = action;
        }
      }
      this.tickWithAction(fightAction);
    },
    getBond: function(action) {
      let fetchedBond = {};
      for (const bond of this.game.availableBonds) {
        if (bond.cost === action.payload.cost && bond.nation === action.payload.nation) {
          fetchedBond = bond;
        }
      }
      return fetchedBond;
    },
    tradedBond: function({cost, nation, player}) {
      const playerObj = this.game.players[player];
      if (playerObj.cash < cost) {
        let topBond = {cost: 0};
        for (const bond of playerObj.bonds) {
          if (bond.nation === nation) {
            if (bond.cost > topBond.cost) {
              topBond = bond;
            }
          }
        }
        return topBond;
      }
    }
  }
};
</script>

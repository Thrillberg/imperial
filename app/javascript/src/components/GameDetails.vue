<template>
  <div class="flex flex-col">
    <div class="flex justify-evenly">
      <Player
        v-for="player in game.players"
        v-bind:player="player"
        v-bind:current_player="controllingPlayerName"
        v-bind:game="game"
        v-bind:key="player.name"
      ></Player>
    </div>
    <div class="flex justify-evenly p-4 border border-gray-500 rounded">
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
    <Rondel
      v-bind:game="game"
      v-bind:name="profile.username"
      v-on:tick-with-action="tickWithAction"
    ></Rondel>
    <div
      v-if="game.importing && (profile.username === controllingPlayerName || game.soloMode)"
      class="text-center text-lg"
    >
      <div>
        You have
        <b>{{ 3 - importPlacements.length }}</b> imports left.
      </div>
      <div
        @click="$emit('runImport')"
        class="rounded p-2 bg-green-800 text-white cursor-pointer"
      >
        End import
      </div>
    </div>
    <div
      v-if="game.maneuvering && (profile.username === controllingPlayerName || game.soloMode)"
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
      v-if="game.handlingConflict && (profile.username === controllingPlayerName || game.soloMode)"
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
    <div class="buttons" v-if="purchasingBond || canForceInvestor">
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
import NationComponent from "../components/NationComponent.vue";
import Player from "../components/Player.vue";
import Rondel from "../components/Rondel.vue";

export default {
  name: "GameDetails",
  components: {
    ActionComponent,
    NationComponent,
    Player,
    Rondel
  },
  props: ["game", "controllingPlayerName", "profile", "importPlacements"],
  computed: {
    purchasingBond: function () {
      return Array.from(this.game.availableActions).every((action) => action.type === "bondPurchase") && (this.profile.username === this.controllingPlayerName || this.game.soloMode);
    },
    canForceInvestor: function () {
      if (Array.from(this.game.availableActions).every((action) => action.type === "forceInvestor" || action.type === "skipForceInvestor")) {
        this.controllingPlayerName = "";
        if (this.game.swissBanks.includes(this.profile.username) || this.game.soloMode) {
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
    }
  }
};
</script>

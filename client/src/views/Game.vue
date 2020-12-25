<template>
  <div>
    <router-link to="/">Back</router-link>
    <div v-if="gameStarted" class="flex justify-between">
      <div class="w-1/2 border border-gray-500 rounded">
        <Board
          :game="game"
          :gameStarted="gameStarted"
          :select_province="selectProvince"
          :valid_provinces="validProvinces()"
          :importing_units="importPlacements"
        ></Board>
      </div>
      <div class="w-1/2 mx-2 border border-gray-500 rounded">
        <div class="flex justify-center bg-green-100 py-4">
          <span
            class="p-2 border border-gray500 border-r-0 rounded-l cursor-pointer"
            :class="[
              onActions ? 'bg-gray-700' : 'bg-white',
              onActions ? 'text-white' : 'text-black'
            ]"
            v-on:click="viewActions"
          >
            Actions
          </span>
          <span
            class="p-2 border border-gray500 border-l-0 rounded-r cursor-pointer"
            :class="[
              onGameDetails ? 'bg-gray-700' : 'bg-white',
              onGameDetails ? 'text-white' : 'text-black'
            ]"
            v-on:click="viewGameDetails"
          >
            Game Details
          </span>
        </div>
        <div class="flex justify-around">
          <div v-if="onActions">
            <div class="my-8">
              <div class="text-center text-2xl">
                <b>{{ stringify(game.currentNation.value) }}'s</b> turn
              </div>
              <Flag
                :height="(80).toString()"
                :width="(120).toString()"
                :nation="game.currentNation.value"
                class="mx-auto"
                :class="
                  username === controllingPlayerName ? 'current_nation' : ''
                "
              />
            </div>
            <Rondel
              v-bind:game="game"
              v-bind:name="username"
              v-on:tick-with-action="tickWithAction"
            ></Rondel>
            <div class="text-center text-lg mt-8">
              You have <b>{{ this.currentPlayer.cash }}m</b> in cash.
            </div>
            <div
              v-if="game.importing && username === controllingPlayerName"
              class="text-center text-lg"
            >
              <div>
                You have
                <b>{{ 3 - this.importPlacements.length }}</b> imports left.
              </div>
              <div
                v-on:click="runImport"
                class="rounded p-2 bg-green-800 text-white cursor-pointer"
              >
                End import
              </div>
            </div>
            <div
              v-if="game.maneuvering && username === controllingPlayerName"
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
              v-if="game.handlingConflict && username === controllingPlayerName"
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
          </div>
          <div v-else>
            <GameDetails
              :game="game"
              :controllingPlayerName="controllingPlayerName"
            />
          </div>
        </div>
      </div>
      <div class="buttons" v-if="purchasingBond">
        <ActionComponent
          v-for="action in game.availableActions"
          v-bind:key="JSON.stringify(action)"
          v-bind:action="action"
          v-bind:text="actionToText(action)"
          v-bind:dispatch="tickWithAction"
        ></ActionComponent>
      </div>
    </div>
    <div v-else class="flex justify-between">
      <div class="w-1/2 border border-gray-500 rounded">
        <Board
          v-bind:game="game"
          v-bind:select_province="() => {}"
          v-bind:valid_provinces="[]"
        ></Board>
      </div>
      <div class="w-1/2 mx-2 border border-gray-500 rounded">
        <div class="text-2xl">
          Game not yet started!
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Action from "../../lib/action.js";
import Imperial from "../../lib/imperial.js";
import { Nation } from "../../lib/constants.js";
import { apiClient } from "../router/index.js";

import ActionComponent from "@/components/ActionComponent.vue";
import Board from "@/components/board/Board.vue";
import Flag from "@/components/flags/Flag.vue";
import GameDetails from "@/components/GameDetails.vue";
import Rondel from "@/components/Rondel.vue";

import stringify from "../stringify.js";

export default {
  name: "Game",
  components: {
    ActionComponent,
    Board,
    Flag,
    GameDetails,
    Rondel
  },
  props: ["username", "users", "games"],
  data: () => {
    return {
      controllingPlayerName: "",
      currentPlayer: {},
      game: {},
      gameStarted: false,
      importPlacements: [],
      maneuverOrigin: "",
      onActions: true,
      onGameDetails: false,
      purchasingBond: false
    };
  },
  beforeDestroy() {
    apiClient.clearHandlers();
  },
  mounted() {
    apiClient.onUpdateGameLog(({ gameId, log }) => {
      if (gameId === this.$route.params.id) {
        const rawLog = JSON.parse(log);
        // The following map only exists because of our custom Nation type, which
        // has weirdness when we attempt nation.when() in the setup file.
        const gameLog = rawLog.map(rawAction => {
          const action = JSON.parse(rawAction);
          if (action.type === "initialize") {
            action.payload.players = action.payload.players.map(player => {
              return {
                id: player.id,
                nation: Nation[player.nation.value]
              };
            });
          } else if (
            action.type === "rondel" ||
            action.type === "bondPurchase"
          ) {
            action.payload.nation = Nation[action.payload.nation.value];
          } else if (action.type === "fight" || action.type === "coexist") {
            action.payload.incumbent = Nation[action.payload.incumbent.value];
            action.payload.challenger = Nation[action.payload.challenger.value];
          }
          return action;
        });
        this.game = Imperial.fromLog(gameLog);
        if (this.game.players) {
          this.gameStarted = true;
          this.currentPlayer = this.game.players[this.username];
          this.controllingPlayerName = this.game.currentPlayerName;
        }
      }
    });
    apiClient.getGameLog(this.$route.params.id);
  },
  methods: {
    stringify(nation) {
      return stringify(nation);
    },
    viewActions() {
      this.onActions = true;
      this.onGameDetails = false;
    },
    viewGameDetails() {
      this.onGameDetails = true;
      this.onActions = false;
    },
    validProvinces() {
      // This function returns all provinces that a unit can move
      // or be imported to.
      let provinces = new Set();
      for (const action of this.game.availableActions) {
        if (action.type === "maneuver" && this.game.maneuvering) {
          if (this.maneuverOrigin) {
            provinces.add(action.payload.destination);
          } else {
            provinces.add(action.payload.origin);
          }
        } else if (action.type === "import" && this.game.importing) {
          action.payload.placements.forEach(placement => {
            provinces.add(placement.province);
          });
        } else if (
          action.type === "buildFactory" &&
          this.game.buildingFactory
        ) {
          provinces.add(action.payload.province);
        }
      }
      return Array.from(provinces);
    },
    selectProvince(province) {
      // If the game is in a maneuver and an origin is specified,
      // then the next specified province is the destination
      if (this.game.maneuvering && this.maneuverOrigin) {
        const maneuver = Action.maneuver({
          origin: this.maneuverOrigin,
          destination: province
        });
        // Reset maneuverStatus
        this.maneuverOrigin = "";
        this.tickWithAction(maneuver);
        // If the game is in a maneuver with no origin specified,
        // then the next specified province is the origin
      } else if (this.game.maneuvering) {
        this.maneuverOrigin = province;
        // If the game is in an import, then each specified province
        // gets added to the placements.
      } else if (this.game.importing) {
        this.importPlacements.push(province);
        if (this.importPlacements.length === 3) {
          this.runImport();
        }
      } else if (this.game.buildingFactory) {
        let factory = {};
        for (const action of this.game.availableActions) {
          if (action.payload.province === province) {
            factory = action;
          }
        }
        this.tickWithAction(factory);
      }
    },
    tickWithAction: function(action) {
      this.controllingPlayerName = this.game.currentPlayerName;
      apiClient.tick(this.$route.params.id, action);
      if (action.type == "rondel") {
        switch (action.payload.slot) {
          case "investor":
            if (this.game.investorCardActive) {
              this.controllingPlayerName = this.game.investorCardHolder;
            }
            this.purchasingBond = true;
            break;
        }
      }
      if (action.type === "bondPurchase") {
        this.purchasingBond = false;
      }
    },
    actionToText: function(action) {
      if (action.type === "bondPurchase") {
        return `Purchase a ${action.payload.nation.value} bond for ${action.payload.cost}`;
      } else if (action.type === "coexist") {
        return `Coexist`;
      } else if (action.type === "fight") {
        return `Fight`;
      }
    },
    runImport: function() {
      // TODO: Allow imports of fleets too.
      const placements = this.importPlacements.map(placement => {
        return { province: placement, type: "army" };
      });
      this.tickWithAction(Action.import({ placements }));
      this.importPlacements = [];
      return;
    },
    endManeuver: function() {
      this.tickWithAction(Action.endManeuver());
      this.maneuverOrigin = "";
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

<style scoped>
.current_nation {
  box-shadow: 0 0 2rem 0.5rem #ffd700;
}
</style>

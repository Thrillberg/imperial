<template>
  <div class="flex flex-col">
    <TaxChart :showBonus="game.baseGame === 'imperial2030'" :taxes="taxes()" />
    <div class="flex flex-wrap justify-evenly">
      <Player
        v-for="(player, index) of players()"
        @toggleTradeIn="toggleTradeIn"
        :player="player"
        :current_player="controllingPlayerName"
        :game="game"
        :profile="profile"
        :online_users="online_users"
        :purchasingBond="purchasingBond"
        :tradedInBondNation="tradedInBondNation"
        :tradedInValue="tradedInValue"
        :index="game.winner ? index + 1 : null"
        :turnIndex="index + 1"
        :key="player.name"
      ></Player>
    </div>
    <div v-if="!game.winner">
      <Rondel
        :game="game"
        :name="profile.username"
        :paused="paused"
        @tick-with-action="tickWithAction"
      ></Rondel>
    </div>
  </div>
</template>

<script>
import Player from "../components/Player.vue";
import Rondel from "../components/Rondel.vue";
import TaxChart from "../components/TaxChart.vue";

export default {
  name: "GameDetails",
  components: {
    Player,
    Rondel,
    TaxChart
  },
  props: [
    "game",
    "controllingPlayerName",
    "paused",
    "profile",
    "online_users",
    "gameData",
  ],
  computed: {
    purchasingBond() {
      if (this.paused) return false;

      const purchasingBond = this.game.availableActions.size > 0 &&
        Array.from(this.game.availableActions).every(
          (action) => action.type === "bondPurchase" || action.type === "skipBondPurchase" || action.type === "undo"
        );
      return purchasingBond && (this.profile.username === this.controllingPlayerName || (this.game.soloMode && this.profile.username in this.game.players));
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
      if (this.game.winner) {
        return Object.values(players).sort((a, b) => {
          return a.cash + a.rawScore < b.cash + b.rawScore;
        });
      } else {
        return Object.values(players);
      }
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
      if (this.game.baseGame === "imperial") {
        return [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5].map(slot => {
          let nations = [];
          for (const [nation, data] of this.game.nations) {
            if (data.taxChartPosition === slot) {
              nations.push(nation.value);
            }
          }
          const powerPointIncrease = slot - 5;
          return { slot, nations, powerPointIncrease };
        });
      } else if (this.game.baseGame === "imperial2030") {
        const taxes = [18, 16, 15, 14, 13, 12, 11, 10, 8, 6, 5]
        return taxes.map((slot, index) => {
          let nations = [];
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
          }
          return { slot, nations, powerPointIncrease, bonus };
        });
      }
    },
    tickWithAction: function(action) {
      this.$emit("tick", action);
    },
    toggleTradeIn(bond) {
      this.$emit("toggleTradeIn", bond);
    }
  }
};
</script>

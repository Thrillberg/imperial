<template>
  <div class="flex flex-col">
    <TaxChart v-if="show_tax_chart" :taxes="taxes()" />
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
        :key="player.name"
      ></Player>
    </div>
    <div v-if="!game.winner">
      <Rondel
        :game="game"
        :name="profile.username"
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
  props: ["game", "controllingPlayerName", "profile", "online_users", "show_tax_chart", "gameData"],
  computed: {
    purchasingBond() {
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
    toggleTradeIn(bond) {
      this.$emit("toggleTradeIn", bond);
    }
  }
};
</script>

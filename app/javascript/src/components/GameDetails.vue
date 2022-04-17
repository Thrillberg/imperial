<template>
  <div class="flex flex-col">
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
  </div>
</template>

<script>
import Player from "../components/Player.vue";

export default {
  name: "GameDetails",
  components: {
    Player,
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
    tickWithAction: function(action) {
      this.$emit("tick", action);
    },
    toggleTradeIn(bond) {
      this.$emit("toggleTradeIn", bond);
    }
  }
};
</script>

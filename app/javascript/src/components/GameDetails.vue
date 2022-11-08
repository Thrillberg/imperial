<template>
  <div class="flex flex-col">
    <div class="flex flex-wrap justify-evenly">
      <Player
        v-for="(player, index) of players()"
        :key="player.name"
        :player="player"
        :current-player="controllingPlayerName"
        :game="game"
        :profile="profile"
        :online-users="online_users"
        :purchasing-bond="purchasingBond"
        :traded-in-bond-nation="tradedInBondNation"
        :traded-in-value="tradedInValue"
        :index="game.winner ? index + 1 : null"
        :turn-index="index + 1"
        @toggleTradeIn="toggleTradeIn"
      />
    </div>
  </div>
</template>

<script>
import Player from './Player.vue';

export default {
  name: 'GameDetails',
  components: {
    Player,
  },
  props: [
    'game',
    'controllingPlayerName',
    'paused',
    'profile',
    'online_users',
    'gameData',
    'hostingThisGame',
  ],
  data() {
    return {
      tradedInBondNation: '',
      tradedInValue: 0,
    };
  },
  computed: {
    purchasingBond() {
      if (this.paused) return false;

      const purchasingBond = this.game.availableActions.size > 0
        && Array.from(this.game.availableActions).every(
          (action) => action.type === 'bondPurchase' || action.type === 'skipBondPurchase' || action.type === 'undo',
        );
      return purchasingBond && (this.profile.username === this.controllingPlayerName || (this.game.soloMode && this.hostingThisGame));
    },
  },
  methods: {
    players() {
      const players = {};
      for (const name in this.game.players) {
        this.gameData.players.forEach((dataPlayer) => {
          if (name === dataPlayer.name) {
            players[name] = {

              ...this.game.players[name],
              id: dataPlayer.id,
            };
          }
        });
        if (!players[name]) {
          // Computer player
          players[name] = this.game.players[name];
        }
      }
      if (this.game.winner) {
        return Object.values(players).sort((a, b) => a.cash + a.rawScore < b.cash + b.rawScore);
      }
      return Object.values(players);
    },
    powerPoints() {
      return [...Array(26).keys()].map((slot) => {
        const nations = [];
        for (const [nation, data] of this.game.nations) {
          if (data.powerPoints === slot) {
            nations.push(nation.value);
          }
        }
        return { slot, nations };
      });
    },
    tickWithAction(action) {
      this.$emit('tick', action);
    },
    toggleTradeIn(bond) {
      this.$emit('toggleTradeIn', bond);
    },
  },
};
</script>

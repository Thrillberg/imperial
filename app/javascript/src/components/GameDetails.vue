<template>
  <Player
    v-for="(player, index) of sortedPlayers"
    :key="player.name"
    :player="player"
    :current-player="controllingPlayerName"
    :game="game"
    :profile="profile"
    :online-users="onlineUsers"
    :purchasing-bond="purchasingBond"
    :traded-in-bond-nation="tradedInBondNation"
    :traded-in-value="tradedInValue"
    :index="game.winner ? index + 1 : null"
    :turn-index="index + 1"
    :is-human="gameData.players.map(p => p.name).includes(player.name)"
    @toggle-trade-in="toggleTradeIn"
  />
</template>

<script>
import Player from './Player.vue';

export default {
  name: 'GameDetails',
  components: {
    Player,
  },
  props: {
    game: { type: Object, default: () => {} },
    controllingPlayerName: { type: String, default: '' },
    paused: { type: Boolean, default: false },
    profile: { type: Object, default: () => {} },
    onlineUsers: { type: Array, default: () => [] },
    gameData: { type: Object, default: () => {} },
    hostingThisGame: { type: Boolean, default: false },
  },
  emits: ['tick', 'toggleTradeIn'],
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
      return purchasingBond
        && (this.profile.username === this.controllingPlayerName || (this.game.soloMode && this.hostingThisGame));
    },
    sortedPlayers() {
      if (this.game.winner === '') {
        return this.players();
      }

      return this.players().sort((a, b) => (b.rawScore + b.cash) - (a.rawScore + a.cash));
    },
  },
  methods: {
    players() {
      const players = {};
      for (const name in this.game.players) {
        players[name] = this.game.players[name];
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

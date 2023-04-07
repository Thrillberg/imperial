<template>
  <v-row
    v-if="game.winner && !paused"
    dense
    color="primary"
  >
    <v-col>
      <b>Game over!</b> {{ game.winner }} won the game.
    </v-col>
  </v-row>
  <v-row
    v-else
    dense
    class="border border-gray-500 text-center"
    :class="extraClasses"
  >
    <v-col>
      <span v-html="playerIs" />
      {{ stringify(Array.from(game.availableActions)) }}.
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'TurnStatus',
  props: {
    game: { type: Object, default: () => {} },
    profile: { type: Object, default: () => {} },
    controllingPlayerName: { type: String, default: '' },
    paused: { type: Boolean, default: false },
  },
  computed: {
    extraClasses() {
      if (this.paused) {
        return 'bg-yellow-100';
      }
      if (this.game.currentPlayerName === this.profile.username) {
        return `bg-${this.game.currentNation.value}`;
      }
      return '';
    },
    playerIs() {
      if (this.controllingPlayerName === '') {
        return '<b>Swiss Banks</b> are ';
      } if (this.game.currentPlayerName === this.profile.username) {
        return '<b>You</b> are ';
      }
      return `<b>${this.game.currentPlayerName}</b> is `;
    },
  },
  methods: {
    stringify(actions) {
      const actionsWithoutUndo = [];
      for (const action of actions) {
        if (action.type !== 'undo') {
          actionsWithoutUndo.push(action);
        }
      }
      if (actionsWithoutUndo.every((action) => action.type === 'rondel')) {
        return 'choosing a rondel slot';
      } if (actionsWithoutUndo.every((action) => action.type === 'buildFactory' || action.type === 'skipBuildFactory')) {
        return 'choosing where to build a factory';
      } if (actionsWithoutUndo.every((action) => action.type === 'maneuver' || action.type === 'endManeuver')) {
        return 'choosing where to maneuver their military units. Fleets move first, then armies';
      } if (actionsWithoutUndo.every((action) => action.type === 'bondPurchase' || action.type === 'skipBondPurchase')) {
        return 'choosing a bond to purchase';
      } if (actionsWithoutUndo.every((action) => action.type === 'import')) {
        return 'choosing where to import additional military units';
      } if (actionsWithoutUndo.every((action) => action.type === 'fight' || action.type === 'coexist')) {
        return 'choosing whether to fight or coexist';
      } if (actionsWithoutUndo.every((action) => action.type === 'forceInvestor' || action.type === 'skipForceInvestor')) {
        return 'choosing whether to force the current nation to stop on the Investor rondel slot';
      } if (actionsWithoutUndo.every((action) => action.type === 'destroyFactory' || action.type === 'skipDestroyFactory')) {
        return 'choosing whether to destroy a factory';
      } if (actionsWithoutUndo.every((action) => action.type === 'unfriendlyEntrance' || action.type === 'friendlyEntrance')) {
        return 'choosing whether to enter peacefully or not';
      } if (actionsWithoutUndo.every((action) => action.type === 'blockCanal' || action.type === 'unblockCanal')) {
        return 'choosing whether or not to block a canal';
      }
      return 'doing something mysterious';
    },
  },
};
</script>

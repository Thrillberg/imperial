<template>
  <v-col
    v-if="game.handlingConflict && (profile.username === controllingPlayerName || (game.soloMode && hostingThisGame))"
  >
    <v-row
      v-if="fighting()"
      justify="space-evenly"
    >
      <v-btn
        color="primary-darken-1"
        @click="coexist"
      >
        Coexist
      </v-btn>
      <v-btn
        v-for="fightAction in fightActions()"
        :key="fightAction.payload.incumbent.value + fightAction.payload.targetType"
        color="primary-darken-1"
        @click="$emit('tick-with-action', fightAction)"
      >
        Fight {{ displayNationName(fightAction.payload.incumbent.value) }} ({{ fightAction.payload.targetType }})
      </v-btn>
    </v-row>
    <v-row
      v-if="occupying()"
      justify="space-evenly"
    >
      <v-btn
        color="primary-darken-1"
        @click="friendlyEntrance"
      >
        Enter friendly
      </v-btn>
      <v-btn
        color="primary-darken-1"
        @click="unfriendlyEntrance"
      >
        Enter unfriendly
      </v-btn>
    </v-row>
  </v-col>
  <v-col
    v-else-if="fighting() && (profile.username === controllingPlayerName || (game.soloMode && hostingThisGame))"
    class="text-center"
  >
    <button
      v-for="fightAction in fightActions()"
      :key="fightAction.payload.province + fightAction.payload.challenger"
      class="rounded p-2 m-1 sm:m-4 bg-green-800 text-white cursor-pointer"
      @click="$emit('tick-with-action', fightAction)"
    >
      Fight {{ displayNationName(fightAction.payload.challenger.value) }} in {{ fightAction.payload.province }}
    </button>
  </v-col>
</template>

<script>
import { displayNationName } from '../stringify';

export default {
  name: 'ConflictHandler',
  props: {
    controllingPlayerName: { type: String, default: '' },
    game: { type: Object, default: () => {} },
    hostingThisGame: { type: Boolean, default: false },
    profile: { type: Object, default: () => {} },
  },
  emits: ['tick-with-action'],
  methods: {
    fighting() {
      let fighting = false;
      for (const action of this.game.availableActions) {
        if (action.type === 'coexist' || action.type === 'fight') {
          fighting = true;
        }
      }
      return fighting;
    },
    occupying() {
      let occupying = true;
      for (const action of this.game.availableActions) {
        if (action.type !== 'friendlyEntrance' && action.type !== 'unfriendlyEntrance' && action.type !== 'undo') {
          occupying = false;
        }
      }
      return occupying;
    },
    coexist() {
      let coexistAction = {};
      for (const action of this.game.availableActions) {
        if (action.type === 'coexist') {
          coexistAction = action;
        }
      }
      this.$emit('tick-with-action', coexistAction);
    },
    fight() {
      let fightAction = {};
      for (const action of this.game.availableActions) {
        if (action.type === 'fight') {
          fightAction = action;
        }
      }
      this.$emit('tick-with-action', fightAction);
    },
    friendlyEntrance() {
      let friendlyEntranceAction = {};
      for (const action of this.game.availableActions) {
        if (action.type === 'friendlyEntrance') {
          friendlyEntranceAction = action;
        }
      }
      this.$emit('tick-with-action', friendlyEntranceAction);
    },
    unfriendlyEntrance() {
      let unfriendlyEntranceAction = {};
      for (const action of this.game.availableActions) {
        if (action.type === 'unfriendlyEntrance') {
          unfriendlyEntranceAction = action;
        }
      }
      this.$emit('tick-with-action', unfriendlyEntranceAction);
    },
    fightActions() {
      const fightActions = [];
      for (const action of this.game.availableActions) {
        if (action.type === 'fight') {
          fightActions.push(action);
        }
      }
      return fightActions;
    },
    displayNationName(nation) {
      return displayNationName(nation);
    },
  },
};
</script>

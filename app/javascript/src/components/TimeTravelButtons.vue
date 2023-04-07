<template>
  <v-row class="justify-center">
    <v-btn-group>
      <v-btn
        v-if="game.log.length > 1"
        size="small"
        color="secondary"
        @click="$emit('backToGameStartEvent')"
      >
        |◀
      </v-btn>
      <v-btn
        v-else
        size="small"
        disabled
      >
        |◀
      </v-btn>
      <v-btn
        v-if="game.log.length > 1"
        size="small"
        color="secondary"
        @click="$emit('backToRoundStartEvent')"
      >
        ◀◀
      </v-btn>
      <v-btn
        v-else
        size="small"
        disabled
      >
        ◀◀
      </v-btn>
      <v-btn
        v-if="game.log.length > 1"
        size="small"
        color="secondary"
        @click="$emit('backEvent')"
      >
        ◀
      </v-btn>
      <v-btn
        v-else
        size="small"
        disabled
      >
        ◀
      </v-btn>
      <v-btn
        v-if="poppedTurns.length > 0"
        size="small"
        color="secondary"
        @click="$emit('forwardEvent')"
      >
        ▶
      </v-btn>
      <v-btn
        v-else
        size="small"
        disabled
      >
        ▶
      </v-btn>
      <v-btn
        v-if="poppedTurns.length > 0"
        size="small"
        color="secondary"
        @click="$emit('forwardToCurrentActionEvent')"
      >
        ▶|
      </v-btn>
      <v-btn
        v-else
        size="small"
        disabled
      >
        ▶|
      </v-btn>
    </v-btn-group>
  </v-row>
</template>

<script>

export default {
  name: 'TimeTravelButtons',
  props: {
    game: { type: Object, default: () => {} },
    poppedTurns: { type: Array, default: () => [] },
  },
  emits: ['forwardToCurrentActionEvent',
    'forwardEvent',
    'backToGameStartEvent',
    'backEvent',
    'backToRoundStartEvent',
  ],
};
</script>

<template>
  <div class="flex justify-center my-2">
        <div
        v-if="game.log.length > 1"
        class="rounded p-2 mx-2 bg-yellow-100 cursor-pointer"
        @click="$emit('backToGameStartEvent')"
        >
        |◀
        </div>
        <div
        v-else
        class="rounded p-2 mx-2 bg-gray-600 text-white cursor-not-allowed"
        >
        |◀
        </div>
        <div
        v-if="game.log.length > 1"
        class="rounded p-2 mx-2 bg-yellow-100 cursor-pointer"
        @click="$emit('backToRoundStartEvent')"
        >
        ◀◀
        </div>
        <div
        v-else
        class="rounded p-2 mx-2 bg-gray-600 text-white cursor-not-allowed"
        >
        ◀◀
        </div>
        <div
        v-if="game.log.length > 1"
        class="rounded p-2 mx-2 bg-yellow-100 cursor-pointer"
        @click="$emit('backEvent')"
        >
        ◀
        </div>
        <div
          v-else
          class="rounded p-2 mx-2 bg-gray-600 text-white cursor-not-allowed"
        >
        ◀
        </div>
        <div
          v-if="poppedTurns.length > 0"
          class="rounded p-2 mx-2 bg-yellow-100 cursor-pointer"
          @click="$emit('forwardEvent')"
        >
        ▶
        </div>
        <div
          v-else
          class="rounded p-2 mx-2 bg-gray-600 text-white cursor-not-allowed"
        >
        ▶
        </div>
        <div
          v-if="poppedTurns.length > 0"
          class="rounded p-2 mx-2 bg-yellow-100 cursor-pointer"
          @click="$emit('forwardToCurrentActionEvent')"
        >
        ▶|
        </div>
        <div
          v-else
          class="rounded p-2 mx-2 bg-gray-600 text-white cursor-not-allowed"
        >
        ▶|
        </div>
    </div>
</template>

<script>
// import Imperial from '../../lib/imperial';

export default {
  name: 'TimeTravelButtons',
  props: ['game', 'poppedTurns'],
  emits: ['forwardToCurrentActionEvent', 
          'forwardEvent', 
          'backToGameStartEvent',
          'backEvent',
          'backToRoundStartEvent'
        ]
};
</script>

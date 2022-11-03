<template>
  <div class="flex justify-center my-2">
        <div
        v-if="this.game.log.length > 1"
        class="rounded p-2 mx-2 bg-yellow-100 cursor-pointer"
        @click="backToGameStart"
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
        v-if="this.game.log.length > 1"
        class="rounded p-2 mx-2 bg-yellow-100 cursor-pointer"
        @click="backToRoundStart"
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
        v-if="this.game.log.length > 1"
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
        @click="forward"
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
        @click="forwardToCurrentAction"
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
import Imperial from '../../lib/imperial';

export default {
  name: 'TimeTravelButtons',
  props: ['game'],
  methods: {
    backToRoundStart() {
      const startingNation = this.game.baseGame === 'imperial' ? Nation.AH : Nation2030.RU;
      while ((this.game.log[this.game.log.length - 1].payload.nation !== startingNation) || (this.game.log[this.game.log.length - 1].type !== 'rondel')) {
        this.back();
      }
      // Go back to beginning of startingNation's turn, one more
      const lastTurn = this.game.log.pop();

      this.poppedTurns.push(lastTurn);

      const { log } = this.game;
      const { board } = this.game;
      this.game = Imperial.fromLog(log, board);
    },
    backToGameStart() {
      while (this.game.log.length > 1) {
        this.back();
      }
    },
    forward() {
      const newLog = this.game.log;
      newLog.push(this.poppedTurns.pop());
      while (this.poppedTurns[this.poppedTurns.length - 1]?.type === 'maneuver') {
        newLog.push(this.poppedTurns.pop());
      }
      const { board } = this.game;
      this.game = Imperial.fromLog(newLog, board);
    },
    forwardToCurrentAction() {
      while (this.poppedTurns.length > 0) {
        this.forward();
      }
    },
  },
};
</script>

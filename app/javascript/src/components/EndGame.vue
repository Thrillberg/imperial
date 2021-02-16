<template>
  <div v-if="game.winner">
    <div class="bg-gray-200 h-full w-screen fixed opacity-80 text-center"></div>
    <div class="absolute w-full text-center">
      <div class="text-7xl">
        <p>Game Over</p>
        <p>{{ game.winner }} won!</p>
      </div>
      <div class="flex justify-around">
        <div v-for="[nation] of game.nations">
          <svg xmlns="http://www.w3.org/2000/svg" height="90" width="120">
            <Flag
              :nation="nation.value"
              height="90"
            ></Flag>
          </svg>
          <div class="text-xl">{{ game.nations.get(nation).powerPoints }} power points</div>
          <div class="text-5xl">{{ Math.floor(game.nations.get(nation).powerPoints / 5) }}x</div>
        </div>
      </div>
      <div v-for="(player, index) of playersSortedByScore()">
        <div class="my-5">
          <p class="text-2xl"><b>{{ index + 1 }}. {{ game.players[player].name }}</b></p>
          <div class="flex flex-row justify-center">
            <div v-for="bond of game.players[player].bonds">
              <Bond :bond="bond" />
              <div>{{ bond.number * Math.floor(game.nations.get(bond.nation).powerPoints / 5) }} VP</div>
            </div>
          </div>
          <p class="text-2xl">{{ game.players[player].rawScore }} raw score + {{ game.players[player].cash }} cash = <b>{{ game.players[player].rawScore + game.players[player].cash }}</b> total points</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Bond from "./Bond.vue";
import Flag from "./flags/Flag.vue";

export default {
  name: "EndGame",
  components: { Bond, Flag },
  props: { game: Object },
  methods: {
    playersSortedByScore: function() {
      return Object.keys(this.game.players).sort((a, b) => {
        return this.game.players[a].rawScore + this.game.players[a].cash < this.game.players[b].rawScore + this.game.players[b].cash
      });
    }
  }
}
</script>

<template>
  <div
    class="player p-4 m-2 bg-green-200 font-serif"
    :class="player.name === current_player ? 'font-bold' : ''"
  >
    <h3>{{ player.name }}</h3>
    <div class="flex">
      <div v-for="[nation] of game.nations" :key="nation.value">
        <Bond
          v-for="bond in player.bonds"
          :bond="bond"
          :nation="nation.value"
          :key="bond.nation.value + bond.cost"
        />
      </div>
    </div>
    <div v-if="player.name === game.investorCardHolder">Investor Card</div>
  </div>
</template>

<script>
import Bond from "./Bond.vue";

export default {
  name: "Player",
  components: {
    Bond
  },
  props: {
    current_player: String,
    player: Object,
    game: Object,
    name: String
  }
};
</script>

<template>
  <div
    class="player p-8 m-2 bg-green-200 font-serif"
    :class="player.name === current_player ? 'font-bold' : ''"
  >
    <h3>{{ player.name }}</h3>
    <div>Cash: {{ player.cash }} million</div>
    <div>
      <Bond
        v-for="bond in player.bonds"
        v-bind:nation="bond.nation.value"
        v-bind:cost="bond.cost"
        v-bind:key="bond.nation.value + bond.cost"
      ></Bond>
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

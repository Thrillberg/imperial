<template>
  <li
    class="player p-12 bg-green-300 font-serif"
    :class="player.name === current_player ? 'font-bold' : ''"
  >
    <div class="contents">
      <h3>{{ player.name }}</h3>
      <div>Cash: {{ player.cash }} million</div>
      <div>
        Bonds:
        <ul class="bonds list-none">
          <Bond
            v-for="bond in player.bonds"
            v-bind:nation="bond.nation.value"
            v-bind:cost="bond.cost"
            v-bind:key="bond.nation.value + bond.cost"
          ></Bond>
        </ul>
      </div>
      <div v-if="player.name === game.investorCardHolder">Investor Card</div>
    </div>
  </li>
</template>

<script>
import Bond from "./Bond.vue";

export default {
  name: "Player",
  components: {
    Bond,
  },
  props: {
    current_player: String,
    player: Object,
    game: Object,
    name: String,
  },
};
</script>

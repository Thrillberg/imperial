<template>
  <li
    class="player p-12 bg-green-300 font-serif"
    :class="current_player ? 'font-bold' : ''"
  >
    <div class="contents">
      <h3>{{ name }}</h3>
      <div>Cash: {{ cash }} million</div>
      <div>
        Bonds:
        <ul class="bonds list-none">
          <Bond
            v-for="bond in bonds"
            v-bind:nation="bond.nation.value"
            v-bind:cost="bond.cost"
            v-bind:key="bond.nation.value + bond.cost"
          ></Bond>
        </ul>
      </div>
      <div v-if="investor_card_holder">Investor Card</div>
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
    bonds: Set,
    cash: Number,
    current_player: Boolean,
    investor_card_holder: Boolean,
    name: String,
  },
};
</script>
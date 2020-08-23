<template>
  <li class="player">
    <div v-if="name === current_player" class="current_player">
      🤩
    </div>
    <div class="contents">
      <h3>{{ name }}</h3>
      <div>Cash: {{ cash }} million</div>
      <div>
        Bonds:
        <ul class="bonds">
          <Bond
            v-for="bond in bonds"
            v-bind:nation="bond.nation.value"
            v-bind:cost="bond.cost"
            v-bind:key="bond.nation.value"
          ></Bond>
        </ul>
      </div>
    </div>
  </li>
</template>

<script>
import Bond from "./Bond.vue";

export default {
  name: "Player",
  props: {
    name: String,
    cash: Number,
    bonds: Set,
    current_player: String,
  },
  components: { Bond },
};
</script>

<style scoped>
.bonds {
  list-style: none;
  padding-left: 0;
}

.current_player {
  font-size: 3rem;
  margin-top: 0.5rem;
  padding: 1rem 0;
  position: absolute;
  top: -0.2rem;
}

.player {
  background: #9dd7d0;
  padding: 3rem;
}
</style>

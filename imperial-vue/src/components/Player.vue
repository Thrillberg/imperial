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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
} */
</style>

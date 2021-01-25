<template>
  <div
    class="m-2 border border-gray-500 p-1"
    v-if="nation === bond.nation.value"
    @click="click_handler(bond.number, bond.nation)"
  >
    <Flag :nation="bond.nation.value" :height="(20).toString()" />
    {{ bond.number }} / {{ bond.cost }}
  </div>
</template>

<script>
import Flag from "./flags/Flag.vue";

export default {
  name: "Bond",
  props: {
    bond: Object,
    click_handler: Function,
    nation: String
  },
  components: { Flag }
};
</script>

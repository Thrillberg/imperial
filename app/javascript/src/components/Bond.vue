<template>
  <div
    class="m-2 border border-gray-500 p-1"
    v-if="nation === bond.nation.value"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="20">
      <Flag :nation="bond.nation.value" :width="(30).toString()" />
    </svg>
    {{ bond.number }}:{{ bond.cost }}
  </div>
</template>

<script>
import Flag from "./flags/Flag.vue";

export default {
  name: "Bond",
  props: {
    bond: Object,
    nation: String
  },
  components: { Flag }
};
</script>

<template>
  <div class="flex flex-wrap">
    <PowerPointSlot
      v-for="powerPointSlot in power_points"
      v-bind:powerPointSlot="powerPointSlot.slot"
      v-bind:nations="powerPointSlot.nations"
      v-bind:key="powerPointSlot.slot"
    ></PowerPointSlot>
  </div>
</template>

<script>
import PowerPointSlot from "./PowerPointSlot.vue";

export default {
  name: "PowerPointsChart",
  props: {
    power_points: Array
  },
  components: {
    PowerPointSlot
  }
};
</script>

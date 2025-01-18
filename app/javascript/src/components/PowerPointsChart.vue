<template>
  <div class="flex flex-wrap">
    <PowerPointSlot
      v-for="powerPointSlot in power_points"
      :key="powerPointSlot.slot"
      :power-point-slot="powerPointSlot.slot"
      :nations="powerPointSlot.nations"
    />
  </div>
</template>

<script>
import PowerPointSlot from './PowerPointSlot.vue';

export default {
  name: 'PowerPointsChart',
  components: {
    PowerPointSlot,
  },
  props: {
    power_points: Array,
  },
};
</script>

<template>
  <span>
    <span
      class="block p-4 border border-solid border-black bg-teal-200"
      :class="display()"
    >
      {{ powerPointSlot }}
    </span>
    <Flag
      v-for="nation in nations"
      :key="nation"
      :nation="nation"
      height="15"
      :class="'my-2 mx-auto'"
    />
  </span>
</template>

<script>
import Flag from './flags/Flag.vue';

export default {
  name: 'PowerPointSlot',
  components: {
    Flag,
  },
  props: {
    nations: Array,
    powerPointSlot: Number,
  },
  methods: {
    display() {
      if (this.powerPointSlot % 5 === 0) {
        return 'shadow';
      }

      return '';
    },
  },
};
</script>

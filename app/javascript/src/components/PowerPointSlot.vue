<template>
  <span>
    <span
      class="block p-4 border border-solid border-black bg-teal-200"
      v-bind:class="display()"
    >
      {{ powerPointSlot }}
    </span>
    <Flag
      v-for="nation in nations"
      v-bind:nation="nation"
      height="15"
      v-bind:class="'my-2 mx-auto'"
      v-bind:key="nation"
    ></Flag>
  </span>
</template>

<script>
import Flag from "./flags/Flag.vue";

export default {
  name: "PowerPointSlot",
  components: {
    Flag
  },
  props: {
    nations: Array,
    powerPointSlot: Number
  },
  methods: {
    display: function() {
      if (this.powerPointSlot % 5 === 0) {
        return "shadow";
      }

      return "";
    }
  }
};
</script>

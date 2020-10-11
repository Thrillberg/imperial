<template>
  <div class="flex justify-evenly items-center h-12">
    <span class="text-2xl">{{ taxSlot }}</span>
    <span class="w-24 flex flex-wrap"
      ><Flag
        v-for="nation in nations"
        v-bind:nation="nation"
        height="15"
        v-bind:class="'my-1 mx-auto'"
        v-bind:key="nation"
      ></Flag
    ></span>
    <span class="text-2xl">+{{ taxSlot - 5 }}</span>
  </div>
</template>

<script>
import Flag from "./Flag.vue";

export default {
  name: "TaxChartSlot",
  components: {
    Flag,
  },
  props: {
    taxSlot: Number,
    nations: Array,
  },
};
</script>
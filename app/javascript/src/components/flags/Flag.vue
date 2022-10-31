<template>
  <g :transform="transform">
    <component
      :is="flags[nation]"
      :width="width"
      :height="height"
      :transform="transform"
      :x="x"
      :y="y"
      :fleet="this.fleet"
      :filter="activeFilter"
    ></component>
    <rect
      v-if="friendly"
      :x="x + 3"
      :y="y + 2"
      :width="7"
      :height="4"
      fill="white"
      stroke="none"
    ></rect>
  </g>
</template>

<script>
import { defineAsyncComponent, markRaw } from 'vue';

export default {
  name: "Flag",
  props: {
    filter: String,
    fleet: Boolean,
    height: String,
    nation: String,
    friendly: Boolean,
    transform: String,
    width: String,
    x: Number,
    y: Number
  },
  data: () => {
    return {
      flags: {
        "AH": markRaw(defineAsyncComponent(() => import("./AHFlag.vue"))),
        "BR": markRaw(defineAsyncComponent(() => import("./BRFlag.vue"))),
        "CN": markRaw(defineAsyncComponent(() => import("./CNFlag.vue"))),
        "EU": markRaw(defineAsyncComponent(() => import("./EUFlag.vue"))),
        "IN": markRaw(defineAsyncComponent(() => import("./INFlag.vue"))),
        "IT": markRaw(defineAsyncComponent(() => import("./ITFlag.vue"))),
        "FR": markRaw(defineAsyncComponent(() => import("./FRFlag.vue"))),
        "GB": markRaw(defineAsyncComponent(() => import("./GBFlag.vue"))),
        "GE": markRaw(defineAsyncComponent(() => import("./GEFlag.vue"))),
        "RU": markRaw(defineAsyncComponent(() => import("./RUFlag.vue"))),
        "US": markRaw(defineAsyncComponent(() => import("./USFlag.vue"))),
      }
    }
  },
  computed: {
    activeFilter: function () {
      if (this.filter === "grayscale") {
        return "url(#grayscale)"
      }

      return "";
    }
  }
};
</script>

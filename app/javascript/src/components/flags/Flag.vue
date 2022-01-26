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
        "AH": () => import("./AHFlag.vue"),
        "BR": () => import("./BRFlag.vue"),
        "CN": () => import("./CNFlag.vue"),
        "EU": () => import("./EUFlag.vue"),
        "IN": () => import("./INFlag.vue"),
        "IT": () => import("./ITFlag.vue"),
        "FR": () => import("./FRFlag.vue"),
        "GB": () => import("./GBFlag.vue"),
        "GE": () => import("./GEFlag.vue"),
        "RU": () => import("./RUFlag.vue"),
        "US": () => import("./USFlag.vue"),
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

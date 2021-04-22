<template>
  <g :transform="transform">
    <component
      :is="this.flag(nation)"
      :width="width"
      :height="height"
      :transform="transform"
      :x="x"
      :y="y"
      :fleet="this.fleet"
      :filter="activeFilter"
    ></component>
  </g>
</template>

<script>
import AHFlag from "./AHFlag.vue";
import BRFlag from "./BRFlag.vue";
import CNFlag from "./CNFlag.vue";
import EUFlag from "./EUFlag.vue";
import INFlag from "./INFlag.vue";
import ITFlag from "./ITFlag.vue";
import FRFlag from "./FRFlag.vue";
import GBFlag from "./GBFlag.vue";
import GEFlag from "./GEFlag.vue";
import RUFlag from "./RUFlag.vue";
import USFlag from "./USFlag.vue";

export default {
  name: "Flag",
  props: {
    filter: String,
    fleet: Boolean,
    height: String,
    nation: String,
    transform: String,
    width: String,
    x: Number,
    y: Number
  },
  methods: {
    flag: nation => {
      switch (nation) {
        case "AH":
          return AHFlag;
        case "BR":
          return BRFlag;
        case "CN":
          return CNFlag;
        case "EU":
          return EUFlag;
        case "IN":
          return INFlag;
        case "IT":
          return ITFlag;
        case "FR":
          return FRFlag;
        case "GB":
          return GBFlag;
        case "GE":
          return GEFlag;
        case "RU":
          return RUFlag;
        case "US":
          return USFlag;
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

<template>
  <component
    v-bind:is="this.flag(nation)"
    v-bind:width="width"
    v-bind:height="height"
    v-bind:transform="transform"
    v-bind:x="x"
    v-bind:y="y"
    v-bind:fleet="this.fleet"
  ></component>
</template>

<script>
import AHFlag from "./AHFlag.vue";
import ITFlag from "./ITFlag.vue";
import FRFlag from "./FRFlag.vue";
import GBFlag from "./GBFlag.vue";
import GEFlag from "./GEFlag.vue";
import RUFlag from "./RUFlag.vue";

export default {
  name: "Flag",
  props: {
    fleet: Boolean,
    height: String,
    nation: String,
    transform: String,
    width: String,
    x: Number,
    y: Number,
  },
  methods: {
    flag: (nation) => {
      switch (nation) {
        case "AH":
          return AHFlag;
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
      }
    },
  },
};
</script>

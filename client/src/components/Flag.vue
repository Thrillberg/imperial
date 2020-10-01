<template>
  <component
    v-if="nationData.rondelPosition === rondel_slot"
    v-bind:is="this.flag(nation)"
    v-bind:width="width"
    v-bind:height="height"
    v-bind:transform="transform"
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
    height: String,
    nation: String,
    nation_data: Object,
    rondel_slot: String,
    transform: String,
    width: String,
  },
  data() {
    return {
      nationData: this.nation_data,
    };
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
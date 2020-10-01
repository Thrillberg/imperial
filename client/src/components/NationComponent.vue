<template>
  <li>
    <component
      v-bind:is="this.flag(nation)"
      v-bind:class="current_nation"
      class="h-12 w-auto"
    ></component>
    <div>{{ treasury }}m</div>
  </li>
</template>

<script>
import AHFlag from "./AHFlag.vue";
import ITFlag from "./ITFlag.vue";
import FRFlag from "./FRFlag.vue";
import GBFlag from "./GBFlag.vue";
import GEFlag from "./GEFlag.vue";
import RUFlag from "./RUFlag.vue";

export default {
  name: "NationComponent",
  props: {
    current_nation: String,
    nation: String,
    treasury: Number,
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

<style scoped>
.current_nation {
  box-shadow: 0 0 2rem 0.5rem #ffd700;
}
</style>
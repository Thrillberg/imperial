<template>
  <div class="m-2">
    {{ nation }}
    <component
      :is="this.flag(nation)"
      :class="current_nation"
      :width="(120).toString()"
      class="border border-gray500"
    ></component>
    <div>{{ treasury }}m</div>
    <div>{{ power_points }} power points</div>
  </div>
</template>

<script>
import AHFlag from "./flags/AHFlag.vue";
import ITFlag from "./flags/ITFlag.vue";
import FRFlag from "./flags/FRFlag.vue";
import GBFlag from "./flags/GBFlag.vue";
import GEFlag from "./flags/GEFlag.vue";
import RUFlag from "./flags/RUFlag.vue";

export default {
  name: "NationComponent",
  props: {
    current_nation: String,
    nation: String,
    power_points: Number,
    treasury: Number
  },
  methods: {
    flag: nation => {
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
    }
  }
};
</script>

<style scoped>
.current_nation {
  box-shadow: 0 0 2rem 0.5rem #ffd700;
}
</style>

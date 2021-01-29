<template>
  <div class="m-2">
    {{ stringify(nation) }}
    <div :class="current_nation" class="w-min">
      <svg xmlns="http://www.w3.org/2000/svg" height="40" width="60">
        <Flag
          :nation="nation"
          :height="(40).toString()"
          :filter="is_controller ? '' : 'grayscale'"
          class="border border-gray500"
        ></Flag>
      </svg>
    </div>
    <div>{{ treasury }}m</div>
    <div>{{ power_points }} power points</div>
    <div>{{ tax_chart_position }} tax chart position</div>
  </div>
</template>

<script>
import Flag from "./flags/Flag.vue";

import stringify from "../stringify.js";

export default {
  name: "NationComponent",
  components: { Flag },
  props: {
    current_nation: String,
    is_controller: Boolean,
    nation: String,
    power_points: Number,
    tax_chart_position: Number,
    treasury: Number
  },
  methods: {
    stringify(nation) {
      return stringify(nation);
    }
  }
};
</script>

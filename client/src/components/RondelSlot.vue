<template>
  <g
    class="slot"
    v-bind:transform="'translate(100, 100) rotate(' + rotation + ')'"
  >
    <path
      v-bind:id="rondel_slot.type"
      v-bind:fill="rondel_slot.color"
      v-bind:d="svgPathData"
      v-on:click="$emit('slot-clicked')"
      stroke="#000000"
      vector-effect="non-scaling-stroke"
      stroke-width="1"
      transform="scale(100, 100)"
      v-bind:class="hoverable(is_valid)"
    ></path>
    <text
      font-family="Baskerville"
      font-weight="normal"
      font-size="10"
      letter-spacing="0.3"
      fill="#000000"
      text-align="center"
      x="130"
      y="0"
      text-anchor="middle"
      alignment-baseline="central"
      v-bind:transform="'rotate(' + textRotation + ' 100 10)'"
    >
      {{ rondel_slot.label }}
    </text>
    <Flag
      v-for="nation in nations"
      v-bind:nation="nation"
      v-bind:key="nation"
      width="15"
      height="10"
      v-bind:transform="
        'translate(' + flagTranslation + ') rotate(' + -rotation + ')'
      "
    ></Flag>
  </g>
</template>

<script>
import Flag from "./flags/Flag.vue";

export default {
  name: "RondelSlot",
  components: {
    Flag,
  },
  props: {
    index: Number,
    is_valid: Boolean,
    rondel_slot: Object,
    nations: Array,
  },
  data: function () {
    const slotCount = 8;
    return {
      // The rotation of the slot relative to the overall rondel.
      rotation: (360.0 / slotCount) * this.index,
      // The rotation of the text within its slot.
      textRotation: (360.0 / slotCount) * 2.5,
      flagTranslation: `${60} ${this.index + 20}`,
      svgPathData: [
        // Start at the top of a circle. Using a unit circle of radius 1
        // makes the trigonometry below a little easier to do. The path is
        // scaled up using a transform.
        "M 0 0",
        "H 1",
        // Start an arc with a radius of 1, 1, unrotated, traveling the
        // shortest path to the target point, and curving away from the center.
        "A 1 1 0 0 1",
        // The arc's target is a point 1/8th of the way along a unit circle.
        Math.cos((2 * Math.PI) / slotCount),
        Math.sin((2 * Math.PI) / slotCount),
        // Finish by closing the path.
        "Z",
      ].join(" "),
    };
  },
  methods: {
    hoverable: (is_valid) => {
      if (is_valid) {
        return "hoverable";
      } else {
        return "";
      }
    },
  },
};
</script>

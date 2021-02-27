<template>
  <g>
    <g
      class="slot"
      :transform="'translate(100, 100) rotate(' + rotation + ')'"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    >
      <filter v-if="hover" id="brightness">
        <feComponentTransfer>
          <feFuncR type="linear" slope="2" />
          <feFuncG type="linear" slope="2" />
          <feFuncB type="linear" slope="2" />
        </feComponentTransfer>
      </filter>
      <path
        :id="rondel_slot.type"
        :fill="rondel_slot.color"
        :d="svgPathData"
        @click="$emit('slot-clicked')"
        @mouseover="$emit('slot-hovered')"
        @mouseleave="$emit('slot-silent')"
        stroke="#000000"
        vector-effect="non-scaling-stroke"
        stroke-width="1"
        transform="scale(100, 100)"
        v-bind:class="hoverable(is_valid)"
      ></path>
      <text
        font-weight="normal"
        font-size="10"
        letter-spacing="0.3"
        fill="#000000"
        text-align="center"
        x="130"
        y="0"
        text-anchor="middle"
        alignment-baseline="central"
        v-bind:transform="'rotate(' + textRotation + ')'"
      >
        {{ rondel_slot.label }}
      </text>
    </g>
    <g
      :transform="'translate(100, 100) rotate(' + this.rotation +')'"
    >
      <circle
        v-for="(nation, index) in nations"
        :cx="xPosition(index)"
        :cy="yPosition(index)"
        r="7"
        stroke-width="0.5"
        stroke="black"
        :fill="fill(nation)"
      ></circle>
    </g>
  </g>
</template>

<script>
import Flag from "./flags/Flag.vue";

export default {
  name: "RondelSlot",
  components: {
    Flag
  },
  props: {
    index: Number,
    is_valid: Boolean,
    rondel_slot: Object,
    nations: Array
  },
  data: function() {
    const slotCount = 8;
    return {
      // The rotation of the slot relative to the overall rondel.
      rotation: (360.0 / slotCount) * this.index,
      // The rotation of the text within its slot.
      textRotation: this.getTextRotation(),
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
        "Z"
      ].join(" "),
      hover: false
    };
  },
  methods: {
    hoverable: is_valid => {
      if (is_valid) {
        return "hoverable";
      } else {
        return "";
      }
    },
    xPosition: function(index) {
      return 25 + 15 * index;
    },
    yPosition: function(index) {
      return 10 + 6 * index;
    },
    getTextRotation: function() {
      const slotCount = 8;
      if (this.index < 4) {
        return `${-(360.0 / slotCount) * 1.5} 150 40`;
      } else {
        return `${(360.0 / slotCount) * 2.5} 100 10`;
      }
    },
    fill: function(nation) {
      switch (nation) {
        case "AH":
          return "#EBE084"
        case "IT":
          return "#6E8D4E"
        case "FR":
          return "#54BFF9"
        case "GB":
          return "#EF7F72"
        case "GE":
          return "#8F8F8F"
        case "RU":
          return "#9C6BAE"
      }
    }
  }
};
</script>

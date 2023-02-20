import "stringify"

<template>
  <g>
    <g
      class="slot"
      :transform="'translate(100, 100) rotate(' + rotation + ')'"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    >
      <filter
        v-if="hover"
        id="brightness"
      >
        <feComponentTransfer>
          <feFuncR
            type="linear"
            slope="2"
          />
          <feFuncG
            type="linear"
            slope="2"
          />
          <feFuncB
            type="linear"
            slope="2"
          />
        </feComponentTransfer>
      </filter>
      <path
        :id="rondelSlot.type"
        :fill="rondelSlot.color"
        :d="svgPathData"
        stroke="#000000"
        vector-effect="non-scaling-stroke"
        stroke-width="1"
        transform="scale(100, 100)"
        :class="hoverable(isValid)"
        @click="$emit('slot-clicked')"
        @mouseover="$emit('slot-hovered')"
        @mouseleave="$emit('slot-silent')"
      />
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
        :transform="'rotate(' + textRotation + ')'"
      >
        {{ rondelSlot.label }}
      </text>
    </g>
    <g :transform="'translate(100, 100) rotate(' + rotation + ')'">
      <circle
        v-for="(nation, i) in nations"
        :key="i"
        :cx="xPosition(i)"
        :cy="yPosition(i)"
        r="7"
        stroke-width="0.5"
        stroke="black"
        :fill="fill(nation)"
        @mouseover="$emit('circle-hovered', nation)"
      />
    </g>
  </g>
</template>

<script>
export default {
  name: 'RondelSlot',
  props: {
    index: { type: Number, default: 0 },
    isValid: Boolean,
    rondelSlot: { type: Object, default: () => { } },
    nations: { type: Array, default: () => [] },
  },
  emits: ['slot-clicked', 'slot-hovered', 'slot-silent', 'circle-hovered'],
  data() {
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
        'M 0 0',
        'H 1',
        // Start an arc with a radius of 1, 1, unrotated, traveling the
        // shortest path to the target point, and curving away from the center.
        'A 1 1 0 0 1',
        // The arc's target is a point 1/8th of the way along a unit circle.
        Math.cos((2 * Math.PI) / slotCount),
        Math.sin((2 * Math.PI) / slotCount),
        // Finish by closing the path.
        'Z',
      ].join(' '),
      hover: false,
    };
  },
  methods: {
    hoverable: (isValid) => {
      if (isValid) {
        return 'hoverable';
      }
      return '';
    },
    xPosition(index) {
      return 25 + 15 * index;
    },
    yPosition(index) {
      return 10 + 6 * index;
    },
    getTextRotation() {
      const slotCount = 8;
      if (this.index < 4) {
        return `${-(360.0 / slotCount) * 1.5} 150 40`;
      }
      return `${(360.0 / slotCount) * 2.5} 100 10`;
    },
    fill(nation) {
      switch (nation) {
        case 'AH':
          return '#EBE084';
        case 'IT':
          return '#6E8D4E';
        case 'FR':
          return '#54BFF9';
        case 'GB':
          return '#EF7F72';
        case 'GE':
          return '#8F8F8F';
        case 'RU':
          return '#9C6BAE';
        case 'CN':
          return '#ebe084';
        case 'IN':
          return 'silver';
        case 'BR':
          return '#6E8D4E';
        case 'US':
          return '#EF7F72';
        case 'EU':
          return '#54bff9';
        case 'JP':
          return '#6E8D4E';
        case 'TR':
          return '#8F8F8F';
        case 'GEAsia':
          return 'white';
        case 'CNAsia':
          return '#ebe084';
        default: return '';
      }
    },
  },
};
</script>

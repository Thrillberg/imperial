<template>
  <g ref="province">
    <component
      :is="province"
      :style="{'visibility': 'hidden'}"
    />
    <g
      v-for="(fleet, index) in availableFleets()"
      :key="fleet.nation + index + 'F'"
    >
      <Flag
        :nation="fleet.nation"
        :x="flagX(index) + (adjustments?.flagFleetX || 0)"
        :y="flagY(index) + 10 + (adjustments?.flagFleetY || 0)"
        :fleet="true"
        width="21"
        height="11"
      />
      <circle
        r="6.75"
        :cx="flagX(index) + (adjustments?.flagFleetX || 0) + 10.5"
        :cy="flagY(index) + (adjustments?.flagFleetY || 0) + 15.5"
        fill="none"
        :fill-opacity="0"
        :stroke="getNationColor(fleet)"
        :stroke-width="1.75"
      />
      <circle
        r="7.75"
        :cx="flagX(index) + (adjustments?.flagFleetX || 0) + 10.5"
        :cy="flagY(index) + (adjustments?.flagFleetY || 0) + 15.5"
        fill="none"
        :fill-opacity="0"
        stroke="black"
        :stroke-width="0.5"
      />
    </g>
  </g>
</template>

<script>
import Flag from './flags/Flag.vue';

export default {
  name: 'ProvinceFleet',
  components: { Flag },
  props: {
    adjustments: { type: Object, default: () => {} },
    config: { type: Object, default: () => {} },
    name: { type: String, default: '' },
    nationColor: { type: String, default: '' },
    province: { type: Object, default: () => {} },
    fleets: { type: Array, default: () => [] },
  },
  data: () => ({
    mounted: false,
  }),
  mounted() {
    this.mounted = true;
  },
  methods: {
    availableFleets() {
      if (this.mounted) {
        return this.fleets;
      }

      return [];
    },
    flagX(index) {
      return (
        index * 3.5
        + this.$refs.province.children[0].getBBox().x
        + this.$refs.province.children[0].getBBox().width / 2
      ) + (this.adjustments?.flagX || 0);
    },
    flagY(index) {
      return (
        index * 3.5
        + this.$refs.province.children[0].getBBox().y
        + this.$refs.province.children[0].getBBox().height / 2
      ) + (this.adjustments?.flagY || 0);
    },
    getNationColor(unit) {
      if (this.nationColor) {
        if (this.nationColor === this.config.nationColors[unit.nation]) {
          return this.nationColor;
        }

        return this.config.nationColors[unit.nation];
      }

      return this.$refs.province.children[0].children[0].getAttribute('fill');
    },
  },
};
</script>

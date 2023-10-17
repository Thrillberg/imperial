<template>
  <g ref="province">
    <component
      :is="province"
      :style="{'visibility': 'hidden'}"
    />
    <g
      v-for="(army, index) in availableArmies()"
      :key="army.nation + index + 'A'"
    >
      <Flag
        :nation="army.nation"
        :x="flagX(index) + (adjustments?.flagArmyX || 0)"
        :y="flagY(index) + (adjustments?.flagArmyY || 0)"
        width="13"
        height="8"
      />
      <rect
        width="13.5"
        height="10"
        :x="flagX(index) + (adjustments?.flagArmyX || 0) - 0.5"
        :y="flagY(index) + (adjustments?.flagArmyY || 0) - 1"
        fill="none"
        :fill-opacity="0"
        :stroke="getNationColor(army)"
        :stroke-width="1.75"
      />
      <rect
        width="15.5"
        height="12"
        :x="flagX(index) + (adjustments?.flagArmyX || 0) - 1.5"
        :y="flagY(index) + (adjustments?.flagArmyY || 0) - 2"
        fill="none"
        stroke="black"
        :stroke-width="0.5"
      />
    </g>
  </g>
</template>

<script>
import Flag from './flags/Flag.vue';

export default {
  name: 'ProvinceArmy',
  components: { Flag },
  props: {
    adjustments: { type: Object, default: () => {} },
    config: { type: Object, default: () => {} },
    name: { type: String, default: '' },
    nationColor: { type: String, default: '' },
    province: { type: Object, default: () => {} },
    armies: { type: Array, default: () => [] },
  },
  data: () => ({
    mounted: false,
  }),
  mounted() {
    this.mounted = true;
  },
  methods: {
    availableArmies() {
      if (this.mounted) {
        return this.armies;
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

      if (unit?.friendly && unit?.onForeignLand) {
        return '#32CD32';
      }

      if (unit?.onForeignLand) {
        return 'red';
      }

      return this.$refs.province.children[0].children[0].attributes.fill.value;
    },
  },
};
</script>

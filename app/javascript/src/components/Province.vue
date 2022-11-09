<template>
  <g
    ref="province"
    @click="selectProvince(name)"
    @mouseover="showFactory()"
    @mouseleave="hideFactory()"
  >
    <component :is="province" />
    <text
      v-if="mounted && !isImpassable"
      font-size="8"
      stroke="#303030"
      text-align="center"
      :x="flagX(0) + (adjustments?.labelX || 0)"
      :y="flagY(0) + (adjustments?.labelY || 0)"
      text-anchor="middle"
      alignment-baseline="central"
      class="font-sans"
    >
      {{ name }}
    </text>
    <circle
      v-if="dot && mounted"
      :cx="flagX(0) + 6 + (adjustments?.dotX || 0)"
      :cy="flagY(0) - 5 + (adjustments?.dotY || 0)"
      r="3"
      :fill="nationColor"
    />
    <circle
      v-if="(factoryType === 'shipyard') && mounted"
      :cx="flagX(0) - 6 + (adjustments?.factoryX || 0)"
      :cy="flagY(0) + 5 + (adjustments?.factoryY || 0)"
      r="8"
      fill-opacity="0.4"
      fill="blue"
      stroke="none"
    />
    <rect
      v-else-if="(factoryType === 'armaments') && mounted"
      width="12"
      height="12"
      :x="flagX(0) - 12 + (adjustments?.factoryX || 0)"
      :y="flagY(0) - 1 + (adjustments?.factoryY || 0)"
      fill-opacity="0.4"
      fill="brown"
      stroke="none"
    />
    <Factory
      v-if="(factory || tempFactory) && mounted"
      :type="factory"
      :x="flagX(0) - 10 + (adjustments?.factoryX || 0)"
      :y="flagY(0) + (adjustments?.factoryY || 0)"
      :fill="fill(factory || tempFactory)"
      stroke="white"
      stroke-width="2px"
      :fill-opacity="tempFactory ? 0.3 : 1"
    />
    <Flag
      v-for="(nation, index) in availableFleets()"
      :key="nation + index + 'F'"
      :nation="nation"
      :x="flagX(index) + (adjustments?.flagFleetX || 0)"
      :y="flagY(index) + 10 + (adjustments?.flagFleetY || 0)"
      :fleet="true"
      width="21"
      height="11"
    />
    <Flag
      v-for="(army, index) in availableArmies()"
      :key="army.nation + index + 'A'"
      :nation="army.nation"
      :friendly="army.friendly"
      :x="flagX(index) + (adjustments?.flagArmyX || 0)"
      :y="flagY(index) + (adjustments?.flagArmyY || 0)"
      width="13"
      height="8"
    />
    <Flag
      v-for="(army, index) in importingArmies"
      :key="army.nation + index + 'A'"
      :nation="army.nation"
      :x="flagX(index)"
      :y="flagY(index)"
      filter="grayscale"
      width="13"
      height="8"
    />
    <Flag
      v-for="(fleet, index) in importingFleets"
      :key="fleet.nation + index + 'F'"
      :nation="fleet.nation"
      :x="flagX(index) + (adjustments?.flagFleetX || 0)"
      :y="flagY(index) + 10 + (adjustments?.flagFleetY || 0)"
      :fleet="true"
      filter="grayscale"
      width="21"
      height="11"
    />
  </g>
</template>

<script>
import Factory from './Factory.svg';
import Flag from './flags/Flag.vue';

export default {
  name: 'Province',
  components: { Factory, Flag },
  props: {
    adjustments: { type: Object, default: () => {} },
    buildingFactory: Boolean,
    dot: { type: String, default: '' },
    factory: { type: String, default: '' },
    factoryType: { type: String, default: '' },
    importingUnits: { type: Array, default: () => [] },
    isImpassable: Boolean,
    isValid: Boolean,
    name: { type: String, default: '' },
    nationColor: { type: String, default: '' },
    province: { type: Object, default: () => {} },
    selectProvince: { type: Function, default: () => {} },
    armies: { type: Array, default: () => [] },
    fleets: { type: Array, default: () => [] },
    provinceWithFight: Boolean,
  },
  emits: ['fightResolved'],
  data: () => ({
    mounted: false,
    originalFill: '',
    tempFactory: false,
  }),
  computed: {
    importingArmies() {
      if (this.importingUnits) {
        return this.importingUnits.filter((unit) => unit.type === 'army');
      }

      return [];
    },
    importingFleets() {
      if (this.importingUnits) {
        return this.importingUnits.filter((unit) => unit.type === 'fleet');
      }

      return [];
    },
  },
  mounted() {
    this.mounted = true;
    this.originalFill = this.$refs.province.children[0].children[0].getAttribute('fill');
  },
  updated() {
    const { province } = this.$refs;
    // Background the province
    const provincePath = [...province.children].find(
      (node) => node.nodeName === 'path',
    );
    province.prepend(provincePath, province.children[0]);
    // Add hoverable effect for maneuvers
    if (this.isValid) {
      this.$refs.province.children[0].classList.add('hoverable');
    } else {
      this.$refs.province.children[0].classList.remove('hoverable');
    }
    if (this.provinceWithFight) {
      this.$refs.province.children[0].children[0].animate([
        { fill: '#EF4400' },
        { fill: this.originalFill },
      ], {
        duration: 2000,
        iterations: 1,
      });
      this.$emit('fightResolved');
    }
  },
  methods: {
    availableArmies() {
      if (this.mounted) {
        return this.armies;
      }

      return [];
    },
    availableFleets() {
      if (this.mounted) {
        return this.fleets;
      }

      return [];
    },
    flagX(index) {
      return (
        index * 2.5
        + this.$refs.province.children[0].getBBox().x
        + this.$refs.province.children[0].getBBox().width / 2
      ) + (this.adjustments?.flagX || 0);
    },
    flagY(index) {
      return (
        index * 2.5
        + this.$refs.province.children[0].getBBox().y
        + this.$refs.province.children[0].getBBox().height / 2
      ) + (this.adjustments?.flagY || 0);
    },
    fill(factory) {
      if (factory === 'shipyard') {
        return 'blue';
      }

      return 'brown';
    },
    showFactory() {
      if (this.isValid && this.buildingFactory) {
        this.tempFactory = this.factoryType;
      }
    },
    hideFactory() {
      this.tempFactory = '';
    },
  },
};
</script>

<template>
  <component
    ref="province"
    :is="province"
    @click="select_province(name)"
    @mouseover="showFactory()"
    @mouseleave="hideFactory()"
  >
    <text
      v-if="this.mounted && !['Sardinia', 'Corsica', 'Switzerland'].includes(this.name)"
      font-size="7"
      stroke="#303030"
      text-align="center"
      :x="x(0) + labelXAdjustment()"
      :y="y(0) + labelYAdjustment()"
      text-anchor="middle"
      alignment-baseline="central"
      class="font-sans font-thin"
    >
      {{ this.name }}
    </text>
    <circle
      v-if="dot && this.mounted"
      :cx="x(0) + 6"
      :cy="y(0) - 5"
      r="3"
      v-bind:fill="nationFill(dot)"
    ></circle>
    <circle
      v-if="(factory_type === 'shipyard') && this.mounted"
      :cx="x(0) - 6 + factoryXAdjustment()"
      :cy="y(0) + 5 + factoryYAdjustment()"
      r="8"
      fill-opacity="0.4"
      fill="blue"
      stroke="none"
    ></circle>
    <rect
      v-else-if="(factory_type === 'armaments') && this.mounted"
      width="12"
      height="12"
      :x="x(0) - 12"
      :y="y(0) - 1"
      fill-opacity="0.4"
      fill="brown"
      stroke="none"
      >
    </rect>
    <Factory
      v-if="(factory || tempFactory) && this.mounted"
      :type="factory"
      :x="x(0) - 10 + factoryXAdjustment()"
      :y="y(0) + factoryYAdjustment()"
      :fill="this.fill(factory || tempFactory)"
      stroke="white"
      stroke-width="2px"
      :fill-opacity="tempFactory ? 0.3 : 1"
    ></Factory>
    <Flag
      v-for="(nation, index) in availableFleets()"
      :nation="nation"
      :key="nation + index + 'F'"
      :x="x(index) + flagFleetXAdjustment()"
      :y="y(index) + 10 + flagFleetYAdjustment()"
      :fleet="true"
      width="21"
      height="11"
    ></Flag>
    <Flag
      v-for="(nation, index) in availableArmies()"
      :nation="nation"
      :key="nation + index + 'A'"
      :x="x(index)"
      :y="y(index)"
      width="13"
      height="8"
    ></Flag>
    <circle
      v-if="importingArmy"
      :cx="x(0) + 6"
      :cy="y(0) - 5"
      r="4"
      fill="red"
      stroke="red"
      stroke-dasharray="1,1"
    ></circle>
  </component>
</template>

<script>
import Factory from "./Factory.svg";
import Flag from "../flags/Flag.vue";

export default {
  name: "Province",
  components: { Factory, Flag },
  props: {
    building_factory: Boolean,
    dot: String,
    factory: String,
    factory_type: String,
    importingArmy: Boolean,
    is_valid: Boolean,
    name: String,
    province: Object,
    select_province: Function,
    armies: Array,
    fleets: Array
  },
  data: () => {
    return {
      mounted: false,
      tempFactory: false
    };
  },
  mounted() {
    this.mounted = true;
  },
  updated() {
    const province = this.$refs.province;
    // Background the province
    const provincePath = [...province.children].find(
      node => node.nodeName === "path"
    );
    province.prepend(provincePath, province.children[0]);
    // Add hoverable effect for maneuvers
    if (this.is_valid) {
      this.$refs.province.children[0].classList.add("hoverable");
    } else {
      this.$refs.province.children[0].classList.remove("hoverable");
    }
  },
  methods: {
    availableArmies() {
      if (this.mounted) {
        return this.armies;
      } else {
        return [];
      }
    },
    availableFleets() {
      if (this.mounted) {
        return this.fleets;
      } else {
        return [];
      }
    },
    // x() and y() approximate the center of a province for flag placement.
    x(index) {
      switch (this.name) {
        case "Danzig":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) - 20;
      }
      return (
        index * 2.5 +
        this.$refs.province.children[0].getBBox().x +
        this.$refs.province.children[0].getBBox().width / 2
      );
    },
    y(index) {
      switch (this.name) {
        case "Bay of Biscay":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) - 60;
      }
      return (
        index * 2.5 +
        this.$refs.province.children[0].getBBox().y +
        this.$refs.province.children[0].getBBox().height / 2
      );
    },
    flagFleetXAdjustment() {
      switch (this.name) {
        case "Bordeaux":
          return -20
      }
      return 0
    },
    flagFleetYAdjustment() {
      switch (this.name) {
        case "Brest":
          return -30
      }
      return 0
    },
    labelXAdjustment() {
      switch (this.name) {
        case "Danzig":
          return 10
      }
      return 0
    },
    labelYAdjustment() {
      switch (this.name) {
        case "Western Mediterranean Sea":
          return 30
      }
      return 0
    },
    factoryXAdjustment() {
      switch (this.name) {
        case "Danzig":
          return 20
        case "Edinburgh":
          return 15
        case "Genoa":
          return 15
        case "St. Petersburg":
          return -20
        case "Venice":
          return 15
      }
      return 0
    },
    factoryYAdjustment() {
      switch (this.name) {
        case "Brest":
          return -20
      }
      return 0
    },
    fill(factory) {
      if (factory === "shipyard") {
        return "blue";
      } else {
        return "brown";
      }
    },
    nationFill(nation) {
      switch (nation) {
        case "AH":
          return "#ebe084";
        case "IT":
          return "#6E8D4E";
        case "FR":
          return "#54bff9";
        case "GB":
          return "#ef7f72";
        case "GE":
          return "silver";
        case "RU":
          return "#9c6bae";
      }
    },
    showFactory() {
      if (this.is_valid && this.building_factory) {
        this.tempFactory = this.factory_type
      }
    },
    hideFactory() {
      this.tempFactory = ""
    }
  }
};
</script>

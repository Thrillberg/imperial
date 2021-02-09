<template>
  <component
    ref="province"
    :is="province"
    @click="select_province(name)"
    @mouseover="showFactory()"
    @mouseleave="hideFactory()"
  >
    <text
      v-if="this.mounted"
      font-size="10"
      fill="#000000"
      text-align="center"
      :x="x(0)"
      :y="y(0)"
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
    <Factory
      v-if="(factory || tempFactory) && this.mounted"
      :type="factory"
      :x="x(0) - 10"
      :y="y(0)"
      :fill="this.fill(factory || tempFactory)"
      stroke="white"
      stroke-width="2px"
    ></Factory>
    <Flag
      v-for="(nation, index) in availableFleets()"
      :nation="nation"
      :key="nation + index + 'F'"
      :x="x(index) + flagFleetXAdjustment(name)"
      :y="y(index) + 10"
      :fleet="true"
      width="13"
      height="8"
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
        case "danzig":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) - 20;
        case "danzig":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) - 20;
        case "denmark":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) + 30;
        case "englishchannel":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) - 10;
        case "genoa":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) - 15;
        case "greece":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) - 25;
        case "ioniansea":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) + 20;
        case "norway":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) - 45;
        case "portugal":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) - 15;
        case "sweden":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) - 20;
        case "turkey":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) - 50;
      }
      return (
        index * 2.5 +
        this.$refs.province.children[0].getBBox().x +
        this.$refs.province.children[0].getBBox().width / 2
      );
    },
    y(index) {
      switch (this.name) {
        case "bayofbiscay":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) - 60;
        case "belgium":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) - 5;
        case "blacksea":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) + 15;
        case "denmark":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) + 40;
        case "easternmediterraneansea":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) + 30;
        case "englishchannel":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) + 7;
        case "greece":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) - 10;
        case "ioniansea":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) + 30;
        case "lemberg":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) - 10;
        case "naples":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) - 20;
        case "northatlantic":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) - 20;
        case "norway":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) + 100;
        case "sweden":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) + 40;
      }
      return (
        index * 2.5 +
        this.$refs.province.children[0].getBBox().y +
        this.$refs.province.children[0].getBBox().height / 2
      );
    },
    flagFleetXAdjustment() {
      switch (this.name) {
        case "bordeaux":
          return -20
        case "liverpool":
          return -10
        case "englishchannel":
          return -20
        case "marseille":
        case "hamburg":
          return -15
        case "marseille":
          return -15
        case "stpetersburg":
          return -20
      }
      return 0
    },
    fill(factory) {
      if (factory === "shipyard") {
        return "blue";
      } else {
        return "black";
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

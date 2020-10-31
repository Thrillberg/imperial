<template>
  <component
    ref="province"
    v-bind:is="province"
    v-on:click="select_province(name)"
  >
    <circle
      v-if="dot && this.mounted"
      v-bind:cx="x(0) + 6"
      v-bind:cy="y(0) - 5"
      r="2"
      v-bind:fill="nationFill(dot)"
    ></circle>
    <Factory
      v-if="factory && this.mounted"
      v-bind:type="factory"
      v-bind:x="x(0) - 10"
      v-bind:y="y(0)"
      v-bind:fill="this.fill(factory)"
      stroke="white"
      stroke-width="2px"
    ></Factory>
    <Flag
      v-for="(nation, index) in availableFleets()"
      v-bind:nation="nation"
      width="13"
      height="8"
      v-bind:key="nation + index"
      v-bind:x="x(index)"
      v-bind:y="y(index)"
      v-bind:fleet="true"
    ></Flag>
    <Flag
      v-for="(nation, index) in availableArmies()"
      v-bind:nation="nation"
      width="13"
      height="8"
      v-bind:key="nation + index"
      v-bind:x="x(index)"
      v-bind:y="y(index)"
    ></Flag>
  </component>
</template>

<script>
import Factory from "./Factory.svg";
import Flag from "../flags/Flag.vue";

export default {
  name: "Province",
  components: { Factory, Flag },
  props: {
    dot: String,
    factory: String,
    is_valid: Boolean,
    name: String,
    province: Object,
    select_province: Function,
    armies: Array,
    fleets: Array,
  },
  data: () => {
    return {
      mounted: false,
    };
  },
  mounted() {
    this.mounted = true;
  },
  updated() {
    const province = this.$refs.province;
    // Background the province
    const provincePath = [...province.children].find(
      (node) => node.nodeName === "path"
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
      return (
        index * 2.5 +
        this.$refs.province.children[0].getBBox().x +
        this.$refs.province.children[0].getBBox().width / 2
      );
    },
    y(index) {
      return (
        index * 2.5 +
        this.$refs.province.children[0].getBBox().y +
        this.$refs.province.children[0].getBBox().height / 2
      );
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
  },
};
</script>

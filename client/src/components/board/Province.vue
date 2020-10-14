<template>
  <component
    ref="province"
    v-bind:is="province"
    v-on:click="select_province(name)"
  >
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
      v-for="(nation, index) in nations"
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
import Factory from "../Factory.svg";
import Flag from "../Flag.vue";

export default {
  name: "Province",
  components: { Factory, Flag },
  props: {
    factory: String,
    is_valid: Boolean,
    name: String,
    province: Object,
    select_province: Function,
    nations: Array,
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
    if (province.children[0].nodeName === "svg") {
      province.insertBefore(province.children[1], province.children[0]);
    }
    // Add hoverable effect for maneuvers
    if (this.is_valid) {
      this.$refs.province.children[0].classList.add("hoverable");
    } else {
      this.$refs.province.children[0].classList.remove("hoverable");
    }
  },
  methods: {
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
  },
};
</script>
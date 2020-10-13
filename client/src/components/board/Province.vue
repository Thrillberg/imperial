<template>
  <component
    ref="province"
    v-bind:is="province"
    v-on:click="select_province(name)"
  >
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
import Flag from "../Flag.vue";

export default {
  name: "Province",
  components: { Flag },
  props: {
    is_valid: Boolean,
    name: String,
    province: Object,
    select_province: Function,
    nations: Array,
  },
  updated() {
    const province = this.$refs.province;
    // Foreground the flag
    if (this.nations && province.children[0].nodeName === "svg") {
      province.insertBefore(
        province.children[province.children.length - 1],
        province.children[0]
      );
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
  },
};
</script>
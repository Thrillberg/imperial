<template>
  <component
    ref="province"
    v-bind:is="province"
    v-on:click="select_province(name)"
  >
    <Flag
      v-for="nation in nations"
      v-bind:nation="nation"
      width="13"
      height="8"
      v-bind:key="nation"
      v-bind:x="x()"
      v-bind:y="y()"
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
    nations: Array,
    name: String,
    province: Object,
    select_province: Function,
  },
  updated() {
    const province = this.$refs.province;
    // Foreground the flag
    if (this.nations.length > 0 && province.children[0].nodeName === "svg") {
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
    x() {
      return (
        this.$refs.province.children[0].getBBox().x +
        this.$refs.province.children[0].getBBox().width / 2
      );
    },
    y() {
      return (
        this.$refs.province.children[0].getBBox().y +
        this.$refs.province.children[0].getBBox().height / 2
      );
    },
  },
};
</script>
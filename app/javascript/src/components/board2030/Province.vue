<template>
  <component
    ref="province"
    :is="province"
    @click="select_province(name)"
    @mouseover="showFactory()"
    @mouseleave="hideFactory()"
  >
    <text
      v-if="this.mounted && !['Black Sea', 'Caspian Sea'].includes(this.name)"
      font-size="8"
      stroke="#303030"
      text-align="center"
      :x="x(0) + labelXAdjustment()"
      :y="y(0) + labelYAdjustment()"
      text-anchor="middle"
      alignment-baseline="central"
      class="font-sans"
    >
      {{ this.name }}
    </text>
    <circle
      v-if="dot && this.mounted"
      :cx="x(0) + 6 + dotXAdjustment()"
      :cy="y(0) - 5 + dotYAdjustment()"
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
      :x="x(0) - 12 + factoryXAdjustment()"
      :y="y(0) - 1 + factoryYAdjustment()"
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
      :x="x(index) + flagArmyXAdjustment()"
      :y="y(index) + flagArmyYAdjustment()"
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
        case "Rio de Janeiro":
          return 10
        case "Caribbean Sea":
          return 40
        case "Sea of Japan":
          return 100
        case "North Pacific":
          return -50
      }
      return 0
    },
    flagFleetYAdjustment() {
      switch (this.name) {
        case "Rio de Janeiro":
          return -30
        case "Caribbean Sea":
          return -10
        case "Sea of Japan":
          return 30
      }
      return 0
    },
    dotXAdjustment() {
      switch (this.name) {
        case "Caribbean Sea":
          return 40
        case "Sea of Japan":
          return 100
        case "North Pacific":
          return -50
        case "Mexico":
          return -30
      }
      return 0
    },
    dotYAdjustment() {
      switch (this.name) {
        case "Sea of Japan":
          return 30
      }
      return 0
    },
    flagArmyXAdjustment() {
      switch (this.name) {
        case "Beijing":
          return 10
        case "Mexico":
          return -30
      }
      return 0
    },
    flagArmyYAdjustment() {
      switch (this.name) {
        case "Moscow":
          return -20
      }
      return 0
    },
    labelXAdjustment() {
      switch (this.name) {
        case "Caribbean Sea":
          return 10
        case "North Pacific":
          return -50
        case "Mexico":
          return -28
        case "London":
          return 20
        case "Japan":
          return 5
        case "Indonesia":
          return -20
        case "Sea of Japan":
          return 120
        case "New Orleans":
          return 10;
      }
      return 0
    },
    labelYAdjustment() {
      switch (this.name) {
        case "Caribbean Sea":
          return -10
        case "North Pacific":
          return 30
        case "London":
          return 25
        case "Peru":
          return 10
        case "Japan":
          return 25
        case "Beijing":
          return 20
        case "Sea of Japan":
          return 60
        case "New Orleans":
          return 15;
      }
      return 0
    },
    factoryXAdjustment() {
      switch (this.name) {
        case "London":
          return 25
        case "Shanghai":
          return 30
        case "New Orleans":
          return 50
        case "Beijing":
          return 40
        case "Moscow":
          return 10
      }
      return 0
    },
    factoryYAdjustment() {
      switch (this.name) {
        case "London":
          return 5
        case "Murmansk":
          return -30
        case "New Orleans":
          return 20
        case "Fortaleza":
          return -20
        case "Chongqing":
          return -20
        case "Beijing":
          return -5
        case "Moscow":
          return 10
        case "Berlin":
          return 25
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
        case "CN":
          return "#ebe084";
        case "BR":
          return "#6E8D4E";
        case "EU":
          return "#54bff9";
        case "US":
          return "#ef7f72";
        case "IN":
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

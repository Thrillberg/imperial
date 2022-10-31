<template>
  <g
    ref="province"
    @click="select_province(name)"
    @mouseover="showFactory()"
    @mouseleave="hideFactory()"
  >
    <component :is="province" />
    <text
      v-if="this.mounted && !['Sardinia', 'Corsica', 'Switzerland'].includes(this.name)"
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
      v-for="(army, index) in availableArmies()"
      :nation="army.nation"
      :key="army.nation + index + 'A'"
      :friendly="army.friendly"
      :x="x(index)"
      :y="y(index)"
      width="13"
      height="8"
    ></Flag>
    <Flag
      v-for="(army, index) in importingArmies"
      :nation="army.nation"
      :key="army.nation + index + 'A'"
      :x="x(index)"
      :y="y(index)"
      filter="grayscale"
      width="13"
      height="8"
    ></Flag>
    <Flag
      v-for="(fleet, index) in importingFleets"
      :nation="fleet.nation"
      :key="fleet.nation + index + 'F'"
      :x="x(index) + flagFleetXAdjustment()"
      :y="y(index) + 10 + flagFleetYAdjustment()"
      :fleet="true"
      filter="grayscale"
      width="21"
      height="11"
    ></Flag>
  </g>
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
    importingUnits: Array,
    is_valid: Boolean,
    name: String,
    province: Object,
    select_province: Function,
    armies: Array,
    fleets: Array,
    province_with_fight: Boolean
  },
  data: () => {
    return {
      mounted: false,
      originalFill: "",
      tempFactory: false
    };
  },
  mounted() {
    this.mounted = true;
    this.originalFill = this.$refs.province.children[0].getAttribute("fill");
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
    if (this.province_with_fight) {
      this.$refs.province.children[0].animate([
        { fill: "#EF4400" },
        { fill: this.originalFill }
      ], {
        duration: 2000,
        iterations: 1
      });
      this.$emit("fightResolved");
    }
  },
  computed: {
    importingArmies() {
      if (this.importingUnits) {
        return this.importingUnits.filter(unit => unit.type === "army");
      }

      return [];
    },
    importingFleets() {
      if (this.importingUnits) {
        return this.importingUnits.filter(unit => unit.type === "fleet");
      }

      return [];
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
        case "Bordeaux":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) - 10;
        case "Danzig":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) - 20;
        case "Denmark":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) + 30;
        case "Edinburgh":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) - 10;
        case "English Channel":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) - 10;
        case "Genoa":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) - 15;
        case "Greece":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) - 25;
        case "Ionian Sea":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) + 20;
        case "Lemberg":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) + 7;
        case "Marseille":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) + 15;
        case "Morocco":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) - 5;
        case "Norway":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) - 45;
        case "Odessa":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) - 40;
        case "Portugal":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) - 15;
        case "Sheffield":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) - 5;
        case "Sweden":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) - 20;
        case "Turkey":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) - 50;
        case "West Balkan":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().x +
            this.$refs.province.children[0].getBBox().width / 2
          ) - 5;
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
        case "Belgium":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) - 5;
        case "Black Sea":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) + 15;
        case "Brest":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) + 5;
        case "Bulgaria":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) + 7;
        case "Cologne":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) + 3;
        case "Denmark":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) + 40;
        case "Edinburgh":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) + 5;
        case "Eastern Mediterranean Sea":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) + 30;
        case "English Channel":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) + 7;
        case "Greece":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) - 25;
        case "Ionian Sea":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) + 30;
        case "Lemberg":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) - 8;
        case "London":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) + 3;
        case "Munich":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) + 5;
        case "Morocco":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) - 3;
        case "Moscow":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) + 20;
        case "Naples":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) - 20;
        case "North Atlantic":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) - 20;
        case "Norway":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) + 105;
        case "Prague":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) + 3;
        case "Sweden":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) + 40;
        case "Warsaw":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) + 5;
        case "West Balkan":
          return (
            index * 2.5 +
            this.$refs.province.children[0].getBBox().y +
            this.$refs.province.children[0].getBBox().height / 2
          ) - 10;
      }
      return (
        index * 2.5 +
        this.$refs.province.children[0].getBBox().y +
        this.$refs.province.children[0].getBBox().height / 2
      );
    },
    flagFleetXAdjustment() {
      switch (this.name) {
        case "Baltic Sea":
          return -15
        case "Black Sea":
          return -20
        case "Bordeaux":
          return -20
        case "Danzig":
          return -5
        case "Edinburgh":
          return 10
        case "Genoa":
          return 5
        case "Hamburg":
          return -18
        case "Liverpool":
          return -23
        case "London":
          return 10
        case "English Channel":
          return 25
        case "Marseille":
          return -30
        case "Naples":
          return -25
        case "Odessa":
          return 40
        case "St. Petersburg":
          return -30
        case "Venice":
          return 2
      }
      return 0
    },
    flagFleetYAdjustment() {
      switch (this.name) {
        case "Baltic Sea":
          return 10
        case "Bay of Biscay":
          return -10
        case "Black Sea":
          return 5
        case "Brest":
          return -40
        case "Danzig":
          return -35
        case "Eastern Mediterranean Sea":
          return -5
        case "Edinburgh":
          return -15
        case "English Channel":
          return -40
        case "Hamburg":
          return -7
        case "London":
          return -10
        case "Naples":
          return -13
        case "North Atlantic":
          return -5
        case "St. Petersburg":
          return 7
        case "Trieste":
          return 5
      }
      return 0
    },
    labelXAdjustment() {
      switch (this.name) {
        case "Algeria":
          return 40
        case "Bay of Biscay":
          return -30
        case "Bordeaux":
          return 16
        case "Danzig":
          return 10
        case "Edinburgh":
          return 15
        case "English Channel":
          return -5
        case "Florence":
          return -5
        case "Greece":
          return 2
        case "Liverpool":
          return -5
        case "London":
          return 15
        case "Marseille":
          return -25
        case "Morocco":
          return 10
        case "Norway":
          return -5
        case "Odessa":
          return 40
        case "Portugal":
          return 12
        case "Sheffield":
          return 15
        case "Spain":
          return -15
        case "Sweden":
          return 5
        case "Vienna":
          return 13
        case "Venice":
          return -5
        case "Genoa":
          return 10
        case "West Balkan":
          return 8
      }
      return 0
    },
    labelYAdjustment() {
      switch (this.name) {
        case "Algeria":
          return 5
        case "Bay of Biscay":
          return -10
        case "Berlin":
          return -10
        case "Black Sea":
          return 10
        case "Brest":
          return -5
        case "Budapest":
          return -3
        case "Bulgaria":
          return -5
        case "Bordeaux":
          return -5
        case "Cologne":
          return -3
        case "Danzig":
          return -5
        case "Dijon":
          return -5
        case "Dublin":
          return -5
        case "Edinburgh":
          return -5
        case "Florence":
          return -2
        case "Genoa":
          return -3
        case "Greece":
          return 15
        case "Ionian Sea":
          return 30
        case "Kiev":
          return -5
        case "Lemberg":
          return -2
        case "Liverpool":
          return -5
        case "London":
          return -2
        case "Marseille":
          return 5
        case "Morocco":
          return 15
        case "Moscow":
          return -5
        case "Munich":
          return -3
        case "Naples":
          return -3
        case "Norway":
          return 20
        case "Odessa":
          return -5
        case "Paris":
          return -5
        case "Portugal":
          return -15
        case "Prague":
          return -2
        case "Romania":
          return 20
        case "Rome":
          return -2
        case "Sheffield":
          return -3
        case "St. Petersburg":
          return -5
        case "Sweden":
          return 20
        case "Trieste":
          return -3
        case "Tunis":
          return 10
        case "Turkey":
          return 30
        case "Venice":
          return 14
        case "Vienna":
          return -3
        case "Warsaw":
          return -5
        case "West Balkan":
          return 20
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
          return 20
        case "Genoa":
          return 13
        case "Hamburg":
          return 5
        case "Moscow":
          return -5
        case "Naples":
          return 10
        case "Odessa":
          return 40
        case "Sheffield":
          return 13
        case "St. Petersburg":
          return -15
        case "Venice":
          return 15
      }
      return 0
    },
    factoryYAdjustment() {
      switch (this.name) {
        case "Bordeaux":
          return -5
        case "Brest":
          return -25
        case "Cologne":
          return -21
        case "Danzig":
          return -30
        case "Edinburgh":
          return 7
        case "Genoa":
          return 10
        case "Hamburg":
          return -20
        case "London":
          return 2
        case "Marseille":
          return 5
        case "Naples":
          return 10
        case "Sheffield":
          return 10
        case "Trieste":
          return 10
        case "Venice":
          return -5
      }
      return 0
    },
    dotXAdjustment() {
      switch (this.name) {
        case "English Channel":
          return -30
      }
      return 0
    },
    dotYAdjustment() {
      switch (this.name) {
        case "Baltic Sea":
          return -10
        case "Bulgaria":
          return -10
        case "Eastern Mediterranean Sea":
          return -7
        case "English Channel":
          return 12
        case "North Atlantic":
          return -10
        case "North Sea":
          return -10
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

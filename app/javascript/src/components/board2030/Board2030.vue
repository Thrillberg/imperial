<template>
  <svg
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:cc="http://creativecommons.org/ns#"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:svg="http://www.w3.org/2000/svg"
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    viewBox="0 0 1016.371 514.609"
  >
    <filter id="brightness">
      <feComponentTransfer>
        <feFuncR type="linear" slope="2" />
        <feFuncG type="linear" slope="2" />
        <feFuncB type="linear" slope="2" />
      </feComponentTransfer>
    </filter>
    <clipPath id="fleetClip">
      <circle cx="750" cy="500" r="500" />
    </clipPath>
    <g stroke="#000000" stroke-width="0.5">
      <Province
        v-for="(province, name) in sea_provinces"
        :province="province"
        :name="name"
        :select_province="select_province"
        :fleets="fleets(name)"
        :is_valid="isValid(name)"
        :dot="dot(name)"
        :key="name"
      ></Province>
      <Province
        v-for="(province, name) in land_provinces"
        :province="province"
        :name="name"
        :select_province="select_province"
        :fleets="fleets(name)"
        :armies="armies(name)"
        :importing-army="importingArmy(name)"
        :is_valid="isValid(name)"
        :dot="dot(name)"
        :building_factory="buildingFactory()"
        :factory="factory(name)"
        :factory_type="factoryType(name)"
        :key="name"
      ></Province>
    </g>
  </svg>
</template>

<script>
import alaska from "./alaska.svg";
import argentina from "./argentina.svg";
import brasilia from "./brasilia.svg";
import canada from "./canada.svg";
import caribbean_sea from "./caribbean_sea.svg";
import chicago from "./chicago.svg";
import china_sea from "./china_sea.svg";
import colombia from "./colombia.svg";
import gulf_of_guinea from "./gulf_of_guinea.svg";
import indian_ocean from "./indian_ocean.svg";
import manaus from "./manaus.svg";
import mediterranean_sea from "./mediterranean_sea.svg";
import mexico from "./mexico.svg";
import new_orleans from "./new_orleans.svg";
import new_york from "./new_york.svg";
import north_atlantic from "./north_atlantic.svg";
import north_pacific from "./north_pacific.svg";
import peru from "./peru.svg";
import quebec from "./quebec.svg";
import san_francisco from "./san_francisco.svg";
import sea_of_japan from "./sea_of_japan.svg";
import south_atlantic from "./south_atlantic.svg";
import south_pacific from "./south_pacific.svg";
import tasman_sea from "./tasman_sea.svg";

import Province from "./Province.vue";

export default {
  name: "Board",
  props: {
    game: Object,
    profile: Object,
    gameStarted: Boolean,
    importing_units: Array,
    select_province: Function,
    valid_provinces: Array
  },
  methods: {
    armies(province) {
      let armies = [];
      for (const [provinceWithUnits, allUnitsInProvince] of this.allUnits()) {
        for (const [nation, provinceUnits] of allUnitsInProvince) {
          const normalizedProvince = province.replace(/\.*\s/gm, "").toLowerCase();
          if (normalizedProvince === provinceWithUnits) {
            for (let i = 0; i < provinceUnits.armies; i++) {
              armies.push(nation);
            }
          }
        }
      }
      return armies;
    },
    fleets(province) {
      if (!this.gameStarted) {
        return [];
      }

      let fleets = [];
      for (const [provinceWithUnits, allUnitsInProvince] of this.allUnits()) {
        for (const [nation, provinceUnits] of allUnitsInProvince) {
          const normalizedProvince = province.replace(/\.*\s/gm, "").toLowerCase();
          if (normalizedProvince === provinceWithUnits) {
            for (let i = 0; i < provinceUnits.fleets; i++) {
              fleets.push(nation);
            }
          }
        }
      }
      return fleets;
    },
    importingArmy(province) {
      const normalizedProvince = province.replace(/\.*\s/gm, "").toLowerCase();
      if (!this.gameStarted) {
        return false;
      } else if (this.importing_units.find(unit => unit === normalizedProvince)) {
        return true;
      }

      return false;
    },
    factory(province) {
      const factory = this.factories().find(factory => {
        const normalizedProvince = province.replace(/\.*\s/gm, "").toLowerCase();
        return factory.normalizedProvince === normalizedProvince;
      });
      if (factory) {
        return factory.type;
      }
    },
    factoryType(province) {
      if (this.game.board && !["Corsica", "Sardinia", "Switzerland"].includes(province)) {
        const normalizedProvince = province.replace(/\.*\s/gm, "").toLowerCase();
        return this.game.board.graph.get(normalizedProvince).factoryType
      }
    },
    dot(province) {
      let nation;
      this.dots().forEach(dot => {
        const normalizedProvince = province.replace(/\.*\s/gm, "").toLowerCase();
        if (normalizedProvince === dot.normalizedProvince) {
          nation = dot.flag.value;
        }
      });
      return nation;
    },
    allUnits() {
      if (!this.gameStarted) {
        return new Map();
      }

      // This function returns all units on the board.
      let allUnits = new Map();
      for (const [nation, unitsByNation] of this.game.units) {
        for (const [province, units] of unitsByNation) {
          const normalizedProvince = province.replace(/\.*\s/gm, "").toLowerCase();
          let allUnitsInProvince = new Map();
          if (units.armies > 0 || units.fleets > 0) {
            allUnitsInProvince.set(nation.value, units);
            if (allUnits.get(normalizedProvince)) {
              allUnits.set(
                normalizedProvince,
                new Set([...allUnitsInProvince, ...allUnits.get(normalizedProvince)])
              );
            } else {
              allUnits.set(normalizedProvince, allUnitsInProvince);
            }
          }
        }
      }
      return allUnits;
    },
    factories() {
      if (!this.gameStarted) {
        return [];
      }

      let factories = [];
      for (let [province, data] of this.game.provinces) {
        const normalizedProvince = province.replace(/\.*\s/gm, "").toLowerCase();
        factories.push({ normalizedProvince, type: data.factory });
      }
      return factories;
    },
    dots() {
      if (!this.gameStarted) {
        return [];
      }

      let flags = [];
      for (const [province, data] of this.game.provinces) {
        const flag = data.flag;
        if (flag) {
          const normalizedProvince = province.replace(/\.*\s/gm, "").toLowerCase();
          flags.push({ normalizedProvince, flag });
        }
      }
      return flags;
    },
    isValid(province) {
      const normalizedProvince = province.replace(/\.*\s/gm, "").toLowerCase();
      if (this.valid_provinces.includes(normalizedProvince) && (this.profile.username in this.game.players)) {
        return true;
      }

      return false;
    },
    buildingFactory() {
      if (this.game.availableActions) {
        return [...this.game.availableActions].every(action => action.type === "buildFactory");
      }

      return false;
    }
  },
  data() {
    return {
      sea_provinces: {
        "Caribbean Sea": caribbean_sea,
        "China Sea": china_sea,
        "Gulf of Guinea": gulf_of_guinea,
        "Indian Ocean": indian_ocean,
        "Mediterranean Sea": mediterranean_sea,
        "North Atlantic": north_atlantic,
        "North Pacific": north_pacific,
        "Sea of Japan": sea_of_japan,
        "South Atlantic": south_atlantic,
        "South Pacific": south_pacific,
        "Tasman Sea": tasman_sea,
      },
      land_provinces: {
        "Alaska": alaska,
        "Argentina": argentina,
        "Brasilia": brasilia,
        "Canada": canada,
        "Colombia": colombia,
        "Manaus": manaus,
        "New Orleans": new_orleans,
        "New York": new_york,
        "Chicago": chicago,
        "Quebec": quebec,
        "San Francisco": san_francisco,
        "Mexico": mexico,
        "Peru": peru,
      }
    };
  },
  components: {
    Province
  }
};
</script>

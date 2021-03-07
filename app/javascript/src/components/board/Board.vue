<template>
  <svg
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:cc="http://creativecommons.org/ns#"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:svg="http://www.w3.org/2000/svg"
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    viewBox="0 0 536 430"
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
import algeria from "./algeria.svg";
import balticsea from "./balticsea.svg";
import bayofbiscay from "./bay_of_biscay.svg";
import belgium from "./belgium.svg";
import berlin from "./berlin.svg";
import blacksea from "./blacksea.svg";
import bordeaux from "./bordeaux.svg";
import brest from "./brest.svg";
import budapest from "./budapest.svg";
import bulgaria from "./bulgaria.svg";
import cologne from "./cologne.svg";
import corsica from "./corsica.svg";
import danzig from "./danzig.svg";
import denmark from "./denmark.svg";
import dijon from "./dijon.svg";
import dublin from "./dublin.svg";
import easternmediterraneansea from "./easternmediterraneansea.svg";
import edinburgh from "./edinburgh.svg";
import englishchannel from "./english_channel.svg";
import florence from "./florence.svg";
import genoa from "./genoa.svg";
import greece from "./greece.svg";
import hamburg from "./hamburg.svg";
import holland from "./holland.svg";
import ioniansea from "./ionian_sea.svg";
import lemberg from "./lemberg.svg";
import kiev from "./kiev.svg";
import liverpool from "./liverpool.svg";
import london from "./london.svg";
import marseille from "./marseille.svg";
import morocco from "./morocco.svg";
import moscow from "./moscow.svg";
import munich from "./munich.svg";
import naples from "./naples.svg";
import norway from "./norway.svg";
import northatlantic from "./north_atlantic.svg";
import northsea from "./north_sea.svg";
import odessa from "./odessa.svg";
import paris from "./paris.svg";
import portugal from "./portugal.svg";
import prague from "./prague.svg";
import romania from "./romania.svg";
import rome from "./rome.svg";
import sardinia from "./sardinia.svg";
import sheffield from "./sheffield.svg";
import spain from "./spain.svg";
import stpetersburg from "./stpetersburg.svg";
import sweden from "./sweden.svg";
import switzerland from "./switzerland.svg";
import trieste from "./trieste.svg";
import tunis from "./tunis.svg";
import turkey from "./turkey.svg";
import venice from "./venice.svg";
import vienna from "./vienna.svg";
import warsaw from "./warsaw.svg";
import westbalkan from "./westbalkan.svg";
import westernmediterraneansea from "./western_mediterranean_sea.svg";

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
        "Baltic Sea": balticsea,
        "Bay of Biscay": bayofbiscay,
        "Black Sea": blacksea,
        "Eastern Mediterranean Sea": easternmediterraneansea,
        "English Channel": englishchannel,
        "Ionian Sea": ioniansea,
        "North Atlantic": northatlantic,
        "North Sea": northsea,
        "Western Mediterranean Sea": westernmediterraneansea
      },
      land_provinces: {
        "Warsaw": warsaw,
        "Venice": venice,
        "Algeria": algeria,
        "Belgium": belgium,
        "Berlin": berlin,
        "Brest": brest,
        "Budapest": budapest,
        "Bulgaria": bulgaria,
        "Cologne": cologne,
        "Corsica": corsica,
        "Danzig": danzig,
        "Denmark": denmark,
        "Dijon": dijon,
        "Dublin": dublin,
        "Edinburgh": edinburgh,
        "Florence": florence,
        "Genoa": genoa,
        "Greece": greece,
        "Hamburg": hamburg,
        "Holland": holland,
        "Kiev": kiev,
        "Lemberg": lemberg,
        "Liverpool": liverpool,
        "London": london,
        "Marseille": marseille,
        "Morocco": morocco,
        "Moscow": moscow,
        "Munich": munich,
        "Naples": naples,
        "Norway": norway,
        "Odessa": odessa,
        "Paris": paris,
        "Portugal": portugal,
        "Prague": prague,
        "Romania": romania,
        "Rome": rome,
        "Sardinia": sardinia,
        "Sheffield": sheffield,
        "Spain": spain,
        "St. Petersburg": stpetersburg,
        "Sweden": sweden,
        "Switzerland": switzerland,
        "Trieste": trieste,
        "Tunis": tunis,
        "Turkey": turkey,
        "Vienna": vienna,
        "West Balkan": westbalkan,
        "Bordeaux": bordeaux
      }
    };
  },
  components: {
    Province
  }
};
</script>

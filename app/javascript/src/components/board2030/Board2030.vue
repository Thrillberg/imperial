<template>
  <svg
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:cc="http://creativecommons.org/ns#"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:svg="http://www.w3.org/2000/svg"
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    viewBox="0 0 1016.371 540"
    class="sm:-mt-32 -mt-6"
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
    <clipPath id="fleetClipBR">
      <circle cx="320" cy="240" r="214" />
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
        :province_with_fight="province_with_fight === (name.replace(/\.*\s/gm, '').toLowerCase())"
        v-on:fightResolved="$emit('fightResolved')"
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
        :province_with_fight="province_with_fight === (name.replace(/\.*\s/gm, '').toLowerCase())"
        v-on:fightResolved="$emit('fightResolved')"
        :key="name"
      ></Province>
    </g>
  </svg>
</template>

<script>
import { markRaw } from 'vue';
import alaska from './alaska.svg';
import afghanistan from './afghanistan.svg';
import argentina from './argentina.svg';
import australia from './australia.svg';
import beijing from './beijing.svg';
import berlin from './berlin.svg';
import blackSea from './black_sea.svg';
import brasilia from './brasilia.svg';
import canada from './canada.svg';
import caribbeanSea from './caribbean_sea.svg';
import caspianSea from './caspian_sea.svg';
import chennai from './chennai.svg';
import chicago from './chicago.svg';
import chinaSea from './china_sea.svg';
import chongqing from './chongqing.svg';
import colombia from './colombia.svg';
import congo from './congo.svg';
import eastAfrica from './east_africa.svg';
import fortaleza from './fortaleza.svg';
import gulfOfGuinea from './gulf_of_guinea.svg';
import guinea from './guinea.svg';
import indianOcean from './indian_ocean.svg';
import indochina from './indochina.svg';
import indonesia from './indonesia.svg';
import iran from './iran.svg';
import japan from './japan.svg';
import kazakhstan from './kazakhstan.svg';
import kolkata from './kolkata.svg';
import korea from './korea.svg';
import london from './london.svg';
import manaus from './manaus.svg';
import mediterraneanSea from './mediterranean_sea.svg';
import mexico from './mexico.svg';
import mongolia from './mongolia.svg';
import moscow from './moscow.svg';
import mumbai from './mumbai.svg';
import murmansk from './murmansk.svg';
import nearEast from './near_east.svg';
import newDelhi from './new_delhi.svg';
import newOrleans from './new_orleans.svg';
import newYork from './new_york.svg';
import newZealand from './new_zealand.svg';
import nigeria from './nigeria.svg';
import northAfrica from './north_africa.svg';
import northAtlantic from './north_atlantic.svg';
import northPacific from './north_pacific.svg';
import novosibirsk from './novosibirsk.svg';
import paris from './paris.svg';
import peru from './peru.svg';
import philippines from './philippines.svg';
import quebec from './quebec.svg';
import rioDeJaneiro from './rio_de_janeiro.svg';
import rome from './rome.svg';
import sanFrancisco from './san_francisco.svg';
import seaOfJapan from './sea_of_japan.svg';
import shanghai from './shanghai.svg';
import southAfrica from './south_africa.svg';
import southAtlantic from './south_atlantic.svg';
import southPacific from './south_pacific.svg';
import tasmanSea from './tasman_sea.svg';
import turkey from './turkey.svg';
import ukraine from './ukraine.svg';
import urumqi from './urumqi.svg';
import vladivostok from './vladivostok.svg';

import Province from './Province.vue';

export default {
  name: 'Board',
  props: {
    game: Object,
    profile: Object,
    gameStarted: Boolean,
    importing_units: Array,
    paused: Boolean,
    province_with_fight: String,
    select_province: Function,
    valid_provinces: Array,
  },
  methods: {
    armies(province) {
      const armies = [];
      for (const [provinceWithUnits, allUnitsInProvince] of this.allUnits()) {
        for (const [nation, provinceUnits] of allUnitsInProvince) {
          const normalizedProvince = province.replace(/\.*\s/gm, '').toLowerCase();
          if (normalizedProvince === provinceWithUnits) {
            for (let i = 0; i < provinceUnits.armies; i += 1) {
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

      const fleets = [];
      for (const [provinceWithUnits, allUnitsInProvince] of this.allUnits()) {
        for (const [nation, provinceUnits] of allUnitsInProvince) {
          const normalizedProvince = province.replace(/\.*\s/gm, '').toLowerCase();
          if (normalizedProvince === provinceWithUnits) {
            for (let i = 0; i < provinceUnits.fleets; i += 1) {
              fleets.push(nation);
            }
          }
        }
      }
      return fleets;
    },
    importingArmy(province) {
      if (this.paused) return false;

      const normalizedProvince = province.replace(/\.*\s/gm, '').toLowerCase();
      if (!this.gameStarted) {
        return false;
      } if (this.importing_units.find((unit) => unit === normalizedProvince)) {
        return true;
      }

      return false;
    },
    factory(province) {
      const myFactory = this.factories().find((factory) => {
        const normalizedProvince = province.replace(/\.*\s/gm, '').toLowerCase();
        return factory.normalizedProvince === normalizedProvince;
      });
      if (myFactory) {
        return myFactory.type;
      }
      return '';
    },
    factoryType(province) {
      if (this.game.board && !['Corsica', 'Sardinia', 'Switzerland'].includes(province)) {
        const normalizedProvince = province.replace(/\.*\s/gm, '').toLowerCase();
        return this.game.board.graph.get(normalizedProvince).factoryType;
      }
      return '';
    },
    dot(province) {
      let nation;
      this.dots().forEach((dot) => {
        const normalizedProvince = province.replace(/\.*\s/gm, '').toLowerCase();
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
      const allUnits = new Map();
      for (const [nation, unitsByNation] of this.game.units) {
        for (const [province, units] of unitsByNation) {
          const normalizedProvince = province.replace(/\.*\s/gm, '').toLowerCase();
          const allUnitsInProvince = new Map();
          if (units.armies > 0 || units.fleets > 0) {
            allUnitsInProvince.set(nation.value, units);
            if (allUnits.get(normalizedProvince)) {
              allUnits.set(
                normalizedProvince,
                new Set([...allUnitsInProvince, ...allUnits.get(normalizedProvince)]),
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

      const factories = [];
      for (const [province, data] of this.game.provinces) {
        const normalizedProvince = province.replace(/\.*\s/gm, '').toLowerCase();
        factories.push({ normalizedProvince, type: data.factory });
      }
      return factories;
    },
    dots() {
      if (!this.gameStarted) {
        return [];
      }

      const flags = [];
      for (const [province, data] of this.game.provinces) {
        const { flag } = data;
        if (flag) {
          const normalizedProvince = province.replace(/\.*\s/gm, '').toLowerCase();
          flags.push({ normalizedProvince, flag });
        }
      }
      return flags;
    },
    isValid(province) {
      if (this.paused) return false;

      const normalizedProvince = province.replace(/\.*\s/gm, '').toLowerCase();
      if (
        this.valid_provinces.includes(normalizedProvince)
        && this.profile.username in this.game.players
      ) {
        return true;
      }

      return false;
    },
    buildingFactory() {
      if (this.paused) return false;

      if (this.game.availableActions) {
        return [...this.game.availableActions].every((action) => action.type === 'buildFactory' || action.type === 'skipBuildFactory');
      }

      return false;
    },
  },
  data() {
    return {
      sea_provinces: {
        'Caribbean Sea': markRaw(caribbeanSea),
        'Caspian Sea': markRaw(caspianSea),
        'Gulf of Guinea': markRaw(gulfOfGuinea),
        'Indian Ocean': markRaw(indianOcean),
        'Mediterranean Sea': markRaw(mediterraneanSea),
        'Black Sea': markRaw(blackSea),
        'North Atlantic': markRaw(northAtlantic),
        'North Pacific': markRaw(northPacific),
        'Sea of Japan': markRaw(seaOfJapan),
        'South Atlantic': markRaw(southAtlantic),
        'South Pacific': markRaw(southPacific),
        'Tasman Sea': markRaw(tasmanSea),
        'China Sea': markRaw(chinaSea),
      },
      land_provinces: {
        Alaska: markRaw(alaska),
        Afghanistan: markRaw(afghanistan),
        Argentina: markRaw(argentina),
        Australia: markRaw(australia),
        Beijing: markRaw(beijing),
        Berlin: markRaw(berlin),
        Brasilia: markRaw(brasilia),
        Canada: markRaw(canada),
        Chennai: markRaw(chennai),
        Chongqing: markRaw(chongqing),
        Colombia: markRaw(colombia),
        Congo: markRaw(congo),
        'East Africa': markRaw(eastAfrica),
        Fortaleza: markRaw(fortaleza),
        Guinea: markRaw(guinea),
        Indonesia: markRaw(indonesia),
        Iran: markRaw(iran),
        Japan: markRaw(japan),
        Kazakhstan: markRaw(kazakhstan),
        Kolkata: markRaw(kolkata),
        Korea: markRaw(korea),
        London: markRaw(london),
        Manaus: markRaw(manaus),
        Moscow: markRaw(moscow),
        Mumbai: markRaw(mumbai),
        Murmansk: markRaw(murmansk),
        'Near East': markRaw(nearEast),
        'New Delhi': markRaw(newDelhi),
        'New Orleans': markRaw(newOrleans),
        'New York': markRaw(newYork),
        'New Zealand': markRaw(newZealand),
        Nigeria: markRaw(nigeria),
        'North Africa': markRaw(northAfrica),
        Novosibirsk: markRaw(novosibirsk),
        Chicago: markRaw(chicago),
        Paris: markRaw(paris),
        Quebec: markRaw(quebec),
        'Rio de Janeiro': markRaw(rioDeJaneiro),
        Rome: markRaw(rome),
        'San Francisco': markRaw(sanFrancisco),
        Shanghai: markRaw(shanghai),
        'South Africa': markRaw(southAfrica),
        Turkey: markRaw(turkey),
        Ukraine: markRaw(ukraine),
        Urumqi: markRaw(urumqi),
        Mexico: markRaw(mexico),
        Mongolia: markRaw(mongolia),
        Peru: markRaw(peru),
        Philippines: markRaw(philippines),
        Vladivostok: markRaw(vladivostok),
        Indochina: markRaw(indochina),
      },
    };
  },
  components: {
    Province,
  },
};
</script>

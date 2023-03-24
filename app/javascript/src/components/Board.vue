<template>
  <svg
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:cc="http://creativecommons.org/ns#"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:svg="http://www.w3.org/2000/svg"
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    :viewBox="config.viewBox"
  >
    <filter id="brightness">
      <feComponentTransfer>
        <feFuncR
          type="linear"
          slope="2"
        />
        <feFuncG
          type="linear"
          slope="2"
        />
        <feFuncB
          type="linear"
          slope="2"
        />
      </feComponentTransfer>
    </filter>
    <clipPath id="fleetClip">
      <circle
        cx="750"
        cy="500"
        r="500"
      />
    </clipPath>
    <clipPath id="fleetClipTR">
      <circle
        cx="500"
        cy="400"
        r="400"
      />
    </clipPath>
    <clipPath id="fleetClipCNAsia">
      <circle
        cx="300"
        cy="250"
        r="250"
      />
    </clipPath>
    <g
      stroke="#000000"
      stroke-width="0.5"
    >
      <Province
        v-for="(province, name) in config.seaProvinces"
        :key="name"
        :province="province"
        :name="name"
        :select-province="selectProvince"
        :fleets="fleets(name)"
        :is-valid="isValid(name)"
        :dot="dot(name)"
        :province-with-fight="provinceWithFight === (name.replace(/\.*\s/gm, '').toLowerCase())"
        :adjustments="config.adjustments[name]"
        :nation-color="config.nationColors[dot(name)]"
        :is-impassable="isImpassable(name)"
        :font-size="game.baseGame === 'imperialAsia' ? '13': '8'"
        @fight-resolved="$emit('fightResolved')"
      />
      <Province
        v-for="(province, name) in config.landProvinces"
        :key="name"
        :province="province"
        :name="name"
        :select-province="selectProvince"
        :fleets="fleets(name)"
        :armies="armies(name)"
        :importing-units="importingUnits(name)"
        :is-valid="isValid(name)"
        :dot="dot(name)"
        :building-factory="buildingFactory()"
        :factory="factory(name)"
        :factory-type="factoryType(name)"
        :province-with-fight="provinceWithFight === (name.replace(/\.*\s/gm, '').toLowerCase())"
        :adjustments="config.adjustments[name]"
        :nation-color="config.nationColors[dot(name)]"
        :is-impassable="isImpassable(name)"
        :font-size="game.baseGame === 'imperialAsia' ? '13': '8'"
        @fight-resolved="$emit('fightResolved')"
      />
    </g>
  </svg>
</template>

<script>
import Province from './Province.vue';

export default {
  name: 'Board',
  components: { Province },
  props: {
    config: {
      type: Object,
      default: () => ({ adjustments: {}, seaProvinces: {}, landProvinces: {} }),
    },
    game: { type: Object, default: () => {} },
    profile: { type: Object, default: () => {} },
    gameStarted: Boolean,
    unitsToImport: { type: Array, default: () => [] },
    paused: Boolean,
    provinceWithFight: { type: String, default: '' },
    selectProvince: { type: Function, default: () => {} },
    validProvinces: { type: Array, default: () => [] },
  },
  emits: ['fightResolved'],
  methods: {
    armies(province) {
      const armies = [];
      for (const [provinceWithUnits, allUnitsInProvince] of this.allUnits()) {
        for (const [nation, provinceUnits] of allUnitsInProvince) {
          const normalizedProvince = province.replace(/\.*\s/gm, '').toLowerCase();
          if (normalizedProvince === provinceWithUnits) {
            for (let i = 0; i < provinceUnits.armies; i += 1) {
              let onForeignLand = false;
              for (const [homeNation, provinces] of this.game.board.byNation) {
                if (homeNation?.value !== nation && provinces.has(normalizedProvince)) {
                  onForeignLand = true;
                }
              }
              const friendly = provinceUnits.friendly && onForeignLand;
              let armyNation = nation;
              if (armyNation === 'CN' && this.game.baseGame === 'imperialAsia') {
                armyNation = 'CNAsia';
              }
              armies.push({ nation: armyNation, friendly });
            }
          }
        }
      }
      return armies;
    },
    buildingFactory() {
      if (this.paused) return false;

      if (this.game.availableActions) {
        return [...this.game.availableActions].every((action) => action.type === 'buildFactory' || action.type === 'skipBuildFactory');
      }

      return false;
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
    factory(province) {
      const factoryInProvince = this.factories().find((factory) => {
        const normalizedProvince = province.replace(/\.*\s/gm, '').toLowerCase();
        return factory.normalizedProvince === normalizedProvince;
      });
      if (factoryInProvince) {
        return factoryInProvince.type;
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
              let fleetNation = nation;
              if (fleetNation === 'CN' && this.game.baseGame === 'imperialAsia') {
                fleetNation = 'CNAsia';
              }
              fleets.push(fleetNation);
            }
          }
        }
      }
      return fleets;
    },
    importingUnits(province) {
      if (this.paused) return [];

      const normalizedProvince = province.replace(/\.*\s/gm, '').toLowerCase();
      if (this.gameStarted) {
        return this.unitsToImport.filter((unit) => unit.province === normalizedProvince);
      }

      return [];
    },
    isImpassable(name) {
      const impassableProvinces = ['Sardinia', 'Corsica', 'Switzerland', 'Caspian Sea'];
      if (this.game.baseGame === 'imperial2030') {
        impassableProvinces.push('Black Sea');
      }
      return impassableProvinces.includes(name);
    },
    isValid(province) {
      if (this.paused) return false;

      const normalizedProvince = province.replace(/\.*\s/gm, '').toLowerCase();
      if (
        this.validProvinces.includes(normalizedProvince)
        && (this.profile.username in this.game.players)
      ) {
        return true;
      }

      return false;
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
  },
};
</script>

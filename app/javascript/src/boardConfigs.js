import { markRaw } from 'vue';

// Original Imperial
import algeria from './components/board/algeria.svg';
import balticsea from './components/board/balticsea.svg';
import bayofbiscay from './components/board/bay_of_biscay.svg';
import belgium from './components/board/belgium.svg';
import berlin from './components/board/berlin.svg';
import blacksea from './components/board/blacksea.svg';
import bordeaux from './components/board/bordeaux.svg';
import brest from './components/board/brest.svg';
import budapest from './components/board/budapest.svg';
import bulgaria from './components/board/bulgaria.svg';
import cologne from './components/board/cologne.svg';
import corsica from './components/board/corsica.svg';
import danzig from './components/board/danzig.svg';
import denmark from './components/board/denmark.svg';
import dijon from './components/board/dijon.svg';
import dublin from './components/board/dublin.svg';
import easternmediterraneansea from './components/board/easternmediterraneansea.svg';
import edinburgh from './components/board/edinburgh.svg';
import englishchannel from './components/board/english_channel.svg';
import florence from './components/board/florence.svg';
import genoa from './components/board/genoa.svg';
import greece from './components/board/greece.svg';
import hamburg from './components/board/hamburg.svg';
import holland from './components/board/holland.svg';
import ioniansea from './components/board/ionian_sea.svg';
import lemberg from './components/board/lemberg.svg';
import kiev from './components/board/kiev.svg';
import liverpool from './components/board/liverpool.svg';
import london from './components/board/london.svg';
import marseille from './components/board/marseille.svg';
import morocco from './components/board/morocco.svg';
import moscow from './components/board/moscow.svg';
import munich from './components/board/munich.svg';
import naples from './components/board/naples.svg';
import norway from './components/board/norway.svg';
import northatlantic from './components/board/north_atlantic.svg';
import northsea from './components/board/north_sea.svg';
import odessa from './components/board/odessa.svg';
import paris from './components/board/paris.svg';
import portugal from './components/board/portugal.svg';
import prague from './components/board/prague.svg';
import romania from './components/board/romania.svg';
import rome from './components/board/rome.svg';
import sardinia from './components/board/sardinia.svg';
import sheffield from './components/board/sheffield.svg';
import spain from './components/board/spain.svg';
import stpetersburg from './components/board/stpetersburg.svg';
import sweden from './components/board/sweden.svg';
import switzerland from './components/board/switzerland.svg';
import trieste from './components/board/trieste.svg';
import tunis from './components/board/tunis.svg';
import turkey from './components/board/turkey.svg';
import venice from './components/board/venice.svg';
import vienna from './components/board/vienna.svg';
import warsaw from './components/board/warsaw.svg';
import westbalkan from './components/board/westbalkan.svg';
import westernmediterraneansea from './components/board/western_mediterranean_sea.svg';

export default {
  imperial: {
    adjustments: {
      Algeria: {
        labelX: 40,
        labelY: 5,
      },
      'Baltic Sea': {
        dotY: -10,
        flagFleetX: -15,
        flagFleetY: 10,
      },
      'Bay of Biscay': {
        flagFleetY: -10,
        flagY: -60,
        labelX: -30,
        labelY: -10,
      },
      Belgium: {
        flagY: -5,
      },
      Berlin: {
        labelY: -10,
      },
      'Black Sea': {
        flagFleetX: -20,
        flagFleetY: 5,
        flagY: 15,
        labelY: 10,
      },
      Bordeaux: {
        factoryY: -5,
        flagFleetX: -20,
        flagX: -10,
        labelX: 16,
        labelY: -5,
      },
      Brest: {
        factoryY: -25,
        flagFleetY: -40,
        flagY: 5,
        labelY: -5,
      },
      Budapest: {
        labelY: -3,
      },
      Bulgaria: {
        dotY: -10,
        flagY: 7,
        labelY: -5,
      },
      Cologne: {
        factoryY: -21,
        flagY: 3,
        labelY: -3,
      },
      Danzig: {
        factoryX: 20,
        factoryY: -30,
        flagFleetX: -5,
        flagFleetY: -35,
        flagX: -20,
        labelX: 10,
        labelY: -5,
      },
      Denmark: {
        flagX: 30,
        flagY: 40,
      },
      Dijon: {
        labelY: -5,
      },
      Dublin: {
        labelY: -5,
      },
      'Eastern Mediterranean Sea': {
        dotY: -7,
        flagFleetY: -5,
        flagY: 30,
      },
      Edinburgh: {
        factoryX: 20,
        factoryY: 7,
        flagFleetX: 10,
        flagFleetY: -15,
        flagX: -10,
        flagY: 5,
        labelX: 15,
        labelY: -5,
      },
      'English Channel': {
        dotX: -30,
        dotY: 12,
        flagFleetX: 25,
        flagFleetY: -40,
        flagX: -10,
        flagY: 7,
        labelX: -5,
      },
      Florence: {
        labelX: -5,
        labelY: -2,
      },
      Genoa: {
        factoryX: 13,
        factoryY: 10,
        flagFleetX: 5,
        flagX: -15,
        labelX: 10,
        labelY: -3,
      },
      Greece: {
        flagX: -25,
        flagY: -25,
        labelX: 2,
        labelY: 15,
      },
      Hamburg: {
        factoryX: 5,
        factoryY: -20,
        flagFleetX: -18,
        flagFleetY: -7,
      },
      'Ionian Sea': {
        flagX: 20,
        flagY: 30,
        labelY: 30,
      },
      Kiev: {
        labelY: -5,
      },
      Lemberg: {
        flagX: 7,
        flagY: -8,
        labelY: -2,
      },
      Liverpool: {
        flagFleetX: -23,
        labelX: -5,
        labelY: -5,
      },
      London: {
        factoryY: 2,
        flagFleetX: 10,
        flagFleetY: -10,
        flagY: 3,
        labelX: 15,
        labelY: -2,
      },
      Marseille: {
        factoryY: 5,
        flagFleetX: -30,
        flagX: 15,
        labelX: -25,
        labelY: 5,
      },
      Morocco: {
        flagX: -5,
        flagY: -3,
        labelX: 10,
        labelY: 15,
      },
      Moscow: {
        factoryX: -5,
        flagY: 20,
        labelY: -5,
      },
      Munich: {
        flagY: 5,
        labelY: -3,
      },
      Naples: {
        factoryX: 10,
        factoryY: 10,
        flagFleetX: -25,
        flagFleetY: -13,
        flagY: -20,
        labelY: -3,
      },
      'North Atlantic': {
        dotY: -10,
        flagFleetY: -5,
        flagY: -20,
      },
      'North Sea': {
        dotY: -10,
      },
      Norway: {
        flagX: -45,
        flagY: 105,
        labelX: -5,
        labelY: 20,
      },
      Odessa: {
        factoryX: 40,
        flagFleetX: 40,
        flagX: -40,
        labelX: 40,
        labelY: -5,
      },
      Paris: {
        labelY: -5,
      },
      Portugal: {
        flagX: -15,
        labelX: 12,
        labelY: -15,
      },
      Prague: {
        flagY: 3,
        labelY: -2,
      },
      Romania: {
        labelY: 20,
      },
      Rome: {
        labelY: -2,
      },
      Sheffield: {
        factoryX: 13,
        factoryY: 10,
        flagX: -5,
        labelX: 15,
        labelY: -3,
      },
      Spain: {
        labelX: -15,
      },
      'St. Petersburg': {
        factoryX: -15,
        flagFleetX: -30,
        flagFleetY: 7,
        labelY: -5,
      },
      Sweden: {
        flagX: -20,
        flagY: 40,
        labelX: 5,
        labelY: 20,
      },
      Trieste: {
        factoryY: 10,
        flagFleetY: 5,
        labelY: -3,
      },
      Tunis: {
        labelY: 10,
      },
      Turkey: {
        flagX: -50,
        labelY: 30,
      },
      Venice: {
        factoryX: 15,
        factoryY: -5,
        flagFleetX: 2,
        labelX: -5,
        labelY: 14,
      },
      Vienna: {
        labelX: 13,
        labelY: -3,
      },
      Warsaw: {
        flagY: 5,
        labelY: -5,
      },
      'West Balkan': {
        flagX: -5,
        flagY: -10,
        labelX: 8,
        labelY: 20,
      },
      'Western Mediterranean Sea': {
        labelY: 30,
      },
    },
    nationColors: {
      AH: '#ebe084',
      IT: '#6E8D4E',
      FR: '#54bff9',
      GB: '#ef7f72',
      GE: 'silver',
      RU: '#9c6bae',
    },
    seaProvinces: {
      'Baltic Sea': markRaw(balticsea),
      'Bay of Biscay': markRaw(bayofbiscay),
      'Black Sea': markRaw(blacksea),
      'Eastern Mediterranean Sea': markRaw(easternmediterraneansea),
      'English Channel': markRaw(englishchannel),
      'Ionian Sea': markRaw(ioniansea),
      'North Atlantic': markRaw(northatlantic),
      'North Sea': markRaw(northsea),
      'Western Mediterranean Sea': markRaw(westernmediterraneansea),
    },
    landProvinces: {
      'West Balkan': markRaw(westbalkan),
      Berlin: markRaw(berlin),
      Danzig: markRaw(danzig),
      Prague: markRaw(prague),
      Warsaw: markRaw(warsaw),
      Venice: markRaw(venice),
      Algeria: markRaw(algeria),
      Belgium: markRaw(belgium),
      Brest: markRaw(brest),
      Budapest: markRaw(budapest),
      Bulgaria: markRaw(bulgaria),
      Cologne: markRaw(cologne),
      Corsica: markRaw(corsica),
      Denmark: markRaw(denmark),
      Switzerland: markRaw(switzerland),
      Dijon: markRaw(dijon),
      Dublin: markRaw(dublin),
      Edinburgh: markRaw(edinburgh),
      Florence: markRaw(florence),
      Marseille: markRaw(marseille),
      Genoa: markRaw(genoa),
      Greece: markRaw(greece),
      Hamburg: markRaw(hamburg),
      Holland: markRaw(holland),
      Kiev: markRaw(kiev),
      Lemberg: markRaw(lemberg),
      Liverpool: markRaw(liverpool),
      London: markRaw(london),
      Morocco: markRaw(morocco),
      Moscow: markRaw(moscow),
      Munich: markRaw(munich),
      Naples: markRaw(naples),
      Norway: markRaw(norway),
      Odessa: markRaw(odessa),
      Paris: markRaw(paris),
      Portugal: markRaw(portugal),
      Romania: markRaw(romania),
      Rome: markRaw(rome),
      Sardinia: markRaw(sardinia),
      Sheffield: markRaw(sheffield),
      Spain: markRaw(spain),
      'St. Petersburg': markRaw(stpetersburg),
      Sweden: markRaw(sweden),
      Trieste: markRaw(trieste),
      Tunis: markRaw(tunis),
      Turkey: markRaw(turkey),
      Vienna: markRaw(vienna),
      Bordeaux: markRaw(bordeaux),
    },
    viewBox: '0 0 536 430',
  },
};

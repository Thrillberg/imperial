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

// Imperial 2030
import alaska from './components/board2030/alaska.svg';
import afghanistan from './components/board2030/afghanistan.svg';
import argentina from './components/board2030/argentina.svg';
import australia from './components/board2030/australia.svg';
import beijing from './components/board2030/beijing.svg';
import berlin2030 from './components/board2030/berlin.svg';
import blackSea2030 from './components/board2030/black_sea.svg';
import brasilia from './components/board2030/brasilia.svg';
import canada from './components/board2030/canada.svg';
import caribbeanSea from './components/board2030/caribbean_sea.svg';
import caspianSea from './components/board2030/caspian_sea.svg';
import chennai from './components/board2030/chennai.svg';
import chicago from './components/board2030/chicago.svg';
import chinaSea from './components/board2030/china_sea.svg';
import chongqing from './components/board2030/chongqing.svg';
import colombia from './components/board2030/colombia.svg';
import congo from './components/board2030/congo.svg';
import eastAfrica from './components/board2030/east_africa.svg';
import fortaleza from './components/board2030/fortaleza.svg';
import gulfOfGuinea from './components/board2030/gulf_of_guinea.svg';
import guinea from './components/board2030/guinea.svg';
import indianOcean from './components/board2030/indian_ocean.svg';
import indochina from './components/board2030/indochina.svg';
import indonesia from './components/board2030/indonesia.svg';
import iran from './components/board2030/iran.svg';
import japan from './components/board2030/japan.svg';
import kazakhstan from './components/board2030/kazakhstan.svg';
import kolkata from './components/board2030/kolkata.svg';
import korea from './components/board2030/korea.svg';
import london2030 from './components/board2030/london.svg';
import manaus from './components/board2030/manaus.svg';
import mediterraneanSea from './components/board2030/mediterranean_sea.svg';
import mexico from './components/board2030/mexico.svg';
import mongolia from './components/board2030/mongolia.svg';
import moscow2030 from './components/board2030/moscow.svg';
import mumbai from './components/board2030/mumbai.svg';
import murmansk from './components/board2030/murmansk.svg';
import nearEast from './components/board2030/near_east.svg';
import newDelhi from './components/board2030/new_delhi.svg';
import newOrleans from './components/board2030/new_orleans.svg';
import newYork from './components/board2030/new_york.svg';
import newZealand from './components/board2030/new_zealand.svg';
import nigeria from './components/board2030/nigeria.svg';
import northAfrica from './components/board2030/north_africa.svg';
import northAtlantic from './components/board2030/north_atlantic.svg';
import northPacific from './components/board2030/north_pacific.svg';
import novosibirsk from './components/board2030/novosibirsk.svg';
import paris2030 from './components/board2030/paris.svg';
import peru from './components/board2030/peru.svg';
import philippines from './components/board2030/philippines.svg';
import quebec from './components/board2030/quebec.svg';
import rioDeJaneiro from './components/board2030/rio_de_janeiro.svg';
import rome2030 from './components/board2030/rome.svg';
import sanFrancisco from './components/board2030/san_francisco.svg';
import seaOfJapan from './components/board2030/sea_of_japan.svg';
import shanghai from './components/board2030/shanghai.svg';
import southAfrica from './components/board2030/south_africa.svg';
import southAtlantic from './components/board2030/south_atlantic.svg';
import southPacific from './components/board2030/south_pacific.svg';
import tasmanSea from './components/board2030/tasman_sea.svg';
import turkey2030 from './components/board2030/turkey.svg';
import ukraine from './components/board2030/ukraine.svg';
import urumqi from './components/board2030/urumqi.svg';
import vladivostok from './components/board2030/vladivostok.svg';

// Imperial Asia
import afghanistanAsia from './components/boardAsia/afghanistan.svg';
import akita from './components/boardAsia/akita.svg';
import angora from './components/boardAsia/angora.svg';
import annam from './components/boardAsia/annam.svg';
import arabia from './components/boardAsia/arabia.svg';
import arabianSea from './components/boardAsia/arabian_sea.svg';
import armenia from './components/boardAsia/armenia.svg';
import bayOfBengal from './components/boardAsia/bay_of_bengal.svg';
import bengal from './components/boardAsia/bengal.svg';
import bombay from './components/boardAsia/bombay.svg';
import borneo from './components/boardAsia/borneo.svg';
import budapestAsia from './components/boardAsia/budapest.svg';
import burma from './components/boardAsia/burma.svg';
import cambodia from './components/boardAsia/cambodia.svg';
import canton from './components/boardAsia/canton.svg';
import caspianSeaAsia from './components/boardAsia/caspian_sea.svg';
import celebes from './components/boardAsia/celebes.svg';
import cochin from './components/boardAsia/cochin.svg';
import constantinople from './components/boardAsia/constantinople.svg';
import davao from './components/boardAsia/davao.svg';
import delhi from './components/boardAsia/delhi.svg';
import eastAfricaAsia from './components/boardAsia/east_africa.svg';
import egypt from './components/boardAsia/egypt.svg';
import formosa from './components/boardAsia/formosa.svg';
import hongKong from './components/boardAsia/hong_kong.svg';
import hyderabad from './components/boardAsia/hyderabad.svg';
import indianOceanAsia from './components/boardAsia/indian_ocean.svg';
import iraq from './components/boardAsia/iraq.svg';
import irkutsk from './components/boardAsia/irkutsk.svg';
import javaSea from './components/boardAsia/java_sea.svg';
import java from './components/boardAsia/java.svg';
import kyoto from './components/boardAsia/kyoto.svg';
import kyushu from './components/boardAsia/kyushu.svg';
import madras from './components/boardAsia/madras.svg';
import malaysia from './components/boardAsia/malaysia.svg';
import manila from './components/boardAsia/manila.svg';
import mediterraneanSeaAsia from './components/boardAsia/mediterranean_sea.svg';
import mongoliaAsia from './components/boardAsia/mongolia.svg';
import moscowAsia from './components/boardAsia/moscow.svg';
import nepal from './components/boardAsia/nepal.svg';
import newGuinea from './components/boardAsia/new_guinea.svg';
import northKorea from './components/boardAsia/north_korea.svg';
import odessaAsia from './components/boardAsia/odessa.svg';
import okhotskSea from './components/boardAsia/okhotsk_sea.svg';
import omsk from './components/boardAsia/omsk.svg';
import otaru from './components/boardAsia/otaru.svg';
import peking from './components/boardAsia/peking.svg';
import persia from './components/boardAsia/persia.svg';
import sarawak from './components/boardAsia/sarawak.svg';
import seaOfJapanAsia from './components/boardAsia/sea_of_japan.svg';
import shanghaiAsia from './components/boardAsia/shanghai.svg';
import siam from './components/boardAsia/siam.svg';
import sinkiang from './components/boardAsia/sinkiang.svg';
import southChinaSea from './components/boardAsia/south_china_sea.svg';
import southKorea from './components/boardAsia/south_korea.svg';
import sudan from './components/boardAsia/sudan.svg';
import sumatra from './components/boardAsia/sumatra.svg';
import syria from './components/boardAsia/syria.svg';
import timorSea from './components/boardAsia/timor_sea.svg';
import tokyo from './components/boardAsia/tokyo.svg';
import tongking from './components/boardAsia/tongking.svg';
import vladivostokAsia from './components/boardAsia/vladivostok.svg';
import yellowSea from './components/boardAsia/yellow_sea.svg';

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
  imperial2030: {
    adjustments: {
      Beijing: {
        factoryX: 40,
        factoryY: -5,
        flagArmyX: 10,
        labelY: 20,
      },
      Berlin: {
        factoryY: 25,
      },
      'Caribbean Sea': {
        dotX: 40,
        flagFleetX: 40,
        flagFleetY: -10,
        labelX: 10,
        labelY: -10,
      },
      Chongqing: {
        factoryY: -20,
      },
      Fortaleza: {
        factoryY: -20,
        flagFleetX: 8,
        flagFleetY: -10,
      },
      Indonesia: {
        labelX: -20,
      },
      Japan: {
        labelX: 5,
        labelY: 25,
      },
      London: {
        factoryX: 25,
        factoryY: 5,
        labelX: 20,
        labelY: 25,
      },
      Mexico: {
        dotX: -30,
        flagArmyX: -30,
        labelX: -28,
      },
      Moscow: {
        factoryX: 10,
        factoryY: 10,
        flagArmyY: -20,
      },
      Murmansk: {
        factoryY: -30,
      },
      'New Orleans': {
        factoryX: 50,
        factoryY: 20,
        labelX: 10,
        labelY: 15,
      },
      'North Pacific': {
        dotX: -50,
        flagFleetX: -50,
        labelX: -50,
        labelY: 30,
      },
      Peru: {
        labelY: 10,
      },
      'Rio de Janeiro': {
        flagFleetX: 10,
        flagFleetY: -30,
      },
      'Sea of Japan': {
        dotX: 100,
        dotY: 30,
        flagFleetX: 100,
        flagFleetY: 30,
        labelX: 120,
        labelY: 60,
      },
      Shanghai: {
        factoryX: 30,
      },
    },
    nationColors: {
      CN: '#ebe084',
      BR: '#6E8D4E',
      EU: '#54bff9',
      US: '#ef7f72',
      IN: 'silver',
      RU: '#9c6bae',
    },
    seaProvinces: {
      'Caribbean Sea': markRaw(caribbeanSea),
      'Caspian Sea': markRaw(caspianSea),
      'Gulf of Guinea': markRaw(gulfOfGuinea),
      'Indian Ocean': markRaw(indianOcean),
      'Mediterranean Sea': markRaw(mediterraneanSea),
      'Black Sea': markRaw(blackSea2030),
      'North Atlantic': markRaw(northAtlantic),
      'North Pacific': markRaw(northPacific),
      'Sea of Japan': markRaw(seaOfJapan),
      'South Atlantic': markRaw(southAtlantic),
      'South Pacific': markRaw(southPacific),
      'Tasman Sea': markRaw(tasmanSea),
      'China Sea': markRaw(chinaSea),
    },
    landProvinces: {
      Alaska: markRaw(alaska),
      Afghanistan: markRaw(afghanistan),
      Argentina: markRaw(argentina),
      Australia: markRaw(australia),
      Beijing: markRaw(beijing),
      Berlin: markRaw(berlin2030),
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
      London: markRaw(london2030),
      Manaus: markRaw(manaus),
      Moscow: markRaw(moscow2030),
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
      Paris: markRaw(paris2030),
      Quebec: markRaw(quebec),
      'Rio de Janeiro': markRaw(rioDeJaneiro),
      Rome: markRaw(rome2030),
      'San Francisco': markRaw(sanFrancisco),
      Shanghai: markRaw(shanghai),
      'South Africa': markRaw(southAfrica),
      Turkey: markRaw(turkey2030),
      Ukraine: markRaw(ukraine),
      Urumqi: markRaw(urumqi),
      Mexico: markRaw(mexico),
      Mongolia: markRaw(mongolia),
      Peru: markRaw(peru),
      Philippines: markRaw(philippines),
      Vladivostok: markRaw(vladivostok),
      Indochina: markRaw(indochina),
    },
    viewBox: '0 0 1016.371 514.609',
  },
  imperialAsia: {
    adjustments: {},
    nationColors: {
      CN: '#ebe084',
      JP: '#6E8D4E',
      FR: '#54bff9',
      GB: '#ef7f72',
      TR: 'silver',
      RU: '#9c6bae',
    },
    seaProvinces: {
      'Arabian Sea': markRaw(arabianSea),
      'Bay of Bengal': markRaw(bayOfBengal),
      'Caspian Sea': markRaw(caspianSeaAsia),
      'Indian Ocean': markRaw(indianOceanAsia),
      'Java Sea': markRaw(javaSea),
      'Mediterranean Sea': markRaw(mediterraneanSeaAsia),
      'Okhotsk Sea': markRaw(okhotskSea),
      'Sea of Japan': markRaw(seaOfJapanAsia),
      'South China Sea': markRaw(southChinaSea),
      'Timor Sea': markRaw(timorSea),
      'Yellow Sea': markRaw(yellowSea),
    },
    landProvinces: {
      Afghanistan: markRaw(afghanistanAsia),
      Angora: markRaw(angora),
      Arabia: markRaw(arabia),
      Armenia: markRaw(armenia),
      Bengal: markRaw(bengal),
      Bombay: markRaw(bombay),
      Borneo: markRaw(borneo),
      Burma: markRaw(burma),
      Cambodia: markRaw(cambodia),
      Cochin: markRaw(cochin),
      Annam: markRaw(annam),
      Canton: markRaw(canton),
      Celebes: markRaw(celebes),
      Constantinople: markRaw(constantinople),
      Davao: markRaw(davao),
      'East Africa': markRaw(eastAfricaAsia),
      Egypt: markRaw(egypt),
      Formosa: markRaw(formosa),
      'Hong Kong': markRaw(hongKong),
      Hyderabad: markRaw(hyderabad),
      Delhi: markRaw(delhi),
      Iraq: markRaw(iraq),
      Java: markRaw(java),
      Kyoto: markRaw(kyoto),
      Kyushu: markRaw(kyushu),
      Madras: markRaw(madras),
      Malaysia: markRaw(malaysia),
      Manila: markRaw(manila),
      Mongolia: markRaw(mongoliaAsia),
      Nepal: markRaw(nepal),
      'New Guinea': markRaw(newGuinea),
      'North Korea': markRaw(northKorea),
      Budapest: markRaw(budapestAsia),
      Odessa: markRaw(odessaAsia),
      Moscow: markRaw(moscowAsia),
      Omsk: markRaw(omsk),
      Otaru: markRaw(otaru),
      Peking: markRaw(peking),
      Persia: markRaw(persia),
      Sarawak: markRaw(sarawak),
      Shanghai: markRaw(shanghaiAsia),
      Siam: markRaw(siam),
      'South Korea': markRaw(southKorea),
      Sudan: markRaw(sudan),
      Sumatra: markRaw(sumatra),
      Syria: markRaw(syria),
      Tokyo: markRaw(tokyo),
      Akita: markRaw(akita),
      Tongking: markRaw(tongking),
      Sinkiang: markRaw(sinkiang),
      Vladivostok: markRaw(vladivostokAsia),
      Irkutsk: markRaw(irkutsk),
    },
    viewBox: '0 0 900 575',
  },
};

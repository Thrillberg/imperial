import { markRaw } from 'vue';

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
  imperialAsia: {
    adjustments: {
      Akita: {
        factoryX: 5,
        labelY: -3,
      },
      Angora: {
        labelY: -5,
      },
      Annam: {
        factoryX: 35,
        factoryY: 5,
        flagFleetX: 15,
        flagFleetY: 7,
        labelX: 10,
      },
      'Arabian Sea': {
        flagFleetX: 90,
        labelX: 100,
        labelY: 30,
      },
      Armenia: {
        labelY: -5,
      },
      Bengal: {
        factoryY: 15,
        flagArmyY: -15,
      },
      Bombay: {
        factoryX: -5,
        labelX: -5,
        labelY: -7,
      },
      Borneo: {
        factoryY: 20,
      },
      Cambodia: {
        factoryX: 5,
        factoryY: -15,
        flagArmyY: 7,
      },
      Cochin: {
        factoryY: 3,
        labelX: -2,
        labelY: -3,
      },
      Canton: {
        labelY: -10,
      },
      Celebes: {
        factoryX: -30,
      },
      Constantinople: {
        factoryY: 7,
        labelX: 30,
        labelY: -7,
      },
      Davao: {
        labelX: 10,
      },
      Delhi: {
        factoryY: 20,
        flagArmyY: -5,
        labelY: 10,
      },
      Hyderabad: {
        labelY: -20,
      },
      Iraq: {
        factoryX: 40,
        factoryY: 25,
      },
      Irkutsk: {
        factoryX: 50,
      },
      Java: {
        factoryX: -75,
        factoryY: -15,
        labelX: -40,
        labelY: -5,
      },
      Kyoto: {
        factoryX: 7,
        factoryY: 5,
      },
      'Java Sea': {
        dotX: -20,
        dotY: -40,
        flagFleetX: -20,
        flagFleetY: -50,
        labelX: -40,
        labelY: -20,
      },
      'Mediterranean Sea': {
        flagFleetY: 40,
        labelX: 5,
        labelY: 40,
      },
      Mongolia: {
        factoryY: 10,
        flagArmyY: 20,
      },
      Moscow: {
        factoryX: -35,
        flagArmyY: 10,
      },
      'Okhotsk Sea': {
        labelX: 40,
      },
      Omsk: {
        factoryY: 10,
        flagArmyY: 40,
      },
      Otaru: {
        flagFleetY: -10,
        labelY: -10,
      },
      Peking: {
        factoryY: 10,
        flagArmyY: 20,
      },
      'Sea of Japan': {
        labelX: 20,
        labelY: 10,
      },
      Siam: {
        factoryY: 2,
        flagArmyY: 2,
        labelY: -2,
      },
      Sinkiang: {
        factoryY: 10,
        flagArmyY: 20,
      },
      'South China Sea': {
        dotX: -50,
        flagFleetX: -50,
        labelX: -70,
        labelY: 30,
      },
      Syria: {
        flagArmyX: -30,
        flagArmyY: -40,
        labelX: -18,
        labelY: -20,
      },
      'Timor Sea': {
        flagFleetX: 30,
        flagFleetY: -70,
        labelX: 60,
        labelY: -20,
      },
      Tokyo: {
        factoryY: 7,
      },
      Tongking: {
        factoryX: 5,
        factoryY: -15,
        flagArmyX: 5,
        flagArmyY: -15,
      },
      Vladivostok: {
        factoryX: 95,
        labelX: 20,
        labelY: -20,
      },
      'Yellow Sea': {
        labelY: 20,
        labelX: 20,
      },
    },
    nationColors: {
      CN: '#ebe084',
      JP: '#6E8D4E',
      FR: '#54bff9',
      GB: '#ef7f72',
      TR: 'silver',
      RU: '#9c6bae',
      GE: 'white',
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
      Cochin: markRaw(cochin),
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
      Cambodia: markRaw(cambodia),
      Annam: markRaw(annam),
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

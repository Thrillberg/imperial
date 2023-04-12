import { AllBonds2030, Nation2030 } from './constants';

import Player from './Entities/Player';

export default ({ players, provinceNames }) => {
  const out = {
    availableBonds: AllBonds2030(),
    nations: new Map(),
    order: players.map((p) => p.id),
    players: new Map(),
  };

  let cash;
  switch (players.length) {
    case 6:
      cash = 13;
      break;
    case 5:
      cash = 15;
      break;
    case 4:
      cash = 19;
      break;
    case 3:
      cash = 25;
      break;
    case 2:
    default:
      cash = 37;
      break;
  }

  players.forEach(({ id }) => {
    const player = new Player(id);
    player.cash = cash;

    out.players[id] = player;
  });

  for (const n of Nation2030) {
    out.nations.set(n, {
      controller: null,
      treasury: 0,
      rondelPosition: null,
      flagCount: 0,
      powerPoints: 0,
      taxChartPosition: 5,
    });
  }

  const emptyProvinces = () => {
    const provinces = new Map();
    for (const province of provinceNames) {
      provinces.set(province, { armies: 0, fleets: 0, friendly: false });
    }
    return provinces;
  };

  const units = new Map();
  [
    Nation2030.RU,
    Nation2030.CN,
    Nation2030.IN,
    Nation2030.BR,
    Nation2030.US,
    Nation2030.EU,
  ].map(
    (nation) => units.set(nation, emptyProvinces()),
  );
  out.units = units;

  const provinces = new Map();
  const armaments = [
    'chicago',
    'brasilia',
    'paris',
    'moscow',
    'beijing',
    'newdelhi',
  ];
  const shipyard = [
    'neworleans',
    'riodejaneiro',
    'london',
    'vladivostok',
    'shanghai',
    'mumbai',
  ];
  for (const province of provinceNames) {
    let factory = null;
    if (armaments.includes(province)) {
      factory = 'armaments';
    } else if (shipyard.includes(province)) {
      factory = 'shipyard';
    }
    provinces.set(province, { factory });
  }

  const unitLimits = new Map();

  for (const nation of Nation2030) {
    if (nation === Nation2030.CN) {
      unitLimits.set(nation, { armies: 10, fleets: 6 });
    } else if (nation === Nation2030.US) {
      unitLimits.set(nation, { armies: 6, fleets: 10 });
    } else {
      unitLimits.set(nation, { armies: 8, fleets: 8 });
    }
  }

  out.provinces = provinces;
  out.currentNation = Nation2030.RU;
  out.unitLimits = unitLimits;

  return out;
};

import { AllBonds, Nation } from './constants';

import Player from './Entities/Player';

export default ({ players, provinceNames }) => {
  const out = {
    availableBonds: AllBonds(),
    nations: new Map(),
    order: players.map((p) => p.id),
    players: new Map(),
  };

  let cash;
  switch (players.length) {
    case 6:
      cash = 15;
      break;
    case 5:
      cash = 18;
      break;
    case 4:
      cash = 22;
      break;
    case 3:
      cash = 28;
      break;
    case 2:
    default:
      cash = 40;
      break;
  }

  players.forEach(({ id }) => {
    const player = new Player(id);
    player.cash = cash;

    out.players[id] = player;
  });

  for (const n of Nation) {
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
  [Nation.AH, Nation.IT, Nation.FR, Nation.GB, Nation.GE, Nation.RU].map(
    (nation) => units.set(nation, emptyProvinces()),
  );
  out.units = units;

  const provinces = new Map();
  const armaments = ['vienna', 'budapest', 'paris', 'berlin', 'rome', 'moscow'];
  const shipyard = [
    'bordeaux',
    'london',
    'liverpool',
    'hamburg',
    'naples',
    'odessa',
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

  for (const nation of Nation) {
    if (nation === Nation.AH) {
      unitLimits.set(nation, { armies: 10, fleets: 6 });
    } else if (nation === Nation.GB) {
      unitLimits.set(nation, { armies: 6, fleets: 10 });
    } else {
      unitLimits.set(nation, { armies: 8, fleets: 8 });
    }
  }

  out.provinces = provinces;
  out.currentNation = Nation.AH;
  out.unitLimits = unitLimits;

  return out;
};

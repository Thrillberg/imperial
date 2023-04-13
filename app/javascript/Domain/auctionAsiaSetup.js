import { AllBondsAsia, NationAsia } from './constants';

import Player from './Entities/Player';

export default ({ players, provinceNames }) => {
  const out = {
    availableBonds: AllBondsAsia(),
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
      cash = 40;
      break;
    default: break;
  }

  players.forEach(({ id }) => {
    const player = new Player(id);
    player.cash = cash;

    out.players[id] = player;
  });

  for (const n of NationAsia) {
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
    NationAsia.CN,
    NationAsia.JP,
    NationAsia.FR,
    NationAsia.GB,
    NationAsia.TR,
    NationAsia.RU,
    NationAsia.GE,
  ].forEach(
    (nation) => {
      units.set(nation, emptyProvinces());
    },
  );
  out.units = units;

  const provinces = new Map();
  const armaments = [
    'syria',
    'moscow',
    'peking',
    'sinkiang',
    'cambodia',
    'hyderabad',
  ];
  const shipyard = [
    'iraq',
    'odessa',
    'annam',
    'otaru',
    'tokyo',
    'madras',
    'sumatra',
    'borneo',
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

  for (const nation of NationAsia) {
    // Set reasonable limits if anyone complains
    unitLimits.set(nation, { armies: 8, fleets: 8 });
  }

  out.provinces = provinces;
  out.currentNation = NationAsia.CN;
  out.unitLimits = unitLimits;

  return out;
};

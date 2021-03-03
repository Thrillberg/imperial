import { AllBonds, Nation } from "./constants.js";

export default ({ players, provinceNames }) => {
  const out = {
    availableBonds: AllBonds(),
    nations: new Map(),
    order: players.map(p => p.id),
    players: {}
  }

  let cash;
  switch (players.length) {
    case 6:
      cash = 15
      break;
    case 5:
      cash = 18
      break;
    case 4:
      cash = 22
      break;
    case 3:
      cash = 28
      break;
    case 2:
      cash = 40
      break;
  }

  players.forEach(({ id }) => {
    out.players[id] = {
      name: id,
      cash,
      bonds: new Set(),
      rawScore: 0
    }
  });

  for (const n of Nation) {
    out.nations.set(n, {
      controller: null,
      treasury: 0,
      rondelPosition: null,
      flagCount: 0,
      powerPoints: 0,
      taxChartPosition: 5
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
    nation => {
      units.set(nation, emptyProvinces());
    }
  );
  out.units = units;

  const provinces = new Map();
  const armaments = ["vienna", "budapest", "paris", "berlin", "rome", "moscow"];
  const shipyard = [
    "bordeaux",
    "london",
    "liverpool",
    "hamburg",
    "naples",
    "odessa"
  ];
  for (const province of provinceNames) {
    let factory = null;
    if (armaments.includes(province)) {
      factory = "armaments";
    } else if (shipyard.includes(province)) {
      factory = "shipyard";
    }
    provinces.set(province, { factory });
  }
  out.provinces = provinces;
  out.currentNation = Nation.AH;

  return out;
};

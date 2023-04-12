import { AllBonds, Bond, Nation } from './constants';

import Player from './Entities/Player';

const error = (want) => (x) => {
  throw new Error(`got=${x.value}, want=${want}`);
};

export default ({ players, provinceNames }) => {
  const nationAssignments = {
    2: ({ id, nation }) => nation.when({
      AH: () => [
        { id, nation: Nation.AH },
        { id, nation: Nation.FR },
        { id, nation: Nation.GE },
      ],
      IT: () => [
        { id, nation: Nation.IT },
        { id, nation: Nation.RU },
        { id, nation: Nation.GB },
      ],
      FR: error('AH|IT'),
      GB: error('AH|IT'),
      RU: error('AH|IT'),
      GE: error('AH|IT'),
    }),
    3: ({ id, nation }) => nation.when({
      AH: () => [
        { id, nation: Nation.AH },
        { id, nation: Nation.GB },
      ],
      IT: () => [
        { id, nation: Nation.IT },
        { id, nation: Nation.RU },
      ],
      FR: () => [
        { id, nation: Nation.FR },
        { id, nation: Nation.GE },
      ],
      GB: error('AH|IT|FR'),
      RU: error('AH|IT|FR'),
      GE: error('AH|IT|FR'),
    }),
    4: (x) => [x],
    5: (x) => [x],
    6: (x) => [x],
  };

  const out = {
    availableBonds: AllBonds(),
    nations: new Map(),
    order: players.map((p) => p.id),
    players: new Map(),
  };

  /* From the initial nation assignments, distribute bonds to the players. */
  players
    .map(nationAssignments[players.length])
    .flat()
    .forEach(({ id, nation }) => {
      if (out.players[id] === undefined) {
        const player = new Player(id);
        player.cash = 2;

        out.players[id] = player;
      }

      const smallerBondNation = nation.when({
        GE: () => Nation.IT,
        RU: () => Nation.FR,
        AH: () => Nation.GE,
        IT: () => Nation.GB,
        FR: () => Nation.AH,
        GB: () => Nation.RU,
      });

      out.availableBonds.delete(Bond(nation, 4));
      out.availableBonds.delete(Bond(smallerBondNation, 1));
      out.players[id].bonds.add(Bond(nation, 4));
      out.players[id].bonds.add(Bond(smallerBondNation, 1));
    });

  /* Gather bonds as a list of
   *
   *   { nation : Nation , cost : number , number : number }
   *
   * so we can filter by nation, use the cost in our
   * calculation of each nation's treasury, and set the
   * controlling player.
   */

  const purchasedBonds = new Set();
  Object.keys(out.players).forEach((id) => {
    for (const bond of out.players[id].bonds) {
      purchasedBonds.add(bond);
    }
  });

  /* Calculate treasury and controller for each nation */
  for (const n of Nation) {
    /* Find bonds for the given nation, sorted by descending cost */
    const forNation = Array.from(purchasedBonds)
      .filter((b) => b.nation === n)
      .sort(({ cost: aCost }, { cost: bCost }) => {
        if (aCost < bCost) {
          return 1;
        }
        return aCost > bCost ? -1 : 0;
      });

    /* The rules describe in prose this decision table
     *
     *   bonds purchased | controller
     *   ----------------|-----------
     *   none            | none
     *   2               | owner of 2
     *   9               | owner of 9
     *   9, 2            | owner of 9
     *
     * So, we'll set the controller to be the owner of
     * the highest cost bond, or null if there are no
     * bonds.
     */

    const highestBond = forNation[0];
    const highestBondOwner = Object.keys(out.players).find((id) => out.players[id].bonds.has(highestBond)) || null;

    const totalCost = forNation.reduce((sum, { cost }) => sum + cost, 0);

    out.nations.set(n, {
      controller: highestBondOwner,
      treasury: totalCost,
      rondelPosition: null,
      flagCount: 0,
      powerPoints: 0,
      taxChartPosition: 5,
    });

    const AHPlayer = out.nations.get(Nation.AH).controller;
    const AHPlayerIndex = out.order.indexOf(AHPlayer);
    if (AHPlayerIndex === out.order.length - 1) {
      out.investorCardHolder = out.order[0];
    } else {
      out.investorCardHolder = out.order[AHPlayerIndex + 1];
    }
  }

  const emptyProvinces = () => {
    const provinces = new Map();
    for (const province of provinceNames) {
      provinces.set(province, { armies: 0, fleets: 0, friendly: false });
    }
    return provinces;
  };

  const units = new Map();
  [Nation.AH, Nation.IT, Nation.FR, Nation.GB, Nation.GE, Nation.RU].forEach(
    (nation) => {
      units.set(nation, emptyProvinces());
    },
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

import { AllBondsAsia, Bond, NationAsia } from './constants';

import Player from './Entities/Player';

const error = (want) => (x) => {
  throw new Error(`got=${x.value}, want=${want}`);
};

export default ({ players, provinceNames }) => {
  const nationAssignments = {
    2: ({ id, nation }) => nation.when({
      RU: () => [
        { id, nation: NationAsia.RU },
        { id, nation: NationAsia.IN },
        { id, nation: NationAsia.US },
      ],
      CN: () => [
        { id, nation: NationAsia.CN },
        { id, nation: NationAsia.BR },
        { id, nation: NationAsia.EU },
      ],
      IN: error('RU|CN'),
      BR: error('RU|CN'),
      US: error('RU|CN'),
      EU: error('RU|CN'),
    }),
    3: ({ id, nation }) => nation.when({
      RU: () => [
        { id, nation: NationAsia.RU },
        { id, nation: NationAsia.BR },
      ],
      CN: () => [
        { id, nation: NationAsia.CN },
        { id, nation: NationAsia.EU },
      ],
      IN: () => [
        { id, nation: NationAsia.IN },
        { id, nation: NationAsia.US },
      ],
      BR: error('RU|CN|IN'),
      EU: error('RU|CN|IN'),
      US: error('RU|CN|IN'),
    }),
    4: (x) => [x],
    5: (x) => [x],
    6: (x) => [x],
  };

  const out = {
    availableBonds: AllBondsAsia(),
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
        GB: () => NationAsia.RU,
        TR: () => NationAsia.JP,
        JP: () => NationAsia.CN,
        CN: () => NationAsia.GE,
        RU: () => NationAsia.FR,
        FR: () => NationAsia.TR,
        GE: () => NationAsia.GB,
      });

      out.availableBonds.delete(Bond(nation, 4));
      out.availableBonds.delete(Bond(smallerBondNation, 1));
      out.players[id].bonds.add(Bond(nation, 4));
      out.players[id].bonds.add(Bond(smallerBondNation, 1));
    });

  /* Gather bonds as a list of
   *
   *   { nation : Nation2030 , cost : number , number : number }
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
  for (const n of NationAsia) {
    /* Find bonds for the given nation, sorted by descending cost */
    const forNation = Array.from(purchasedBonds)
      .filter((b) => b.nation === n)
      .sort(({ cost: aCost }, { cost: bCost }) => (aCost < bCost ? 1 : aCost > bCost ? -1 : 0)); // eslint-disable-line

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
    const highestBondOwner = Object.keys(out.players).find(
      (id) => out.players[id].bonds.has(highestBond),
    ) || null;

    const totalCost = forNation.reduce((sum, { cost }) => sum + cost, 0);

    out.nations.set(n, {
      controller: highestBondOwner,
      treasury: totalCost,
      rondelPosition: null,
      flagCount: 0,
      powerPoints: 0,
      taxChartPosition: 5,
    });

    const CNPlayer = out.nations.get(NationAsia.CN).controller;
    const CNPlayerIndex = out.order.indexOf(CNPlayer);
    if (CNPlayerIndex === out.order.length - 1) {
      out.investorCardHolder = out.order[0];
    } else {
      out.investorCardHolder = out.order[CNPlayerIndex + 1];
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

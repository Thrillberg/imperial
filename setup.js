import { Nation } from "./constants";

const error = (want) => (x) => {
  throw new Error(`got=${x.value}, want=${want}`);
};

export default ({ players }) => {
  const nationAssignments = {
    3: ({ id, nation }) =>
      nation.when({
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
        GB: error("AH|IT|FR"),
        RU: error("AH|IT|FR"),
        GE: error("AH|IT|FR"),
      }),
    2: ({ id, nation }) =>
      nation.when({
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
        FR: error("AH|IT"),
        GB: error("AH|IT"),
        RU: error("AH|IT"),
        GE: error("AH|IT"),
      }),
    4: (x) => [x],
    5: (x) => [x],
    6: (x) => [x],
  };

  const that = {
    players: {},
    nations: new Map(
      Array.from(Nation).map((n) => [
        n,
        { treasury: 0, controller: null, rondelPosition: null },
      ])
    ),
    order: players.map((p) => p.id),
  };

  players
    .map(nationAssignments[players.length])
    .flat()
    .forEach(({ id, nation }) => {
      that.players[id] = {
        name: id,
        bonds: (that.players[id] || { bonds: [] }).bonds.concat([
          { nation: nation, cost: 9 },
          {
            nation: nation.when({
              GE: () => Nation.IT,
              RU: () => Nation.FR,
              AH: () => Nation.GE,
              IT: () => Nation.GB,
              FR: () => Nation.AH,
              GB: () => Nation.RU,
            }),
            cost: 2,
          },
        ]),
        cash: 2,
      };
    });

  const bonds = Object.getOwnPropertyNames(that.players)
    .map((id) =>
      that.players[id].bonds.map(({ nation, cost }) => ({
        nation,
        cost,
        owner: id,
      }))
    )
    .flat();

  for (const n of Nation) {
    const byNation = bonds
      .filter((b) => b.nation === n)
      .sort(({ cost: aCost }, { cost: bCost }) =>
        aCost < bCost ? 1 : aCost > bCost ? -1 : 0
      );

    that.nations.get(n).controller = (byNation[0] || { owner: null }).owner;
    that.nations.get(n).treasury = byNation.reduce(
      (sum, { cost }) => sum + cost,
      0
    );
  }
  return that;
};

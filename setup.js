import { Nation } from "./constants";

const error = (want) => (x) => {
  throw new Error(`got=${x.value}, want=${want}`);
};

export default ({ players }) => {
  const nationAssignments = {
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
    4: (x) => [x],
    5: (x) => [x],
    6: (x) => [x],
  };

  const out = {
    players: {},
    nations: new Map(),
    order: players.map((p) => p.id),
  };

  /* From the initial nation assignments, distribute bonds to the players. */
  players
    .map(nationAssignments[players.length])
    .flat()
    .forEach(({ id, nation }) => {
      out.players[id] = {
        name: id,
        bonds: (out.players[id] || { bonds: [] }).bonds.concat([
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

  /* Gather bonds as a list of
   *
   *   { nation : Nation , cost : number , owner : Player }
   *
   * so we can filter by nation, use the cost in our
   * calculation of each nation's treasury, and set the
   * controlling player.
   */
  const bonds = Object.getOwnPropertyNames(out.players)
    .map((id) =>
      out.players[id].bonds.map(({ nation, cost }) => ({
        nation,
        cost,
        owner: id,
      }))
    )
    .flat();

  /* Calculate treasury and controller for each nation */
  for (const n of Nation) {
    /* Find bonds for the given nation, sorted by descending cost */
    const forNation = bonds
      .filter((b) => b.nation === n)
      .sort(({ cost: aCost }, { cost: bCost }) =>
        aCost < bCost ? 1 : aCost > bCost ? -1 : 0
      );

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
    const highestBond = forNation[0] || { owner: null };

    const totalCost = forNation.reduce((sum, { cost }) => sum + cost, 0);

    out.nations.set(n, {
      controller: highestBond.owner,
      treasury: totalCost,
      rondelPosition: null,
    });
  }
  return out;
};

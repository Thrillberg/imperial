import Action from "./action.js";
import GameBoard from "./gameBoard.js";
import Imperial from "./imperial.js";
import setup from "./minimalSetup.js";

const cloneUnits = (units) => {
  const out = new Map();
  units.forEach((provinces, nation) => {
    out.set(nation, new Map());
    provinces.forEach((obj, province) => {
      out.get(nation).set(province, Object.assign({}, obj));
    });
  });
  return out;
};

describe("imperial", () => {
  describe("#tick", () => {
    describe("import", () => {
      const board = new GameBoard({
        nodes: [
          { name: "a", nation: "nation" },
          { name: "b", nation: "nation" },
        ],
        edges: [],
      });
      const game = new Imperial(board);
      game.tick(
        Action.initialize({
          players: [
            { id: "player1", nation: "nation" },
            { id: "player2", nation: "nation2" },
          ],
          setup,
        })
      );

      test("import nothing adds no new units", () => {
        const before = cloneUnits(game.units);

        game.tick(Action.blimport([]));

        expect(game.units).toEqual(before);
      });

      test("import one army", () => {
        const expected = cloneUnits(game.units);
        expected.get("nation").get("a").armies++;

        game.tick(Action.blimport([{ province: "a", type: "army" }]));

        expect(game.units).toEqual(expected);
      });

      test("import one army and one fleet", () => {
        const expected = cloneUnits(game.units);
        expected.get("nation").get("a").armies++;
        expected.get("nation").get("a").fleets++;

        game.tick(
          Action.blimport([
            { province: "a", type: "army" },
            { province: "a", type: "fleet" },
          ])
        );

        expect(game.units).toEqual(expected);
      });

      test("import two armies and one fleet", () => {
        const expected = cloneUnits(game.units);
        expected.get("nation").get("a").armies++;
        expected.get("nation").get("b").armies++;
        expected.get("nation").get("a").fleets++;

        game.tick(
          Action.blimport([
            { province: "a", type: "army" },
            { province: "b", type: "army" },
            { province: "a", type: "fleet" },
          ])
        );

        expect(game.units).toEqual(expected);
      });
    });
  });
});

import Action from "./action.js";
import GameBoard from "./gameBoard.js";
import Imperial from "./imperial.js";
import { Nation } from "./constants.js";

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
      const newGame = () => {
        const board = new GameBoard({
          nodes: [
            { name: "a", nation: Nation.AH },
            { name: "b", nation: Nation.AH },
          ],
          edges: [],
        });

        const game = new Imperial(board);
        game.tick(
          Action.initialize({
            players: [
              { id: "player1", nation: Nation.AH },
              { id: "player2", nation: Nation.IT },
            ],
          })
        );
        return game;
      };

      test("import nothing adds no new units", () => {
        const game = newGame();
        const beforeUnits = cloneUnits(game.units);
        expect(game.nations.get(Nation.AH).treasury).toEqual(11);

        game.tick(Action.import([]));

        expect(game.units).toEqual(beforeUnits);
        expect(game.nations.get(Nation.AH).treasury).toEqual(11);
      });

      test("import one army", () => {
        const game = newGame();
        const expected = cloneUnits(game.units);
        expected.get(Nation.AH).get("a").armies++;
        expect(game.nations.get(Nation.AH).treasury).toEqual(11);

        game.tick(Action.import([{ province: "a", type: "army" }]));

        expect(game.units).toEqual(expected);
        expect(game.nations.get(Nation.AH).treasury).toEqual(10);
      });

      test("import one army and one fleet", () => {
        const game = newGame();
        const expected = cloneUnits(game.units);
        expected.get(Nation.AH).get("a").armies++;
        expected.get(Nation.AH).get("a").fleets++;

        expect(game.nations.get(Nation.AH).treasury).toEqual(11);

        game.tick(
          Action.import([
            { province: "a", type: "army" },
            { province: "a", type: "fleet" },
          ])
        );

        expect(game.units).toEqual(expected);
        expect(game.nations.get(Nation.AH).treasury).toEqual(9);
      });

      test("import two armies and one fleet", () => {
        const game = newGame();
        const expected = cloneUnits(game.units);
        expected.get(Nation.AH).get("a").armies++;
        expected.get(Nation.AH).get("b").armies++;
        expected.get(Nation.AH).get("a").fleets++;
        expect(game.nations.get(Nation.AH).treasury).toEqual(11);

        game.tick(
          Action.import([
            { province: "a", type: "army" },
            { province: "b", type: "army" },
            { province: "a", type: "fleet" },
          ])
        );

        expect(game.units).toEqual(expected);
        expect(game.nations.get(Nation.AH).treasury).toEqual(8);
      });
    });

    describe("rondel", () => {
      describe("maneuver1 or manuever2", () => {
        const newGame = () => {
          const board = new GameBoard({
            nodes: [
              { name: "a", nation: null, isOcean: true },
              { name: "b", nation: null, isOcean: true },
              { name: "c", nation: null },
              { name: "d", nation: null },
            ],
            edges: [
              ["a", "b"],
              ["c", "d"],
              ["b", "c"],
            ],
          });

          const game = new Imperial(board);
          game.tick(
            Action.initialize({
              players: [
                { id: "player1", nation: Nation.AH },
                { id: "player2", nation: Nation.IT },
              ],
            })
          );
          return game;
        };

        ["maneuver1", "maneuver2"].forEach((maneuver) => {
          test("nation has no units", () => {
            const game = newGame();

            game.tick(
              Action.rondel({ slot: maneuver, nation: Nation.AH, cost: 0 })
            );

            expect(game.availableActions).toEqual(
              new Set([Action.endManeuver()])
            );
          });

          test("nation has one fleet that can go to one destination", () => {
            const game = newGame();
            game.units.get(Nation.AH).get("a").fleets++;

            game.tick(
              Action.rondel({ slot: maneuver, nation: Nation.AH, cost: 0 })
            );

            expect(game.availableActions).toEqual(
              new Set([
                Action.endManeuver(),
                Action.maneuver({
                  origin: "a",
                  destination: "b",
                }),
              ])
            );
          });

          test("nation can skip fleets and move armies", () => {
            const game = newGame();
            game.units.get(Nation.AH).get("a").fleets++;
            game.units.get(Nation.AH).get("c").armies++;

            game.tick(
              Action.rondel({ slot: maneuver, nation: Nation.AH, cost: 0 })
            );

            expect(game.availableActions).toEqual(
              new Set([
                Action.endManeuver(),
                Action.maneuver({
                  origin: "a",
                  destination: "b",
                }),
                Action.maneuver({
                  origin: "c",
                  destination: "d",
                }),
              ])
            );
          });
        });
      });
    });
  });
});

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

const newGame = () => {
  const board = new GameBoard({
    nodes: [
      { name: "a", nation: "nation" },
      { name: "b", nation: "nation" },
      { name: "c", nation: null },
      { name: "d", nation: null, isOcean: true },
    ],
    edges: [
      ["a", "b"],
      ["b", "c"],
      ["a", "d"],
    ],
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
  return game;
};

describe("imperial", () => {
  describe("#tick", () => {
    describe("import", () => {
      test("import nothing adds no new units", () => {
        const game = newGame();
        const beforeUnits = cloneUnits(game.units);
        const beforeTreasury = 13;

        game.tick(Action.import([]));

        expect(game.units).toEqual(beforeUnits);
        expect(game.nations.get("nation").treasury).toEqual(beforeTreasury);
      });

      test("import one army", () => {
        const game = newGame();
        const expected = cloneUnits(game.units);
        expected.get("nation").get("a").armies++;
        const expectedTreasury = 12;

        game.tick(Action.import([{ province: "a", type: "army" }]));

        expect(game.units).toEqual(expected);
        expect(game.nations.get("nation").treasury).toEqual(expectedTreasury);
      });

      test("import one army and one fleet", () => {
        const game = newGame();
        const expected = cloneUnits(game.units);
        expected.get("nation").get("a").armies++;
        expected.get("nation").get("a").fleets++;
        const expectedTreasury = 11;

        game.tick(
          Action.import([
            { province: "a", type: "army" },
            { province: "a", type: "fleet" },
          ])
        );

        expect(game.units).toEqual(expected);
        expect(game.nations.get("nation").treasury).toEqual(expectedTreasury);
      });

      test("import two armies and one fleet", () => {
        const game = newGame();
        const expected = cloneUnits(game.units);
        expected.get("nation").get("a").armies++;
        expected.get("nation").get("b").armies++;
        expected.get("nation").get("a").fleets++;
        const expectedTreasury = 10;

        game.tick(
          Action.import([
            { province: "a", type: "army" },
            { province: "b", type: "army" },
            { province: "a", type: "fleet" },
          ])
        );

        expect(game.units).toEqual(expected);
        expect(game.nations.get("nation").treasury).toEqual(expectedTreasury);
      });
    });

    describe("maneuver", () => {
      test("maneuver with no units", () => {
        const game = newGame();
        const expected = cloneUnits(game.units);

        game.tick(Action.maneuver([]));

        expect(game.units).toEqual(expected);
      });

      test("maneuver with one army and no resistance", () => {
        const game = newGame();
        game.units.get("nation").get("a").armies++;
        const expected = cloneUnits(game.units);
        expected.get("nation").get("a").armies--;
        expected.get("nation").get("c").armies++;

        game.tick(
          Action.maneuver([
            { origin: "a", destination: "c", nation: "nation", type: "army" },
          ])
        );

        expect(game.units).toEqual(expected);
        expect(game.provinces.get("c").flag).toEqual("nation");
      });

      test("maneuver with an army and a fleet, where the army meets resistance", () => {
        const game = newGame();
        game.units.get("nation").get("a").armies++;
        game.units.get("nation").get("a").fleets++;
        game.units.get("nation2").get("c").armies++;
        game.provinces.get("c").flag = "nation2";
        const expected = cloneUnits(game.units);
        expected.get("nation").get("a").armies--;
        expected.get("nation").get("c").armies++;
        expected.get("nation").get("a").fleets--;
        expected.get("nation").get("d").fleets++;

        game.tick(
          Action.maneuver([
            { origin: "a", destination: "c", nation: "nation", type: "army" },
            { origin: "a", destination: "d", nation: "nation", type: "fleet" },
          ])
        );

        expect(game.units).toEqual(expected);
        expect(game.provinces.get("c").flag).toEqual("nation2");
      });
    });
  });
});

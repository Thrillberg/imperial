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

const rondelActions = new Set();
[
  "factory",
  "production1",
  "maneuver1",
  "investor",
  "import",
  "production2",
  "maneuver2",
  "taxation",
].forEach((slot) => {
  rondelActions.add(Action.rondel({ slot, cost: 0, nation: "nation" }));
});

const newGame = () => {
  const board = new GameBoard({
    nodes: [
      { name: "a", nation: "nation" },
      { name: "b", nation: "nation" },
      { name: "c", nation: null },
      { name: "d", nation: null, isOcean: true },
      { name: "e", nation: null },
      { name: "f", nation: null },
      { name: "g", nation: null, isOcean: true },
      { name: "h", nation: null, isOcean: true },
      { name: "i", nation: null, isOcean: true },
      { name: "j", nation: null, isOcean: true },
    ],
    edges: [
      ["a", "b"],
      ["b", "c"],
      ["a", "d"],
      ["e", "f"],
      ["d", "g"],
      ["d", "h"],
      ["i", "j"],
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

    describe("rondel", () => {
      describe("maneuver1 and maneuver2", () => {
        test("when nation has no units, there are no available actions", () => {
          ["maneuver1", "maneuver2"].forEach((maneuver) => {
            const game = newGame();
            game.tick(
              Action.rondel({ slot: maneuver, cost: 0, nation: "nation" })
            );

            expect(game.availableActions).toEqual(
              new Set([Action.maneuver([])])
            );
          });
        });

        test("nation can maneuver one army to two possible destinations", () => {
          ["maneuver1", "maneuver2"].forEach((maneuver) => {
            const game = newGame();
            game.units.get("nation").get("a").armies++;
            game.tick(
              Action.rondel({ slot: maneuver, cost: 0, nation: "nation" })
            );

            expect(game.availableActions).toEqual(
              new Set([
                Action.maneuver([
                  {
                    origin: "a",
                    destination: "b",
                    nation: "nation",
                    type: "army",
                  },
                ]),
                Action.maneuver([
                  {
                    origin: "a",
                    destination: "c",
                    nation: "nation",
                    type: "army",
                  },
                ]),
                Action.maneuver([]),
              ])
            );
          });
        });

        test("nation can maneuver two armies to one possible destination", () => {
          ["maneuver1", "maneuver2"].forEach((maneuver) => {
            const game = newGame();
            game.units.get("nation").get("e").armies++;
            game.units.get("nation").get("f").armies++;
            game.tick(
              Action.rondel({ slot: maneuver, cost: 0, nation: "nation" })
            );

            expect(game.availableActions).toEqual(
              new Set([
                Action.maneuver([
                  {
                    origin: "e",
                    destination: "f",
                    nation: "nation",
                    type: "army",
                  },
                ]),
                Action.maneuver([
                  {
                    origin: "f",
                    destination: "e",
                    nation: "nation",
                    type: "army",
                  },
                ]),
                Action.maneuver([
                  {
                    origin: "e",
                    destination: "f",
                    nation: "nation",
                    type: "army",
                  },
                  {
                    origin: "f",
                    destination: "e",
                    nation: "nation",
                    type: "army",
                  },
                ]),
                Action.maneuver([]),
              ])
            );
          });
        });

        test("nation can maneuver two armies to two possible destinations", () => {
          ["maneuver1", "maneuver2"].forEach((maneuver) => {
            const game = newGame();
            game.units.get("nation").get("a").armies++;
            game.units.get("nation").get("b").armies++;
            game.tick(
              Action.rondel({ slot: maneuver, cost: 0, nation: "nation" })
            );

            expect(game.availableActions).toEqual(
              new Set([
                Action.maneuver([
                  {
                    origin: "a",
                    destination: "b",
                    nation: "nation",
                    type: "army",
                  },
                ]),
                Action.maneuver([
                  {
                    origin: "b",
                    destination: "a",
                    nation: "nation",
                    type: "army",
                  },
                ]),
                Action.maneuver([
                  {
                    origin: "a",
                    destination: "c",
                    nation: "nation",
                    type: "army",
                  },
                ]),
                Action.maneuver([
                  {
                    origin: "b",
                    destination: "c",
                    nation: "nation",
                    type: "army",
                  },
                ]),
                Action.maneuver([
                  {
                    origin: "a",
                    destination: "b",
                    nation: "nation",
                    type: "army",
                  },
                  {
                    origin: "b",
                    destination: "a",
                    nation: "nation",
                    type: "army",
                  },
                ]),
                Action.maneuver([
                  {
                    origin: "a",
                    destination: "c",
                    nation: "nation",
                    type: "army",
                  },
                  {
                    origin: "b",
                    destination: "a",
                    nation: "nation",
                    type: "army",
                  },
                ]),
                Action.maneuver([
                  {
                    origin: "a",
                    destination: "b",
                    nation: "nation",
                    type: "army",
                  },
                  {
                    origin: "b",
                    destination: "c",
                    nation: "nation",
                    type: "army",
                  },
                ]),
                Action.maneuver([
                  {
                    origin: "a",
                    destination: "c",
                    nation: "nation",
                    type: "army",
                  },
                  {
                    origin: "b",
                    destination: "c",
                    nation: "nation",
                    type: "army",
                  },
                ]),
                Action.maneuver([]),
              ])
            );
          });
        });

        test("nation can maneuver one fleet to two possible destinations", () => {
          ["maneuver1", "maneuver2"].forEach((maneuver) => {
            const game = newGame();
            game.units.get("nation").get("d").fleets++;
            game.tick(
              Action.rondel({ slot: maneuver, cost: 0, nation: "nation" })
            );

            expect(game.availableActions).toEqual(
              new Set([
                Action.maneuver([
                  {
                    origin: "d",
                    destination: "g",
                    nation: "nation",
                    type: "fleet",
                  },
                ]),
                Action.maneuver([
                  {
                    origin: "d",
                    destination: "h",
                    nation: "nation",
                    type: "fleet",
                  },
                ]),
                Action.maneuver([]),
              ])
            );
          });
        });

        test("nation can maneuver two fleets to one possible destination", () => {
          ["maneuver1", "maneuver2"].forEach((maneuver) => {
            const game = newGame();
            game.units.get("nation").get("i").fleets++;
            game.units.get("nation").get("j").fleets++;
            game.tick(
              Action.rondel({ slot: maneuver, cost: 0, nation: "nation" })
            );

            expect(game.availableActions).toEqual(
              new Set([
                Action.maneuver([
                  {
                    origin: "i",
                    destination: "j",
                    nation: "nation",
                    type: "fleet",
                  },
                ]),
                Action.maneuver([
                  {
                    origin: "j",
                    destination: "i",
                    nation: "nation",
                    type: "fleet",
                  },
                ]),
                Action.maneuver([
                  {
                    origin: "i",
                    destination: "j",
                    nation: "nation",
                    type: "fleet",
                  },
                  {
                    origin: "j",
                    destination: "i",
                    nation: "nation",
                    type: "fleet",
                  },
                ]),
                Action.maneuver([]),
              ])
            );
          });
        });

        test("nation can maneuver one fleet to one destination and one army to two destinations", () => {
          ["maneuver1", "maneuver2"].forEach((maneuver) => {
            const game = newGame();
            game.units.get("nation").get("j").fleets++;
            game.units.get("nation").get("a").armies++;
            game.tick(
              Action.rondel({ slot: maneuver, cost: 0, nation: "nation" })
            );

            expect(game.availableActions).toEqual(
              new Set([
                Action.maneuver([
                  {
                    origin: "a",
                    destination: "b",
                    nation: "nation",
                    type: "army",
                  },
                ]),
                Action.maneuver([
                  {
                    origin: "a",
                    destination: "c",
                    nation: "nation",
                    type: "army",
                  },
                ]),
                Action.maneuver([
                  {
                    origin: "j",
                    destination: "i",
                    nation: "nation",
                    type: "fleet",
                  },
                ]),
                Action.maneuver([
                  {
                    origin: "j",
                    destination: "i",
                    nation: "nation",
                    type: "fleet",
                  },
                  {
                    origin: "a",
                    destination: "b",
                    nation: "nation",
                    type: "army",
                  },
                ]),
                Action.maneuver([
                  {
                    origin: "j",
                    destination: "i",
                    nation: "nation",
                    type: "fleet",
                  },
                  {
                    origin: "a",
                    destination: "c",
                    nation: "nation",
                    type: "army",
                  },
                ]),
                Action.maneuver([]),
              ])
            );
          });
        });
      });
    });
  });
});

import Action from "./action.js";
import GameBoard from "./gameBoard.js";
import Imperial from "./imperial.js";
import { Bond, Nation } from "./constants.js";

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
    describe("bondPurchase", () => {
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

      test("player purchases a bond outright", () => {
        const game = newGame();
        // Empty out player's bonds
        game.players["player1"].bonds = new Set();
        // Give player enough cash to afford a bond
        game.players["player1"].cash = 4;

        game.tick(
          Action.bondPurchase({ player: "player1", cost: 4, nation: Nation.IT })
        );

        expect(game.players["player1"].bonds).toEqual(
          new Set([Bond(Nation.IT, 2)])
        );
      });

      test("player purchases a bond by trading one in", () => {
        const game = newGame();
        // Give player one bond to trade in
        game.players["player1"].bonds = new Set([Bond(Nation.AH, 1)]);

        game.tick(
          Action.bondPurchase({ player: "player1", cost: 4, nation: Nation.AH })
        );

        expect(game.players["player1"].bonds).toEqual(
          new Set([Bond(Nation.AH, 2)])
        );
      });

      test("purchasing a bond can grant control of the nation", () => {
        const game = newGame();
        game.players["player1"].bonds = new Set();
        game.players["player1"].cash = 4;
        // Nobody controls Italy
        game.nations.get(Nation.IT).controller = null;

        game.tick(
          Action.bondPurchase({ player: "player1", cost: 4, nation: Nation.IT })
        );

        expect(game.nations.get(Nation.IT).controller).toEqual("player1");
      });
    });

    describe("endManeuver", () => {
      const newGame = () => {
        const board = new GameBoard({
          nodes: [],
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

      test("it is IT's turn to select a rondel slot", () => {
        const game = newGame();
        const expected = new Set();
        ["investor", "import", "production2"].forEach((slot) => {
          expected.add(Action.rondel({ nation: Nation.IT, cost: 0, slot }));
        });
        expected.add(
          Action.rondel({ nation: Nation.IT, cost: 2, slot: "maneuver2" })
        );
        expected.add(
          Action.rondel({ nation: Nation.IT, cost: 4, slot: "taxation" })
        );
        expected.add(
          Action.rondel({ nation: Nation.IT, cost: 6, slot: "factory" })
        );

        game.nations.get(Nation.IT).rondelPosition = "maneuver1";
        game.tick(
          Action.rondel({ slot: "maneuver1", cost: 0, nation: Nation.AH })
        );
        game.tick(Action.endManeuver());

        expect(game.availableActions).toEqual(expected);
      });
    });

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

        game.tick(Action.import({ placements: [] }));

        expect(game.units).toEqual(beforeUnits);
        expect(game.nations.get(Nation.AH).treasury).toEqual(11);
      });

      test("import one army", () => {
        const game = newGame();
        const expected = cloneUnits(game.units);
        expected.get(Nation.AH).get("a").armies++;
        expect(game.nations.get(Nation.AH).treasury).toEqual(11);

        game.tick(
          Action.import({ placements: [{ province: "a", type: "army" }] })
        );

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
          Action.import({
            placements: [
              { province: "a", type: "army" },
              { province: "a", type: "fleet" },
            ],
          })
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
          Action.import({
            placements: [
              { province: "a", type: "army" },
              { province: "b", type: "army" },
              { province: "a", type: "fleet" },
            ],
          })
        );

        expect(game.units).toEqual(expected);
        expect(game.nations.get(Nation.AH).treasury).toEqual(8);
      });
    });

    describe("initialize", () => {
      const newGame = () => {
        const board = new GameBoard({
          nodes: [],
          edges: [],
        });

        const game = new Imperial(board);
        return game;
      };

      test("it is AH's turn to select a rondel slot", () => {
        const game = newGame();

        game.tick(
          Action.initialize({
            players: [
              { id: "player1", nation: Nation.AH },
              { id: "player2", nation: Nation.IT },
            ],
          })
        );

        expect(game.availableActions).toEqual(
          new Set(
            [
              "factory",
              "production1",
              "maneuver1",
              "investor",
              "import",
              "production2",
              "maneuver2",
              "taxation",
            ].map((slot) => Action.rondel({ nation: Nation.AH, cost: 0, slot }))
          )
        );
      });
    });

    describe("rondel", () => {
      describe("import", () => {
        const newGame = () => {
          const board = new GameBoard({
            nodes: [
              { name: "a", nation: Nation.AH },
              { name: "b", nation: Nation.AH },
              { name: "c", nation: Nation.AH },
              { name: "d", nation: Nation.AH },
              { name: "e", nation: Nation.AH },
              { name: "f", nation: null },
              { name: "g", nation: Nation.IT },
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

        test("sets the correct available actions", () => {
          const game = newGame();
          const availableActions = new Set([Action.import({ placements: [] })]);
          ["a", "b", "c", "d", "e"].forEach((province) => {
            availableActions.add(
              Action.import({ placements: [{ province, type: "army" }] })
            );

            ["a", "b", "c", "d", "e"].forEach((province2) => {
              if (province2 === province) return;

              availableActions.add(
                Action.import({
                  placements: [
                    { province, type: "army" },
                    { province: province2, type: "army" },
                  ],
                })
              );

              ["a", "b", "c", "d", "e"].forEach((province3) => {
                if (province === province3 || province2 === province3) return;

                availableActions.add(
                  Action.import({
                    placements: [
                      { province, type: "army" },
                      { province: province2, type: "army" },
                      { province: province3, type: "army" },
                    ],
                  })
                );
              });
            });
          });

          game.tick(
            Action.rondel({ slot: "import", cost: 0, nation: Nation.AH })
          );

          expect(game.availableActions).toEqual(availableActions);
          expect(game.nations.get(Nation.AH).rondelPosition).toEqual("import");
        });

        test.todo("fleets");
      });

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

      describe("production1 or production2", () => {
        const newGame = () => {
          const board = new GameBoard({
            nodes: [{ name: "a", nation: Nation.AH }],
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

        ["production1", "production2"].forEach((production) => {
          test("it is IT's turn to select a rondel slot", () => {
            const game = newGame();
            const expected = new Set();
            ["factory", "production1", "maneuver1"].forEach((slot) => {
              expected.add(Action.rondel({ nation: Nation.IT, cost: 0, slot }));
            });
            expected.add(
              Action.rondel({ nation: Nation.IT, cost: 2, slot: "investor" })
            );
            expected.add(
              Action.rondel({ nation: Nation.IT, cost: 4, slot: "import" })
            );
            expected.add(
              Action.rondel({ nation: Nation.IT, cost: 6, slot: "production2" })
            );
            game.nations.get(Nation.IT).rondelPosition = "taxation";

            game.tick(
              Action.rondel({ slot: production, cost: 0, nation: Nation.AH })
            );

            expect(game.availableActions).toEqual(expected);
          });
        });
      });
    });

    describe("maneuver", () => {
      const newGame = () => {
        const board = new GameBoard({
          nodes: [
            { name: "a", nation: null, isOcean: true },
            { name: "b", nation: null, isOcean: true },
            { name: "c", nation: Nation.AH },
            { name: "d", nation: Nation.AH },
            { name: "e", nation: null },
          ],
          edges: [
            ["a", "b"],
            ["c", "d"],
            ["a", "d"],
            ["a", "e"],
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

      describe("nation controls one fleet", () => {
        test("maneuver fleet to vacant destination moves the fleet", () => {
          const game = newGame();
          game.units.get(Nation.AH).get("a").fleets++;

          game.tick(
            Action.rondel({ slot: "maneuver1", nation: Nation.AH, cost: 0 })
          );
          game.tick(Action.maneuver({ origin: "a", destination: "b" }));

          expect(game.units.get(Nation.AH).get("a").fleets).toEqual(0);
          expect(game.units.get(Nation.AH).get("b").fleets).toEqual(1);
          expect(game.currentNation).toEqual(Nation.IT);
          expect(game.availableActions).toEqual(
            new Set(
              [
                "factory",
                "production1",
                "maneuver1",
                "investor",
                "import",
                "production2",
                "maneuver2",
                "taxation",
              ].map((slot) =>
                Action.rondel({ nation: Nation.IT, cost: 0, slot })
              )
            )
          );
        });

        test("maneuver fleet to occupied destination allows occupier to decide whether to fight", () => {
          const game = newGame();
          game.units.get(Nation.AH).get("a").fleets++;
          game.units.get(Nation.IT).get("b").fleets++;

          game.tick(
            Action.rondel({ slot: "maneuver1", nation: Nation.AH, cost: 0 })
          );
          game.tick(Action.maneuver({ origin: "a", destination: "b" }));

          expect(game.availableActions).toEqual(
            new Set([
              Action.coexist({
                province: "b",
                incumbent: Nation.IT,
                challenger: Nation.AH,
              }),
              Action.fight({
                province: "b",
                incumbent: Nation.IT,
                challenger: Nation.AH,
              }),
            ])
          );
        });
      });

      describe("nation controls two fleets", () => {
        test("maneuver one fleet allows the other to be maneuvered", () => {
          const game = newGame();
          game.units.get(Nation.AH).get("a").fleets++;
          game.units.get(Nation.AH).get("b").fleets++;

          game.tick(
            Action.rondel({ slot: "maneuver1", nation: Nation.AH, cost: 0 })
          );
          game.tick(Action.maneuver({ origin: "a", destination: "b" }));

          expect(game.units.get(Nation.AH).get("a").fleets).toEqual(0);
          expect(game.units.get(Nation.AH).get("b").fleets).toEqual(2);
          expect(game.availableActions).toEqual(
            new Set([
              Action.endManeuver(),
              Action.maneuver({ origin: "b", destination: "a" }),
            ])
          );
        });
      });

      describe("nation controls one army", () => {
        test("maneuver army to vacant destination moves the army", () => {
          const game = newGame();
          game.units.get(Nation.AH).get("c").armies++;

          game.tick(
            Action.rondel({ slot: "maneuver1", nation: Nation.AH, cost: 0 })
          );
          game.tick(Action.maneuver({ origin: "c", destination: "d" }));

          expect(game.units.get(Nation.AH).get("c").armies).toEqual(0);
          expect(game.units.get(Nation.AH).get("d").armies).toEqual(1);
          expect(game.currentNation).toEqual(Nation.IT);
          expect(game.availableActions).toEqual(
            new Set(
              [
                "factory",
                "production1",
                "maneuver1",
                "investor",
                "import",
                "production2",
                "maneuver2",
                "taxation",
              ].map((slot) =>
                Action.rondel({ nation: Nation.IT, cost: 0, slot })
              )
            )
          );
        });

        test("maneuver army to occupied destination allows occupier to decide whether to fight", () => {
          const game = newGame();
          game.units.get(Nation.AH).get("c").armies++;
          game.units.get(Nation.IT).get("d").armies++;

          game.tick(
            Action.rondel({ slot: "maneuver1", nation: Nation.AH, cost: 0 })
          );
          game.tick(Action.maneuver({ origin: "c", destination: "d" }));

          expect(game.availableActions).toEqual(
            new Set([
              Action.coexist({
                province: "d",
                incumbent: Nation.IT,
                challenger: Nation.AH,
              }),
              Action.fight({
                province: "d",
                incumbent: Nation.IT,
                challenger: Nation.AH,
              }),
            ])
          );
        });
      });

      describe("nation controls two armies", () => {
        test("maneuver one army allows the other to be maneuvered", () => {
          const game = newGame();
          game.units.get(Nation.AH).get("c").armies++;
          game.units.get(Nation.AH).get("d").armies++;

          game.tick(
            Action.rondel({ slot: "maneuver1", nation: Nation.AH, cost: 0 })
          );
          game.tick(Action.maneuver({ origin: "c", destination: "d" }));

          expect(game.units.get(Nation.AH).get("c").armies).toEqual(0);
          expect(game.units.get(Nation.AH).get("d").armies).toEqual(2);
          expect(game.availableActions).toEqual(
            new Set([
              Action.endManeuver(),
              Action.maneuver({ origin: "d", destination: "c" }),
            ])
          );
        });

        test("both armies are in the same origin province", () => {
          const game = newGame();
          game.units.get(Nation.AH).get("c").armies++;
          game.units.get(Nation.AH).get("c").armies++;

          game.tick(
            Action.rondel({ slot: "maneuver1", nation: Nation.AH, cost: 0 })
          );
          game.tick(Action.maneuver({ origin: "c", destination: "d" }));

          expect(game.units.get(Nation.AH).get("c").armies).toEqual(1);
          expect(game.units.get(Nation.AH).get("d").armies).toEqual(1);
          expect(game.availableActions).toEqual(
            new Set([
              Action.endManeuver(),
              Action.maneuver({ origin: "c", destination: "d" }),
            ])
          );
        });
      });

      describe("nation controls one fleet and one army", () => {
        test("fleet maneuver allows the army to maneuver", () => {
          const game = newGame();
          game.units.get(Nation.AH).get("a").fleets++;
          game.units.get(Nation.AH).get("c").armies++;

          game.tick(
            Action.rondel({ slot: "maneuver1", nation: Nation.AH, cost: 0 })
          );
          game.tick(Action.maneuver({ origin: "a", destination: "b" }));

          expect(game.availableActions).toEqual(
            new Set([
              Action.endManeuver(),
              Action.maneuver({ origin: "c", destination: "d" }),
            ])
          );
        });

        test("army maneuver does not allow the fleet to maneuver", () => {
          const game = newGame();
          game.units.get(Nation.AH).get("a").fleets++;
          game.units.get(Nation.AH).get("c").armies++;

          game.tick(
            Action.rondel({ slot: "maneuver1", nation: Nation.AH, cost: 0 })
          );
          game.tick(Action.maneuver({ origin: "c", destination: "d" }));

          expect(game.currentNation).toEqual(Nation.IT);
          expect(game.availableActions).toEqual(
            new Set(
              [
                "factory",
                "production1",
                "maneuver1",
                "investor",
                "import",
                "production2",
                "maneuver2",
                "taxation",
              ].map((slot) =>
                Action.rondel({ nation: Nation.IT, cost: 0, slot })
              )
            )
          );
        });

        test("fleet can convoy the army", () => {
          const game = newGame();
          game.units.get(Nation.AH).get("b").fleets++;
          game.units.get(Nation.AH).get("d").armies++;

          game.tick(
            Action.rondel({ slot: "maneuver1", nation: Nation.AH, cost: 0 })
          );

          expect(game.availableActions).toEqual(
            new Set([
              Action.endManeuver(),
              Action.maneuver({ origin: "b", destination: "a" }),
              Action.maneuver({ origin: "d", destination: "c" }),
            ])
          );

          game.tick(Action.maneuver({ origin: "b", destination: "a" }));

          expect(game.availableActions).toEqual(
            new Set([
              Action.endManeuver(),
              Action.maneuver({ origin: "d", destination: "e" }),
              Action.maneuver({ origin: "d", destination: "c" }),
            ])
          );
        });
      });
    });
  });
});

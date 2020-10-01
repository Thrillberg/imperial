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
        game.investorCardHolder = "player1";

        game.tick(
          Action.rondel({ nation: Nation.AH, cost: 0, slot: "investor" })
        );
        game.tick(
          Action.bondPurchase({ player: "player1", cost: 4, nation: Nation.IT })
        );

        expect(game.players["player1"].bonds).toEqual(
          new Set([Bond(Nation.IT, 2)])
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
            ].map((slot) => Action.rondel({ nation: Nation.IT, cost: 0, slot }))
          )
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
          nodes: [{ name: "a" }],
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
        game.units.get(Nation.AH).get("a").armies = 1;

        game.nations.get(Nation.IT).rondelPosition = "maneuver1";
        game.tick(
          Action.rondel({ slot: "maneuver1", cost: 0, nation: Nation.AH })
        );
        game.tick(Action.endManeuver());

        expect(game.availableActions).toEqual(expected);
        expect(game.unitsToMove).toEqual([]);
      });
    });

    describe("endGame", () => {
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

      test("winner is set", () => {
        const game = newGame();
        game.nations.get(Nation.AH).powerPoints = 25;
        game.nations.get(Nation.IT).powerPoints = 15;
        game.players["player1"].bonds = new Set([
          Bond(Nation.AH, 5),
          Bond(Nation.IT, 2),
        ]);
        game.players["player2"].bonds = new Set([
          Bond(Nation.AH, 2),
          Bond(Nation.IT, 5),
        ]);
        game.players["player1"].cash = 2;
        game.players["player2"].cash = 10;

        game.tick(Action.endGame());

        // player1 has AH bond 5 * 5 (powerPoints) + IT bond 2 * 3 (powerPoints) + 2 cash
        // player1 has 33 points
        // player2 has AH bond 2 * 5 (powerPoints) + IT bond 5 * 3 (powerPoints) + 10 cash
        // player2 has 35 points
        expect(game.winner).toEqual("player2");
      });

      test.todo("it can handle a tie");
    });

    describe("buildFactory", () => {
      const newGame = () => {
        const board = new GameBoard({
          nodes: [{ name: "a", nation: Nation.AH, factoryType: "armaments" }],
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

      describe("AH builds a factory", () => {
        const game = newGame();

        game.tick(
          Action.rondel({ nation: Nation.AH, cost: 0, slot: "factory" })
        );
        game.tick(Action.buildFactory({ province: "a" }));

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
            ].map((slot) => Action.rondel({ nation: Nation.IT, cost: 0, slot }))
          )
        );
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
            ].map((slot) => Action.rondel({ nation: Nation.IT, cost: 0, slot }))
          )
        );
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
      describe("slots that cost money", () => {
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

        test("a free slot does not deduct any money", () => {
          const game = newGame();

          expect(game.nations.get(Nation.AH).treasury).toEqual(11);

          game.tick(
            Action.rondel({ slot: "factory", cost: 0, nation: Nation.AH })
          );

          expect(game.nations.get(Nation.AH).treasury).toEqual(11);
        });
        test("a slot can deduct 3 million", () => {
          const game = newGame();

          game.players["player1"].cash = 3;

          game.tick(
            Action.rondel({ slot: "factory", cost: 3, nation: Nation.AH })
          );

          expect(game.players["player1"].cash).toEqual(0);
        });
      });

      describe("import", () => {
        test("nation can import an army in their province", () => {
          const board = new GameBoard({
            nodes: [
              { name: "a", nation: Nation.AH },
              { name: "b", nation: null },
              { name: "c", nation: Nation.IT },
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

          const availableActions = new Set([Action.import({ placements: [] })]);
          availableActions.add(
            Action.import({ placements: [{ province: "a", type: "army" }] })
          );

          game.tick(
            Action.rondel({ slot: "import", cost: 0, nation: Nation.AH })
          );

          expect(game.availableActions).toEqual(availableActions);
          expect(game.nations.get(Nation.AH).rondelPosition).toEqual("import");
        });

        test("nation can import a fleet in their coastal province", () => {
          const board = new GameBoard({
            nodes: [
              { name: "a", nation: Nation.AH, factoryType: "shipyard" },
              { name: "b", nation: null },
              { name: "c", nation: Nation.IT },
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

          const availableActions = new Set([Action.import({ placements: [] })]);
          availableActions.add(
            Action.import({ placements: [{ province: "a", type: "army" }] })
          );
          availableActions.add(
            Action.import({ placements: [{ province: "a", type: "fleet" }] })
          );

          game.tick(
            Action.rondel({ slot: "import", cost: 0, nation: Nation.AH })
          );

          expect(game.availableActions).toEqual(availableActions);
          expect(game.nations.get(Nation.AH).rondelPosition).toEqual("import");
        });
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

        describe("investor slot is skipped", () => {
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

          ["maneuver1", "production1", "factory", "taxation"].forEach(
            (startingPosition) => {
              describe("2. Investor is activated", () => {
                test("investor card holder gets 2m", () => {
                  const game = newGame();
                  // Make player1 the investor card holder
                  game.investorCardHolder = "player1";
                  // Empty out their bonds so that they don't impact player1's cash
                  game.players["player1"].bonds = new Set();
                  // Set AH's rondel position to be something *before* investor
                  game.nations.get(Nation.AH).rondelPosition = startingPosition;

                  expect(game.players["player1"].cash).toEqual(2);

                  // The investor slot lies between 'maneuver1' and 'maneuver2'
                  game.tick(
                    Action.rondel({
                      slot: "production2",
                      nation: Nation.AH,
                      cost: 0,
                    })
                  );

                  expect(game.players["player1"].cash).toEqual(4);
                });

                test("available bonds for sale outright", () => {
                  const game = newGame();
                  // Make player1 the investor card holder
                  game.investorCardHolder = "player1";
                  game.nations.get(Nation.AH).rondelPosition = startingPosition;
                  // Clear out player1's bonds so they can't trade any in
                  game.players["player1"].bonds = new Set();

                  expect(game.players["player1"].cash).toEqual(2);

                  game.tick(
                    Action.rondel({
                      slot: "production2",
                      nation: Nation.AH,
                      cost: 0,
                    })
                  );

                  expect(game.availableActions).toEqual(
                    new Set([
                      Action.bondPurchase({
                        nation: Nation.AH,
                        player: "player1",
                        cost: 4,
                      }),
                      Action.bondPurchase({
                        nation: Nation.IT,
                        player: "player1",
                        cost: 4,
                      }),
                      Action.bondPurchase({
                        nation: Nation.FR,
                        player: "player1",
                        cost: 4,
                      }),
                      Action.bondPurchase({
                        nation: Nation.GB,
                        player: "player1",
                        cost: 4,
                      }),
                      Action.bondPurchase({
                        nation: Nation.GE,
                        player: "player1",
                        cost: 4,
                      }),
                      Action.bondPurchase({
                        nation: Nation.RU,
                        player: "player1",
                        cost: 4,
                      }),
                    ])
                  );
                });

                test("available bonds that can be traded up for", () => {
                  const game = newGame();
                  game.investorCardHolder = "player2";
                  game.nations.get(Nation.AH).rondelPosition = startingPosition;

                  // Give the AH, 2 bond to player2
                  game.availableBonds.delete(Bond(Nation.AH, 2));
                  game.players["player2"].bonds = new Set([Bond(Nation.AH, 2)]);

                  expect(game.players["player2"].cash).toEqual(2);

                  game.tick(
                    Action.rondel({
                      slot: "production2",
                      nation: Nation.AH,
                      cost: 0,
                    })
                  );

                  // player2 can use their own 2m plus the trade-in value of 4m
                  // from their AH, 2 bond to buy the AH, 3 bond
                  expect(game.availableActions).toEqual(
                    new Set([
                      Action.bondPurchase({
                        nation: Nation.AH,
                        player: "player2",
                        cost: 6,
                      }),
                      Action.bondPurchase({
                        nation: Nation.IT,
                        player: "player2",
                        cost: 4,
                      }),
                      Action.bondPurchase({
                        nation: Nation.FR,
                        player: "player2",
                        cost: 4,
                      }),
                      Action.bondPurchase({
                        nation: Nation.GB,
                        player: "player2",
                        cost: 4,
                      }),
                      Action.bondPurchase({
                        nation: Nation.GE,
                        player: "player2",
                        cost: 4,
                      }),
                      Action.bondPurchase({
                        nation: Nation.RU,
                        player: "player2",
                        cost: 4,
                      }),
                    ])
                  );
                });
              });

              describe("3. Investing without a flag", () => {
                test.todo("test me plz");
              });
            }
          );
        });
      });

      describe("investor", () => {
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

        describe("1. Nation pays bond-holders interest", () => {
          test("nation pays interest to both players", () => {
            const game = newGame();
            game.players["player2"].bonds.add(Bond(Nation.AH, 2));

            expect(game.players["player1"].cash).toEqual(2);
            expect(game.players["player2"].cash).toEqual(2);
            expect(game.nations.get(Nation.AH).treasury).toEqual(11);

            game.tick(
              Action.rondel({ slot: "investor", nation: Nation.AH, cost: 0 })
            );

            expect(game.players["player1"].cash).toEqual(7);
            // NB: player2 has an "extra" 2m because they hold the investor card
            expect(game.players["player2"].cash).toEqual(6);
            expect(game.nations.get(Nation.AH).treasury).toEqual(4);
          });

          test("nation pays non-controlling players first when nation does not have enough money", () => {
            const game = newGame();
            game.players["player2"].bonds.add(Bond(Nation.AH, 2));
            game.nations.get(Nation.AH).treasury = 2;

            expect(game.players["player1"].cash).toEqual(2);
            expect(game.players["player2"].cash).toEqual(2);
            expect(game.nations.get(Nation.AH).treasury).toEqual(2);

            game.tick(
              Action.rondel({ slot: "investor", nation: Nation.AH, cost: 0 })
            );

            expect(game.players["player1"].cash).toEqual(2);
            // NB: player2 has an "extra" 2m because they hold the investor card
            expect(game.players["player2"].cash).toEqual(6);
            expect(game.nations.get(Nation.AH).treasury).toEqual(0);
          });

          test("controlling player must make up shortfall from nation when nation can't pay other investors", () => {
            const game = newGame();
            game.players["player2"].bonds.add(Bond(Nation.AH, 2));
            game.nations.get(Nation.AH).treasury = 0;

            expect(game.players["player1"].cash).toEqual(2);
            expect(game.players["player2"].cash).toEqual(2);
            expect(game.nations.get(Nation.AH).treasury).toEqual(0);

            game.tick(
              Action.rondel({ slot: "investor", nation: Nation.AH, cost: 0 })
            );

            expect(game.players["player1"].cash).toEqual(0);
            // NB: player2 has an "extra" 2m because they hold the investor card
            expect(game.players["player2"].cash).toEqual(6);
            expect(game.nations.get(Nation.AH).treasury).toEqual(0);
          });
        });

        describe("2. Investor is activated", () => {
          test("investor card holder gets 2m", () => {
            const game = newGame();
            // Make player1 the investor card holder
            game.investorCardHolder = "player1";
            // Empty out their bonds so that they don't impact player1's cash
            game.players["player1"].bonds = new Set();

            expect(game.players["player1"].cash).toEqual(2);

            game.tick(
              Action.rondel({ slot: "investor", nation: Nation.AH, cost: 0 })
            );

            expect(game.players["player1"].cash).toEqual(4);
          });

          test("available bonds for sale outright", () => {
            const game = newGame();
            // Empty out their bonds so they can't trade any in (that's tested below)
            game.players["player2"].bonds = new Set();

            expect(game.players["player2"].cash).toEqual(2);

            game.tick(
              Action.rondel({ slot: "investor", nation: Nation.AH, cost: 0 })
            );

            expect(game.availableActions).toEqual(
              new Set([
                Action.bondPurchase({
                  nation: Nation.AH,
                  player: "player2",
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.IT,
                  player: "player2",
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.FR,
                  player: "player2",
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.GB,
                  player: "player2",
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.GE,
                  player: "player2",
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.RU,
                  player: "player2",
                  cost: 4,
                }),
              ])
            );
          });

          test("available bonds that can be traded up for", () => {
            const game = newGame();
            game.investorCardHolder = "player2";

            // Give the AH, 2 bond to player2
            game.availableBonds.delete(Bond(Nation.AH, 2));
            game.players["player2"].bonds = new Set([Bond(Nation.AH, 2)]);
            game.players["player2"].cash = 0;

            game.tick(
              Action.rondel({ slot: "investor", nation: Nation.AH, cost: 0 })
            );

            // player2 can use their own 2m plus the trade-in value of 4m
            // from their AH, 2 bond to buy the AH, 3 bond
            expect(game.availableActions).toEqual(
              new Set([
                Action.bondPurchase({
                  nation: Nation.AH,
                  player: "player2",
                  cost: 6,
                }),
                Action.bondPurchase({
                  nation: Nation.IT,
                  player: "player2",
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.FR,
                  player: "player2",
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.GB,
                  player: "player2",
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.GE,
                  player: "player2",
                  cost: 4,
                }),
                Action.bondPurchase({
                  nation: Nation.RU,
                  player: "player2",
                  cost: 4,
                }),
              ])
            );
          });
        });

        describe("3. Investing without a flag", () => {
          test.todo("test me plz");
        });

        describe("investor slot is skipped", () => {
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

          [
            "maneuver1",
            "production1",
            "factory",
            "taxation",
            "maneuver2",
          ].forEach((startingPosition) => {
            describe("2. Investor is activated", () => {
              test("investor card holder gets 2m", () => {
                const game = newGame();
                // Make player1 the investor card holder
                game.investorCardHolder = "player1";
                // Empty out their bonds so that they don't impact player1's cash
                game.players["player1"].bonds = new Set();
                // Set AH's rondel position to be something *before* investor
                game.nations.get(Nation.AH).rondelPosition = startingPosition;

                expect(game.players["player1"].cash).toEqual(2);

                // The investor slot lies between 'maneuver1' and 'import'
                game.tick(
                  Action.rondel({ slot: "import", nation: Nation.AH, cost: 0 })
                );
                game.tick(Action.import({ placements: [] }));

                expect(game.players["player1"].cash).toEqual(4);
              });

              test("available bonds for sale outright", () => {
                const game = newGame();
                // Make player1 the investor card holder
                game.investorCardHolder = "player1";
                game.nations.get(Nation.AH).rondelPosition = startingPosition;
                // Clear out player1's bonds so they can't trade any in
                game.players["player1"].bonds = new Set();

                expect(game.players["player1"].cash).toEqual(2);

                game.tick(
                  Action.rondel({ slot: "import", nation: Nation.AH, cost: 0 })
                );
                game.tick(Action.import({ placements: [] }));

                expect(game.availableActions).toEqual(
                  new Set([
                    Action.bondPurchase({
                      nation: Nation.AH,
                      player: "player1",
                      cost: 4,
                    }),
                    Action.bondPurchase({
                      nation: Nation.IT,
                      player: "player1",
                      cost: 4,
                    }),
                    Action.bondPurchase({
                      nation: Nation.FR,
                      player: "player1",
                      cost: 4,
                    }),
                    Action.bondPurchase({
                      nation: Nation.GB,
                      player: "player1",
                      cost: 4,
                    }),
                    Action.bondPurchase({
                      nation: Nation.GE,
                      player: "player1",
                      cost: 4,
                    }),
                    Action.bondPurchase({
                      nation: Nation.RU,
                      player: "player1",
                      cost: 4,
                    }),
                  ])
                );
              });

              test("available bonds that can be traded up for", () => {
                const game = newGame();
                game.investorCardHolder = "player2";
                game.nations.get(Nation.AH).rondelPosition = startingPosition;

                // Give the AH, 2 bond to player2
                game.availableBonds.delete(Bond(Nation.AH, 2));
                game.players["player2"].bonds = new Set([Bond(Nation.AH, 2)]);

                expect(game.players["player2"].cash).toEqual(2);

                game.tick(
                  Action.rondel({ slot: "import", nation: Nation.AH, cost: 0 })
                );
                game.tick(Action.import({ placements: [] }));

                // player2 can use their own 2m plus the trade-in value of 4m
                // from their AH, 2 bond to buy the AH, 3 bond
                expect(game.availableActions).toEqual(
                  new Set([
                    Action.bondPurchase({
                      nation: Nation.AH,
                      player: "player2",
                      cost: 6,
                    }),
                    Action.bondPurchase({
                      nation: Nation.IT,
                      player: "player2",
                      cost: 4,
                    }),
                    Action.bondPurchase({
                      nation: Nation.FR,
                      player: "player2",
                      cost: 4,
                    }),
                    Action.bondPurchase({
                      nation: Nation.GB,
                      player: "player2",
                      cost: 4,
                    }),
                    Action.bondPurchase({
                      nation: Nation.GE,
                      player: "player2",
                      cost: 4,
                    }),
                    Action.bondPurchase({
                      nation: Nation.RU,
                      player: "player2",
                      cost: 4,
                    }),
                  ])
                );
              });
            });

            describe("3. Investing without a flag", () => {
              test.todo("test me plz");
            });
          });
        });
      });

      describe("taxation", () => {
        const newGame = () => {
          const board = new GameBoard({
            nodes: [
              { name: "a", nation: Nation.AH },
              { name: "b", nation: Nation.AH },
              { name: "c", nation: null },
              { name: "d", nation: null },
              { name: "e", nation: Nation.AH },
              { name: "f", nation: Nation.AH },
              { name: "g", nation: Nation.AH },
              { name: "h", nation: null },
              { name: "i", nation: null },
              { name: "j", nation: null },
              { name: "k", nation: null },
              { name: "l", nation: null },
              { name: "m", nation: null },
              { name: "n", nation: null },
              { name: "o", nation: null },
              { name: "p", nation: null },
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

        describe("tax revenue / success bonus & collecting money", () => {
          test("taxes are paid out even when there is no increase on tax chart", () => {
            const game = newGame();
            // Set taxChartPosition to lowest value, 5
            game.nations.get(Nation.AH).taxChartPosition = 5;
            // Place two AH factories on the board
            game.provinces.get("a").factory = "armaments";
            game.provinces.get("b").factory = "armaments";
            // Add a flag for AH
            game.provinces.get("c").flag = Nation.AH;
            // Arbitrarily give AH 5 treasury; we want this to increase by 5
            game.nations.get(Nation.AH).treasury = 5;

            game.tick(
              Action.rondel({ cost: 0, nation: Nation.AH, slot: "taxation" })
            );

            expect(game.nations.get(Nation.AH).treasury).toEqual(10);
          });

          test("payment comes when advancement on tax chart happens", () => {
            const game = newGame();
            // Set taxChartPosition to lowest value, 5
            game.nations.get(Nation.AH).taxChartPosition = 5;
            // Place two AH factories on the board
            game.provinces.get("a").factory = "armaments";
            game.provinces.get("b").factory = "armaments";
            // Add two flags for AH
            game.provinces.get("c").flag = Nation.AH;
            game.provinces.get("d").flag = Nation.AH;
            // Arbitrarily give AH 5 treasury; we want this to increase by 6
            game.nations.get(Nation.AH).treasury = 5;

            game.tick(
              Action.rondel({ cost: 0, nation: Nation.AH, slot: "taxation" })
            );

            expect(game.nations.get(Nation.AH).treasury).toEqual(11);
            expect(game.nations.get(Nation.AH).taxChartPosition).toEqual(6);
          });

          test("occupied factories generate no taxes", () => {
            const game = newGame();
            // Set taxChartPosition to lowest value, 5
            game.nations.get(Nation.AH).taxChartPosition = 5;
            // Place three AH factories on the board
            game.provinces.get("a").factory = "armaments";
            game.provinces.get("b").factory = "armaments";
            game.provinces.get("e").factory = "armaments";
            // Add a flag for AH
            game.provinces.get("c").flag = Nation.AH;
            // Italy is occupying "a"!
            game.units.get(Nation.IT).get("a").armies = 1;
            // Arbitrarily give AH 5 treasury; we want this to increase by 5
            game.nations.get(Nation.AH).treasury = 5;

            game.tick(
              Action.rondel({ cost: 0, nation: Nation.AH, slot: "taxation" })
            );

            expect(game.nations.get(Nation.AH).treasury).toEqual(10);
          });

          test("tax revenue cannot exceed 20 and taxChartPosition cannot exceed 15", () => {
            const game = newGame();
            // Set taxChartPosition to lowest value, 5
            game.nations.get(Nation.AH).taxChartPosition = 5;
            // Place five AH factories on the board
            game.provinces.get("a").factory = "armaments";
            game.provinces.get("b").factory = "armaments";
            game.provinces.get("e").factory = "armaments";
            game.provinces.get("f").factory = "armaments";
            game.provinces.get("g").factory = "armaments";
            // Add eleven flags for AH
            game.provinces.get("c").flag = Nation.AH;
            game.provinces.get("d").flag = Nation.AH;
            game.provinces.get("h").flag = Nation.AH;
            game.provinces.get("i").flag = Nation.AH;
            game.provinces.get("j").flag = Nation.AH;
            game.provinces.get("k").flag = Nation.AH;
            game.provinces.get("l").flag = Nation.AH;
            game.provinces.get("m").flag = Nation.AH;
            game.provinces.get("n").flag = Nation.AH;
            game.provinces.get("o").flag = Nation.AH;
            game.provinces.get("p").flag = Nation.AH;
            // Arbitrarily give AH 5 treasury; we want this to increase by 20, not 21
            game.nations.get(Nation.AH).treasury = 5;

            game.tick(
              Action.rondel({ cost: 0, nation: Nation.AH, slot: "taxation" })
            );

            expect(game.nations.get(Nation.AH).treasury).toEqual(25);
            expect(game.nations.get(Nation.AH).taxChartPosition).toEqual(15);
          });

          test("nation's taxChartPosition cannot fall", () => {
            const game = newGame();
            // Set taxChartPosition to lowest value, 5
            game.nations.get(Nation.AH).taxChartPosition = 5;
            // Place one AH factory on the board
            game.provinces.get("a").factory = "armaments";
            // Arbitrarily give AH 5 treasury; we want this to increase by 2
            game.nations.get(Nation.AH).treasury = 5;

            game.tick(
              Action.rondel({ cost: 0, nation: Nation.AH, slot: "taxation" })
            );

            expect(game.nations.get(Nation.AH).treasury).toEqual(7);
            expect(game.nations.get(Nation.AH).taxChartPosition).toEqual(5);
          });

          test("payment to nation is reduced if they control units", () => {
            const game = newGame();
            // Set taxChartPosition to lowest value, 5
            game.nations.get(Nation.AH).taxChartPosition = 5;
            // Place two AH factories on the board
            game.provinces.get("a").factory = "armaments";
            game.provinces.get("b").factory = "armaments";
            // Add two flags for AH
            game.provinces.get("c").flag = Nation.AH;
            game.provinces.get("d").flag = Nation.AH;
            // Arbitrarily give AH 5 treasury; we want this to increase to 10
            game.nations.get(Nation.AH).treasury = 5;
            // AH controls one army
            game.units.get(Nation.AH).get("a").armies = 1;

            game.tick(
              Action.rondel({ cost: 0, nation: Nation.AH, slot: "taxation" })
            );

            expect(game.nations.get(Nation.AH).treasury).toEqual(10);
            expect(game.nations.get(Nation.AH).taxChartPosition).toEqual(6);
          });

          test("nations cannot be paid less than 0 if they control many units", () => {
            const game = newGame();
            // Set taxChartPosition to lowest value, 5
            game.nations.get(Nation.AH).taxChartPosition = 5;
            // Arbitrarily give AH 5 treasury; we want this to increase by 1
            game.nations.get(Nation.AH).treasury = 5;
            // AH controls one army
            game.units.get(Nation.AH).get("a").armies = 1;

            game.tick(
              Action.rondel({ cost: 0, nation: Nation.AH, slot: "taxation" })
            );

            expect(game.nations.get(Nation.AH).treasury).toEqual(5);
          });
        });

        describe("adding power points", () => {
          test("nation earns no power points", () => {
            const game = newGame();
            // Arbitrarily give AH 3 power points
            game.nations.get(Nation.AH).powerPoints = 3;

            game.tick(
              Action.rondel({ cost: 0, nation: Nation.AH, slot: "taxation" })
            );

            expect(game.nations.get(Nation.AH).powerPoints).toEqual(3);
          });

          test("nation earns one power point", () => {
            const game = newGame();
            // Arbitrarily give AH 3 power points
            game.nations.get(Nation.AH).powerPoints = 3;
            // Give AH factories and flags for 6 taxes
            game.provinces.get("a").factory = "armaments";
            game.provinces.get("b").factory = "armaments";
            game.provinces.get("c").flag = Nation.AH;
            game.provinces.get("d").flag = Nation.AH;

            game.tick(
              Action.rondel({ cost: 0, nation: Nation.AH, slot: "taxation" })
            );

            expect(game.nations.get(Nation.AH).powerPoints).toEqual(4);
          });

          test("achieving 25 power points (or more) triggers game end", () => {
            const game = newGame();
            // Arbitrarily give AH 3 power points
            game.nations.get(Nation.AH).powerPoints = 24;
            // Give AH stuff to put AH's power points over 25
            game.provinces.get("a").factory = "armaments";
            game.provinces.get("b").factory = "armaments";
            game.provinces.get("c").flag = Nation.AH;
            game.provinces.get("d").flag = Nation.AH;
            game.provinces.get("e").flag = Nation.AH;

            game.tick(
              Action.rondel({ cost: 0, nation: Nation.AH, slot: "taxation" })
            );

            expect(game.nations.get(Nation.AH).powerPoints).toEqual(25);
            expect(game.log[game.log.length - 1]).toEqual(Action.endGame());
          });
        });
      });

      describe("factory", () => {
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

        test("nation may choose where to build the factory", () => {
          const game = newGame();

          game.tick(
            Action.rondel({ slot: "factory", cost: 0, nation: Nation.AH })
          );

          expect(game.availableActions).toEqual(
            new Set([
              Action.buildFactory({ province: "a" }),
              Action.buildFactory({ province: "b" }),
            ])
          );
        });

        test("nation may not build a factory where one is already built", () => {
          const game = newGame();
          game.provinces.get("a").factory = "armaments";

          game.tick(
            Action.rondel({ slot: "factory", cost: 0, nation: Nation.AH })
          );

          expect(game.availableActions).toEqual(
            new Set([Action.buildFactory({ province: "b" })])
          );
        });

        test("nation may not build a factory where a foreign unit is present", () => {
          const game = newGame();
          game.units.get(Nation.IT).get("a").armies = 1;

          game.tick(
            Action.rondel({ slot: "factory", cost: 0, nation: Nation.AH })
          );

          expect(game.availableActions).toEqual(
            new Set([Action.buildFactory({ province: "b" })])
          );
        });

        test("nation may not build a factory if the nation has less than 5m treasury", () => {
          const game = newGame();
          game.nations.get(Nation.AH).treasury = 4;

          game.tick(
            Action.rondel({ slot: "factory", cost: 0, nation: Nation.AH })
          );

          expect(game.currentNation).toEqual(Nation.IT);
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
                targetType: null,
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
                targetType: null,
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

    describe("fight", () => {
      const newGame = () => {
        const board = new GameBoard({
          nodes: [
            { name: "a", nation: null },
            { name: "b", nation: null, isOcean: true },
          ],
          edges: [["a", "b"]],
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

      describe("nations have the same number of units", () => {
        test("flag remains for the incumbent", () => {
          const game = newGame();
          game.provinces.get("a").flag = Nation.AH;
          game.units.get(Nation.AH).get("a").armies++;
          game.units.get(Nation.IT).get("a").armies++;

          game.tick(
            Action.fight({
              province: "a",
              incumbent: Nation.AH,
              challenger: Nation.IT,
              targetType: null,
            })
          );

          expect(game.provinces.get("a").flag).toEqual(Nation.AH);
        });

        test("both nations lose an army", () => {
          const game = newGame();
          game.units.get(Nation.AH).get("a").armies++;
          game.units.get(Nation.IT).get("a").armies++;

          game.tick(
            Action.fight({
              province: "a",
              incumbent: Nation.AH,
              challenger: Nation.IT,
              targetType: null,
            })
          );

          expect(game.units.get(Nation.AH).get("a")).toEqual({
            armies: 0,
            fleets: 0,
          });
          expect(game.units.get(Nation.IT).get("a")).toEqual({
            armies: 0,
            fleets: 0,
          });
        });

        test("both nations lose a fleet", () => {
          const game = newGame();
          game.units.get(Nation.AH).get("b").fleets++;
          game.units.get(Nation.IT).get("b").fleets++;

          game.tick(
            Action.fight({
              province: "b",
              incumbent: Nation.AH,
              challenger: Nation.IT,
              targetType: null,
            })
          );

          expect(game.units.get(Nation.AH).get("b")).toEqual({
            armies: 0,
            fleets: 0,
          });
          expect(game.units.get(Nation.IT).get("b")).toEqual({
            armies: 0,
            fleets: 0,
          });
        });
      });

      describe("one nation has more armies than another", () => {
        test("flag changes to the challenger", () => {
          const game = newGame();
          game.units.get(Nation.AH).get("a").armies++;
          game.units.get(Nation.IT).get("a").armies++;
          game.units.get(Nation.IT).get("a").armies++;

          game.tick(
            Action.fight({
              province: "a",
              incumbent: Nation.AH,
              challenger: Nation.IT,
              targetType: null,
            })
          );

          expect(game.provinces.get("a").flag).toEqual(Nation.IT);
        });

        test("both nations lose one army but another remains", () => {
          const game = newGame();
          game.units.get(Nation.AH).get("a").armies++;
          game.units.get(Nation.AH).get("a").armies++;
          game.units.get(Nation.IT).get("a").armies++;

          game.tick(
            Action.fight({
              province: "a",
              incumbent: Nation.AH,
              challenger: Nation.IT,
              targetType: null,
            })
          );

          expect(game.units.get(Nation.AH).get("a")).toEqual({
            armies: 1,
            fleets: 0,
          });
          expect(game.units.get(Nation.IT).get("a")).toEqual({
            armies: 0,
            fleets: 0,
          });
        });
      });

      describe("a coastal province with a mixture of armies and fleets", () => {
        test("challenger chose to attack the fleet", () => {
          const game = newGame();
          game.units.get(Nation.AH).get("a").armies++;
          game.units.get(Nation.AH).get("a").fleets++;
          game.units.get(Nation.IT).get("a").armies++;

          game.tick(
            Action.fight({
              province: "a",
              incumbent: Nation.AH,
              challenger: Nation.IT,
              targetType: "fleet",
            })
          );

          expect(game.units.get(Nation.AH).get("a")).toEqual({
            armies: 1,
            fleets: 0,
          });
          expect(game.units.get(Nation.IT).get("b")).toEqual({
            armies: 0,
            fleets: 0,
          });
        });

        test("challenger chose to attack the army", () => {
          const game = newGame();
          game.units.get(Nation.AH).get("a").armies++;
          game.units.get(Nation.AH).get("a").fleets++;
          game.units.get(Nation.IT).get("a").armies++;

          game.tick(
            Action.fight({
              province: "a",
              incumbent: Nation.AH,
              challenger: Nation.IT,
              targetType: "army",
            })
          );

          expect(game.units.get(Nation.AH).get("a")).toEqual({
            armies: 0,
            fleets: 1,
          });
          expect(game.units.get(Nation.IT).get("b")).toEqual({
            armies: 0,
            fleets: 0,
          });
        });
      });

      describe("after fight is adjudicated", () => {
        test("endManeuver is pushed if challenger has no more units to move", () => {
          const game = newGame();
          game.units.get(Nation.AH).get("b").armies++;
          game.units.get(Nation.IT).get("a").armies++;

          game.tick(
            Action.rondel({ slot: "maneuver1", nation: Nation.AH, cost: 0 })
          );
          game.tick(Action.maneuver({ origin: "b", destination: "a" }));
          game.tick(
            Action.fight({
              province: "a",
              incumbent: Nation.AH,
              challenger: Nation.IT,
              targetType: null,
            })
          );

          expect(game.log[game.log.length - 1]).toEqual(Action.endManeuver());
        });

        test("challenger can maneuver if challenger has more units to move", () => {
          const game = newGame();
          game.units.get(Nation.AH).get("b").armies++;
          game.units.get(Nation.AH).get("b").armies++;
          game.units.get(Nation.IT).get("a").armies++;

          game.tick(
            Action.rondel({ slot: "maneuver1", nation: Nation.AH, cost: 0 })
          );
          game.tick(Action.maneuver({ origin: "b", destination: "a" }));
          game.tick(
            Action.fight({
              province: "a",
              incumbent: Nation.AH,
              challenger: Nation.IT,
              targetType: null,
            })
          );

          expect(game.availableActions).toEqual(
            new Set([
              Action.maneuver({ origin: "b", destination: "a" }),
              Action.endManeuver(),
            ])
          );
        });
      });
    });

    describe("coexist", () => {
      const newGame = () => {
        const board = new GameBoard({
          nodes: [
            { name: "a", nation: null },
            { name: "b", nation: null },
          ],
          edges: [["a", "b"]],
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

      test("both units remain", () => {
        const game = newGame();
        game.units.get(Nation.AH).get("a").armies++;
        game.units.get(Nation.IT).get("a").armies++;

        game.tick(
          Action.coexist({
            province: "a",
            incumbent: Nation.AH,
            challenger: Nation.IT,
          })
        );

        expect(game.units.get(Nation.AH).get("a")).toEqual({
          armies: 1,
          fleets: 0,
        });
        expect(game.units.get(Nation.IT).get("a")).toEqual({
          armies: 1,
          fleets: 0,
        });
      });

      test("incumbent's flag remains, even if they are outnumbered", () => {
        const game = newGame();
        game.provinces.get("a").flag = Nation.AH;
        game.units.get(Nation.AH).get("a").armies++;
        game.units.get(Nation.IT).get("a").armies++;
        game.units.get(Nation.IT).get("a").armies++;

        game.tick(
          Action.coexist({
            province: "a",
            incumbent: Nation.AH,
            challenger: Nation.IT,
          })
        );

        expect(game.provinces.get("a").flag).toEqual(Nation.AH);
      });

      describe("after coexistence is adjudicated", () => {
        test("endManeuver is pushed if challenger has no more units to move", () => {
          const game = newGame();
          game.units.get(Nation.AH).get("b").armies++;
          game.units.get(Nation.IT).get("a").armies++;

          game.tick(
            Action.rondel({ slot: "maneuver1", nation: Nation.AH, cost: 0 })
          );
          game.tick(Action.maneuver({ origin: "b", destination: "a" }));
          game.tick(
            Action.coexist({
              province: "a",
              incumbent: Nation.AH,
              challenger: Nation.IT,
            })
          );

          expect(game.log[game.log.length - 1]).toEqual(Action.endManeuver());
        });

        test("challenger can maneuver if challenger has more units to move", () => {
          const game = newGame();
          game.units.get(Nation.AH).get("b").armies++;
          game.units.get(Nation.AH).get("b").armies++;
          game.units.get(Nation.IT).get("a").armies++;

          game.tick(
            Action.rondel({ slot: "maneuver1", nation: Nation.AH, cost: 0 })
          );
          game.tick(Action.maneuver({ origin: "b", destination: "a" }));
          game.tick(
            Action.coexist({
              province: "a",
              incumbent: Nation.AH,
              challenger: Nation.IT,
            })
          );

          expect(game.availableActions).toEqual(
            new Set([
              Action.maneuver({ origin: "b", destination: "a" }),
              Action.endManeuver(),
            ])
          );
        });
      });
    });

    describe("currentPlayerName on new turn", () => {
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

      test("when nobody controls a nation, that nation skips their turn", () => {
        const game = newGame();
        // Remove player2 from controlling Italy
        game.nations.get(Nation.IT).controller = null;

        // End maneuver just because it is simple; the action is unimportant
        game.tick(Action.endManeuver());

        expect(game.currentNation).toEqual(Nation.FR);
        expect(game.currentPlayerName).toEqual("player1");
      });
    });
  });
});

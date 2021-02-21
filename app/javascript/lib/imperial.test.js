import Action from "./action.js";
import GameBoard from "./gameBoard.js";
import Imperial from "./imperial.js";
import { Bond, Nation } from "./constants.js";

const cloneUnits = units => {
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
            { name: "b", nation: Nation.AH }
          ],
          edges: []
        });

        const game = new Imperial(board);
        game.tick(
          Action.initialize({
            players: [
              { id: "player1", nation: Nation.AH },
              { id: "player2", nation: Nation.IT }
            ],
            soloMode: false
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
              "taxation"
            ].map(slot => Action.rondel({ nation: Nation.IT, cost: 0, slot }))
          )
        );
      });

      test("player purchases a bond by trading one in", () => {
        const game = newGame();
        // Give player one bond to trade in
        game.players["player1"].bonds = new Set([Bond(Nation.AH, 1)]);
        game.availableActions = new Set([
          Action.bondPurchase({ player: "player1", cost: 4, nation: Nation.AH })
        ]);

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

        game.tick(Action.rondel({nation: Nation.AH, cost: 0, slot: "investor"}));
        game.tick(
          Action.bondPurchase({ player: "player2", cost: 4, nation: Nation.IT })
        );

        expect(game.nations.get(Nation.IT).controller).toEqual("player2");
      });
    });

    describe("skipBondPurchase", () => {
      const newGame = () => {
        const board = new GameBoard({
          nodes: [
            { name: "a", nation: Nation.AH },
            { name: "b", nation: Nation.AH }
          ],
          edges: []
        });

        const game = new Imperial(board);
        game.tick(
          Action.initialize({
            players: [
              { id: "player1", nation: Nation.AH },
              { id: "player2", nation: Nation.IT }
            ],
            soloMode: false
          })
        );
        return game;
      };

      test("player chooses not to purchase a bond", () => {
        const game = newGame();
        game.investorCardHolder = "player1";

        game.tick(
          Action.rondel({ nation: Nation.AH, cost: 0, slot: "investor" })
        );
        game.tick(
          Action.skipBondPurchase({ player: "player1" })
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
              "taxation"
            ].map(slot => Action.rondel({ nation: Nation.IT, cost: 0, slot }))
          )
        );
      });
    });

    describe("endManeuver", () => {
      const newGame = () => {
        const board = new GameBoard({
          nodes: [{ name: "a" }],
          edges: []
        });

        const game = new Imperial(board);
        game.tick(
          Action.initialize({
            players: [
              { id: "player1", nation: Nation.AH },
              { id: "player2", nation: Nation.IT }
            ],
            soloMode: false
          })
        );
        return game;
      };

      test("it is IT's turn to select a rondel slot", () => {
        const game = newGame();
        const expected = new Set();
        ["investor", "import", "production2"].forEach(slot => {
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
        game.players["player2"].cash = 6;

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
          edges: []
        });

        const game = new Imperial(board);
        game.tick(
          Action.initialize({
            players: [
              { id: "player1", nation: Nation.AH },
              { id: "player2", nation: Nation.IT }
            ],
            soloMode: false
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
          Bond(Nation.IT, 2)
        ]);
        game.players["player2"].bonds = new Set([
          Bond(Nation.AH, 2),
          Bond(Nation.IT, 5)
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

      test("it can handle a tie", () => {
        const game = newGame();
        game.nations.get(Nation.AH).powerPoints = 25;
        game.nations.get(Nation.IT).powerPoints = 15;
        game.players["player2"].bonds = new Set([
          Bond(Nation.AH, 5),
          Bond(Nation.IT, 2)
        ]);
        game.players["player1"].bonds = new Set([
          Bond(Nation.AH, 2),
          Bond(Nation.IT, 5)
        ]);
        game.players["player2"].cash = 4;
        game.players["player1"].cash = 10;
        game.updateRawScores();

        game.tick(Action.endGame());

        // player2 has AH bond 5 * 5 (powerPoints) + IT bond 2 * 3 (powerPoints) + 4 cash
        // player2 has 35 points
        // player1 has AH bond 2 * 5 (powerPoints) + IT bond 5 * 3 (powerPoints) + 10 cash
        // player1 has 35 points
        // Players points are equal but player1 controls more of the "winning" 
        // country, so player2 wins the game
        expect(game.winner).toEqual("player2");
      });
    });

    describe("buildFactory", () => {
      const newGame = () => {
        const board = new GameBoard({
          nodes: [{ name: "a", nation: Nation.AH, factoryType: "armaments" }],
          edges: []
        });

        const game = new Imperial(board);
        game.tick(
          Action.initialize({
            players: [
              { id: "player1", nation: Nation.AH },
              { id: "player2", nation: Nation.IT }
            ],
            soloMode: false
          })
        );
        return game;
      };

      test("AH builds a factory", () => {
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
              "taxation"
            ].map(slot => Action.rondel({ nation: Nation.IT, cost: 0, slot }))
          )
        );
        expect(game.buildingFactory).toEqual(false);
      });
    });

    describe("import", () => {
      const newGame = () => {
        const board = new GameBoard({
          nodes: [
            { name: "a", nation: Nation.AH, factoryType: "shipyard" },
            { name: "b", nation: Nation.AH }
          ],
          edges: []
        });

        const game = new Imperial(board);
        game.tick(
          Action.initialize({
            players: [
              { id: "player1", nation: Nation.AH },
              { id: "player2", nation: Nation.IT }
            ],
            soloMode: false
          })
        );
        return game;
      };

      test("import nothing adds no new units", () => {
        const game = newGame();
        const beforeUnits = cloneUnits(game.units);
        expect(game.nations.get(Nation.AH).treasury).toEqual(11);

        game.rondel(Action.rondel({nation: Nation.AH, cost: 0, slot: "import"}));
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
              "taxation"
            ].map(slot => Action.rondel({ nation: Nation.IT, cost: 0, slot }))
          )
        );
        expect(game.importing).toEqual(false);
      });

      test("import one army", () => {
        const game = newGame();
        const expected = cloneUnits(game.units);
        expected.get(Nation.AH).get("a").armies++;
        expect(game.nations.get(Nation.AH).treasury).toEqual(11);

        game.rondel(Action.rondel({nation: Nation.AH, cost: 0, slot: "import"}));
        game.tick(
          Action.import({ placements: [{ province: "a", type: "army" }] })
        );

        expect(game.units).toEqual(expected);
        expect(game.nations.get(Nation.AH).treasury).toEqual(10);
        expect(game.importing).toEqual(false);
      });

      test("import one army and one fleet", () => {
        const game = newGame();
        const expected = cloneUnits(game.units);
        expected.get(Nation.AH).get("a").armies++;
        expected.get(Nation.AH).get("a").fleets++;

        expect(game.nations.get(Nation.AH).treasury).toEqual(11);

        game.tick(Action.rondel({nation: Nation.AH, cost: 0, slot: "import"}));
        game.tick(
          Action.import({
            placements: [
              { province: "a", type: "army" },
              { province: "a", type: "fleet" }
            ]
          })
        );

        expect(game.units).toEqual(expected);
        expect(game.nations.get(Nation.AH).treasury).toEqual(9);
        expect(game.importing).toEqual(false);
      });

      test("import two armies and one fleet", () => {
        const game = newGame();
        const expected = cloneUnits(game.units);
        expected.get(Nation.AH).get("a").armies++;
        expected.get(Nation.AH).get("b").armies++;
        expected.get(Nation.AH).get("a").fleets++;
        expect(game.nations.get(Nation.AH).treasury).toEqual(11);

        game.rondel(Action.rondel({nation: Nation.AH, cost: 0, slot: "import"}));
        game.tick(
          Action.import({
            placements: [
              { province: "a", type: "army" },
              { province: "b", type: "army" },
              { province: "a", type: "fleet" }
            ]
          })
        );

        expect(game.units).toEqual(expected);
        expect(game.nations.get(Nation.AH).treasury).toEqual(8);
        expect(game.importing).toEqual(false);
      });
    });

    describe("initialize", () => {
      const newGame = () => {
        const board = new GameBoard({
          nodes: [],
          edges: []
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
              { id: "player2", nation: Nation.IT }
            ],
            soloMode: false
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
              "taxation"
            ].map(slot => Action.rondel({ nation: Nation.AH, cost: 0, slot }))
          )
        );
      });
    });

    describe("rondel", () => {
      describe("slots that cost money", () => {
        const newGame = () => {
          const board = new GameBoard({
            nodes: [
              { name: "a", nation: Nation.AH },
              { name: "b", nation: Nation.IT },
              { name: "c", nation: Nation.FR },
              { name: "d", nation: Nation.GB },
              { name: "e", nation: Nation.GE },
              { name: "f", nation: Nation.RU },
            ],
            edges: []
          });

          const game = new Imperial(board);
          game.tick(
            Action.initialize({
              players: [
                { id: "player1", nation: Nation.AH },
                { id: "player2", nation: Nation.IT }
              ],
              soloMode: false
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
        test("a slot can deduct 2 million", () => {
          const game = newGame();

          game.players["player1"].cash = 2;

          game.tick(Action.rondel({ slot: "import", cost: 0, nation: Nation.AH }));
          game.tick(Action.import({ placements: [] }));
          game.tick(Action.rondel({ slot: "import", cost: 0, nation: Nation.IT }));
          game.tick(Action.import({ placements: [] }));
          game.tick(Action.rondel({ slot: "import", cost: 0, nation: Nation.FR }));
          game.tick(Action.import({ placements: [] }));
          game.tick(Action.rondel({ slot: "import", cost: 0, nation: Nation.GB }));
          game.tick(Action.import({ placements: [] }));
          game.tick(Action.rondel({ slot: "import", cost: 0, nation: Nation.GE }));
          game.tick(Action.import({ placements: [] }));
          game.tick(Action.rondel({ slot: "import", cost: 0, nation: Nation.RU }));
          game.tick(Action.import({ placements: [] }));
          game.tick(
            Action.rondel({ slot: "factory", cost: 2, nation: Nation.AH })
          );

          expect(game.players["player1"].cash).toEqual(0);
        });

        test("player cannot move to slot they can't afford", () => {
          const game = newGame();

          game.players["player1"].cash = 0;

          game.tick(Action.rondel({ slot: "import", cost: 0, nation: Nation.AH }));
          game.tick(Action.import({ placements: [] }));
          game.tick(Action.rondel({ slot: "import", cost: 0, nation: Nation.IT }));
          game.tick(Action.import({ placements: [] }));
          game.tick(Action.rondel({ slot: "import", cost: 0, nation: Nation.FR }));
          game.tick(Action.import({ placements: [] }));
          game.tick(Action.rondel({ slot: "import", cost: 0, nation: Nation.GB }));
          game.tick(Action.import({ placements: [] }));
          game.tick(Action.rondel({ slot: "import", cost: 0, nation: Nation.GE }));
          game.tick(Action.import({ placements: [] }));
          game.tick(Action.rondel({ slot: "import", cost: 0, nation: Nation.RU }));
          game.tick(Action.import({ placements: [] }));

          expect(game.availableActions).toEqual(
            new Set([
              Action.rondel({ slot: "production2", cost: 0, nation: Nation.AH }),
              Action.rondel({ slot: "maneuver2", cost: 0, nation: Nation.AH }),
              Action.rondel({ slot: "taxation", cost: 0, nation: Nation.AH }),
            ])
          );
        });

        test("nation cannot move to Factory if they cannot afford to buy a factory", () => {
          const game = newGame();

          game.nations.get(Nation.AH).treasury = 0;

          game.tick(Action.rondel({ slot: "maneuver2", cost: 0, nation: Nation.AH }));
          game.tick(Action.endManeuver());
          game.tick(Action.rondel({ slot: "taxation", cost: 0, nation: Nation.IT }));
          game.tick(Action.rondel({ slot: "taxation", cost: 0, nation: Nation.FR }));
          game.tick(Action.rondel({ slot: "taxation", cost: 0, nation: Nation.GB }));
          game.tick(Action.rondel({ slot: "taxation", cost: 0, nation: Nation.GE }));
          game.tick(Action.rondel({ slot: "taxation", cost: 0, nation: Nation.RU }));

          expect(game.availableActions).toEqual(
            new Set([
              Action.rondel({ slot: "taxation", cost: 0, nation: Nation.AH }),
              Action.rondel({ slot: "production1", cost: 0, nation: Nation.AH }),
              Action.rondel({ slot: "maneuver1", cost: 2, nation: Nation.AH }),
            ])
          );
        });
      });

      describe("import", () => {
        test("nation can import armies in their province", () => {
          const board = new GameBoard({
            nodes: [
              { name: "a", nation: Nation.AH },
              { name: "b", nation: null },
              { name: "c", nation: Nation.IT }
            ],
            edges: []
          });

          const game = new Imperial(board);
          game.tick(
            Action.initialize({
              players: [
                { id: "player1", nation: Nation.AH },
                { id: "player2", nation: Nation.IT }
              ],
              soloMode: false
            })
          );

          const availableActions = new Set([Action.import({ placements: [] })]);
          availableActions.add(
            Action.import({ placements: [{ province: "a", type: "army" }] })
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: "a", type: "army" },
                { province: "a", type: "army" }
              ]
            })
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: "a", type: "army" },
                { province: "a", type: "army" },
                { province: "a", type: "army" }
              ]
            })
          );

          game.tick(
            Action.rondel({ slot: "import", cost: 0, nation: Nation.AH })
          );

          expect(game.availableActions).toEqual(availableActions);
          expect(game.nations.get(Nation.AH).rondelPosition).toEqual("import");
          expect(game.importing).toEqual(true);
        });

        test("nation can import fleets in their coastal province", () => {
          const board = new GameBoard({
            nodes: [
              { name: "a", nation: Nation.AH, factoryType: "shipyard" },
              { name: "b", nation: null },
              { name: "c", nation: Nation.IT }
            ],
            edges: []
          });

          const game = new Imperial(board);
          game.tick(
            Action.initialize({
              players: [
                { id: "player1", nation: Nation.AH },
                { id: "player2", nation: Nation.IT }
              ],
              soloMode: false
            })
          );

          const availableActions = new Set([Action.import({ placements: [] })]);
          availableActions.add(
            Action.import({ placements: [{ province: "a", type: "army" }] })
          );
          availableActions.add(
            Action.import({ placements: [{ province: "a", type: "fleet" }] })
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: "a", type: "army" },
                { province: "a", type: "army" }
              ]
            })
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: "a", type: "fleet" },
                { province: "a", type: "fleet" }
              ]
            })
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: "a", type: "army" },
                { province: "a", type: "fleet" }
              ]
            })
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: "a", type: "fleet" },
                { province: "a", type: "army" }
              ]
            })
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: "a", type: "army" },
                { province: "a", type: "army" },
                { province: "a", type: "army" }
              ]
            })
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: "a", type: "army" },
                { province: "a", type: "army" },
                { province: "a", type: "fleet" }
              ]
            })
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: "a", type: "army" },
                { province: "a", type: "fleet" },
                { province: "a", type: "fleet" }
              ]
            })
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: "a", type: "army" },
                { province: "a", type: "fleet" },
                { province: "a", type: "army" }
              ]
            })
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: "a", type: "fleet" },
                { province: "a", type: "fleet" },
                { province: "a", type: "fleet" }
              ]
            })
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: "a", type: "fleet" },
                { province: "a", type: "fleet" },
                { province: "a", type: "army" }
              ]
            })
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: "a", type: "fleet" },
                { province: "a", type: "army" },
                { province: "a", type: "army" }
              ]
            })
          );
          availableActions.add(
            Action.import({
              placements: [
                { province: "a", type: "fleet" },
                { province: "a", type: "army" },
                { province: "a", type: "fleet" }
              ]
            })
          );
          game.tick(
            Action.rondel({ slot: "import", cost: 0, nation: Nation.AH })
          );

          expect(game.availableActions).toEqual(availableActions);
          expect(game.nations.get(Nation.AH).rondelPosition).toEqual("import");
          expect(game.importing).toEqual(true);
        });

        test("nation can only afford one army", () => {
          const board = new GameBoard({
            nodes: [{ name: "a", nation: Nation.AH, factoryType: "shipyard" }],
            edges: []
          });

          const game = new Imperial(board);
          game.tick(
            Action.initialize({
              players: [
                { id: "player1", nation: Nation.AH },
                { id: "player2", nation: Nation.IT }
              ],
              soloMode: false
            })
          );
          game.nations.get(Nation.AH).treasury = 1;

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
          expect(game.importing).toEqual(true);
        });

        test("nation cannot import into an occupied province", () => {
          const board = new GameBoard({
            nodes: [{ name: "a", nation: Nation.AH }],
            edges: []
          });

          const game = new Imperial(board);
          game.tick(
            Action.initialize({
              players: [
                { id: "player1", nation: Nation.AH },
                { id: "player2", nation: Nation.IT }
              ],
              soloMode: false
            })
          );
          game.units.get(Nation.IT).get("a").armies++;
          game.nations.get(Nation.AH).treasury = 1;

          const availableActions = new Set([Action.import({ placements: [] })]);

          game.tick(
            Action.rondel({ slot: "import", cost: 0, nation: Nation.AH })
          );

          expect(game.availableActions).toEqual(availableActions);
          expect(game.nations.get(Nation.AH).rondelPosition).toEqual("import");
          expect(game.importing).toEqual(true);
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
              { name: "e", nation: Nation.AH },
              { name: "f", nation: Nation.AH },
              { name: "g", nation: Nation.AH }
            ],
            edges: [
              ["a", "b"],
              ["c", "d"],
              ["b", "c"],
              ["e", "f"],
              ["f", "g"]
            ]
          });

          const game = new Imperial(board);
          game.tick(
            Action.initialize({
              players: [
                { id: "player1", nation: Nation.AH },
                { id: "player2", nation: Nation.IT }
              ],
              soloMode: false
            })
          );
          return game;
        };

        ["maneuver1", "maneuver2"].forEach(maneuver => {
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
                  destination: "b"
                })
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
                  destination: "b"
                }),
                Action.maneuver({
                  origin: "c",
                  destination: "d"
                })
              ])
            );
          });

          test("nation cannot use railroad rule when occupied", () => {
            const game = newGame();
            game.units.get(Nation.AH).get("e").armies++;
            game.units.get(Nation.IT).get("g").armies++;

            game.tick(
              Action.rondel({ slot: maneuver, nation: Nation.AH, cost: 0 })
            );

            expect(game.availableActions).toEqual(
              new Set([
                Action.endManeuver(),
                Action.maneuver({
                  origin: "e",
                  destination: "f"
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
            edges: []
          });

          const game = new Imperial(board);
          game.tick(
            Action.initialize({
              players: [
                { id: "player1", nation: Nation.AH },
                { id: "player2", nation: Nation.IT }
              ],
              soloMode: false
            })
          );
          return game;
        };

        ["production1", "production2"].forEach(production => {
          describe("units are produced", () => {
            test("a unit is produced in a province that has a factory", () => {
              const game = newGame();
              game.provinces.get("a").factory = "armaments";

              game.tick(
                Action.rondel({ slot: production, cost: 0, nation: Nation.AH })
              );

              expect(game.units.get(Nation.AH).get("a").armies).toEqual(1);
            });

            test("a unit is not produced in a province that does not have a factory", () => {
              const game = newGame();

              game.tick(
                Action.rondel({ slot: production, cost: 0, nation: Nation.AH })
              );

              expect(game.units.get(Nation.AH).get("a").armies).toEqual(0);
            });

            test("a unit is not produce in a province that has an occupied factory", () => {
              const game = newGame();
              game.provinces.get("a").factory = "armaments";
              game.units.get(Nation.IT).get("a").armies = 1;

              game.tick(
                Action.rondel({ slot: production, cost: 0, nation: Nation.AH })
              );

              expect(game.units.get(Nation.AH).get("a").armies).toEqual(0);
            });
          });

          test("it is IT's turn to select a rondel slot", () => {
            const game = newGame();
            const expected = new Set();
            ["factory", "production1", "maneuver1"].forEach(slot => {
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
            game.players["player2"].cash = 6;

            game.tick(
              Action.rondel({ slot: production, cost: 0, nation: Nation.AH })
            );

            expect(game.availableActions).toEqual(expected);
          });
        });
      });

      describe("investor", () => {
        const newGame = () => {
          const board = new GameBoard({
            nodes: [],
            edges: []
          });

          const game = new Imperial(board);
          game.tick(
            Action.initialize({
              players: [
                { id: "player1", nation: Nation.AH },
                { id: "player2", nation: Nation.IT }
              ],
              soloMode: false
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
                Action.skipBondPurchase({ player: "player2" }),
                Action.bondPurchase({
                  nation: Nation.AH,
                  player: "player2",
                  cost: 4
                }),
                Action.bondPurchase({
                  nation: Nation.IT,
                  player: "player2",
                  cost: 4
                }),
                Action.bondPurchase({
                  nation: Nation.FR,
                  player: "player2",
                  cost: 4
                }),
                Action.bondPurchase({
                  nation: Nation.GB,
                  player: "player2",
                  cost: 4
                }),
                Action.bondPurchase({
                  nation: Nation.GE,
                  player: "player2",
                  cost: 4
                }),
                Action.bondPurchase({
                  nation: Nation.RU,
                  player: "player2",
                  cost: 4
                })
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
                Action.skipBondPurchase({ player: "player2" }),
                Action.bondPurchase({
                  nation: Nation.AH,
                  player: "player2",
                  cost: 6
                }),
                Action.bondPurchase({
                  nation: Nation.IT,
                  player: "player2",
                  cost: 4
                }),
                Action.bondPurchase({
                  nation: Nation.FR,
                  player: "player2",
                  cost: 4
                }),
                Action.bondPurchase({
                  nation: Nation.GB,
                  player: "player2",
                  cost: 4
                }),
                Action.bondPurchase({
                  nation: Nation.GE,
                  player: "player2",
                  cost: 4
                }),
                Action.bondPurchase({
                  nation: Nation.RU,
                  player: "player2",
                  cost: 4
                })
              ])
            );
          });
        });

        describe("3. Investing without a flag", () => {
          test.todo("test me plz");
        });
      });

      describe("investor slot is skipped", () => {
        const newGame = () => {
          const board = new GameBoard({
            nodes: [{ name: "a", nation: Nation.AH }],
            edges: []
          });

          const game = new Imperial(board);
          game.tick(
            Action.initialize({
              players: [
                { id: "player1", nation: Nation.AH },
                { id: "player2", nation: Nation.IT },
                { id: "player3", nation: Nation.FR }
              ],
              soloMode: false
            })
          );
          return game;
        };

        ["maneuver1", "production1", "factory", "taxation"].forEach(
          startingPosition => {
            describe("2. Investor is activated", () => {
              test("investor card holder gets 2m", () => {
                const game = newGame();
                // Make player2 the investor card holder
                game.investorCardHolder = "player2";
                // Empty out their bonds so that they don't impact player2's cash
                game.players["player2"].bonds = new Set();
                // Set AH's rondel position to be something *before* investor
                game.nations.get(Nation.AH).rondelPosition = startingPosition;

                expect(game.players["player2"].cash).toEqual(2);

                // The investor slot lies between 'maneuver1' and 'maneuver2'
                game.tick(
                  Action.rondel({
                    slot: "production2",
                    nation: Nation.AH,
                    cost: 0
                  })
                );

                expect(game.players["player2"].cash).toEqual(4);
                expect(game.currentPlayerName).toEqual("player2");
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
                    cost: 0
                  })
                );

                expect(game.availableActions).toEqual(
                  new Set([
                    Action.skipBondPurchase({ player: "player1" }),
                    Action.bondPurchase({
                      nation: Nation.AH,
                      player: "player1",
                      cost: 4
                    }),
                    Action.bondPurchase({
                      nation: Nation.IT,
                      player: "player1",
                      cost: 4
                    }),
                    Action.bondPurchase({
                      nation: Nation.FR,
                      player: "player1",
                      cost: 4
                    }),
                    Action.bondPurchase({
                      nation: Nation.GB,
                      player: "player1",
                      cost: 4
                    }),
                    Action.bondPurchase({
                      nation: Nation.GE,
                      player: "player1",
                      cost: 4
                    }),
                    Action.bondPurchase({
                      nation: Nation.RU,
                      player: "player1",
                      cost: 4
                    })
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
                    cost: 0
                  })
                );

                // player2 can use their own 2m plus the trade-in value of 4m
                // from their AH, 2 bond to buy the AH, 3 bond
                expect(game.availableActions).toEqual(
                  new Set([
                    Action.skipBondPurchase({ player: "player2" }),
                    Action.bondPurchase({
                      nation: Nation.AH,
                      player: "player2",
                      cost: 6
                    }),
                    Action.bondPurchase({
                      nation: Nation.IT,
                      player: "player2",
                      cost: 4
                    }),
                    Action.bondPurchase({
                      nation: Nation.FR,
                      player: "player2",
                      cost: 4
                    }),
                    Action.bondPurchase({
                      nation: Nation.GB,
                      player: "player2",
                      cost: 4
                    }),
                    Action.bondPurchase({
                      nation: Nation.GE,
                      player: "player2",
                      cost: 4
                    }),
                    Action.bondPurchase({
                      nation: Nation.RU,
                      player: "player2",
                      cost: 4
                    })
                  ])
                );
              });
            });

            describe("3. Investing without a flag", () => {
              test("a player who has a Swiss Bank may invest", () => {
                const game = newGame();
                // player2 has no bond and no investor card.
                game.investorCardHolder = "player1";
                game.players["player1"].cash = 4;
                // Make player1 control all countries
                game.nations.get(Nation.AH).controller = "player1";
                game.nations.get(Nation.IT).controller = "player1";
                game.nations.get(Nation.FR).controller = "player1";
                game.nations.get(Nation.GB).controller = "player1";
                game.nations.get(Nation.GE).controller = "player1";
                game.nations.get(Nation.RU).controller = "player1";
                game.players["player2"].bonds = new Set();
                game.swissBanks = ["player2"]
                // Set AH's rondel position to be something *before* investor
                game.nations.get(Nation.AH).rondelPosition = startingPosition;

                // The investor slot lies between 'maneuver1' and 'maneuver2'
                game.tick(
                  Action.rondel({
                    slot: "production2",
                    nation: Nation.AH,
                    cost: 0
                  })
                );
                game.tick(Action.skipForceInvestor({player: "player2"}));
                // InvestorCardHolder buys a bond first
                game.tick(
                  Action.bondPurchase({
                    nation: Nation.AH,
                    player: "player1",
                    cost: 4
                  })
                );

                // For testing purposes, we delete the skip  bond purchase action
                game.availableActions.delete(Action.skipBondPurchase({ player: "player2" }));
                game.availableActions.forEach((action) => {
                  expect(action.type).toEqual("bondPurchase");
                  expect(action.payload.player).toEqual("player2");
                });
              });

              test("a player who has a Swiss Bank and the investor card may not invest twice", () => {
                const game = newGame();
                // player2 the investor card.
                game.investorCardHolder = "player2";
                game.players["player1"].cash = 4;
                // Make player1 control all countries
                game.nations.get(Nation.AH).controller = "player1";
                game.nations.get(Nation.IT).controller = "player1";
                game.nations.get(Nation.FR).controller = "player1";
                game.nations.get(Nation.GB).controller = "player3";
                game.nations.get(Nation.GE).controller = "player3";
                game.nations.get(Nation.RU).controller = "player3";
                game.players["player2"].bonds = new Set();
                // Set AH's rondel position to be something *before* investor
                game.nations.get(Nation.AH).rondelPosition = startingPosition;

                // The investor slot lies between 'maneuver1' and 'maneuver2'
                game.tick(
                  Action.rondel({
                    slot: "production2",
                    nation: Nation.AH,
                    cost: 0
                  })
                );
                game.tick(Action.skipForceInvestor({player: "player2"}));
                // InvestorCardHolder buys a bond first
                game.tick(
                  Action.bondPurchase({
                    nation: Nation.AH,
                    player: "player2",
                    cost: 4
                  })
                );

                game.availableActions.forEach((action) => {
                  expect(action.type).toEqual("rondel");
                });
              });

              test("a player who has a Swiss Bank does not receive 2m", () => {
                const game = newGame();
                game.players["player2"].cash = 0;
                game.players["player1"].cash = 4;
                game.investorCardHolder = "player1";
                // Make player1 control all countries
                game.nations.get(Nation.AH).controller = "player1";
                game.nations.get(Nation.IT).controller = "player1";
                game.nations.get(Nation.FR).controller = "player1";
                game.nations.get(Nation.GB).controller = "player1";
                game.nations.get(Nation.GE).controller = "player1";
                game.nations.get(Nation.RU).controller = "player1";
                game.players["player2"].bonds = new Set();
                // Set AH's rondel position to be something *before* investor
                game.nations.get(Nation.AH).rondelPosition = startingPosition;

                // The investor slot lies between 'maneuver1' and 'maneuver2'
                game.tick(
                  Action.rondel({
                    slot: "production2",
                    nation: Nation.AH,
                    cost: 0
                  })
                );
                // InvestorCardHolder buys a bond first
                game.tick(
                  Action.bondPurchase({
                    nation: Nation.AH,
                    player: "player1",
                    cost: 4
                  })
                );

                expect(game.players["player2"].cash).toEqual(0);
              });

              test("multiple players with a Swiss Bank may invest in clockwise order, starting with the current bearer of the investor card", () => {
                const game = newGame();
                game.investorCardHolder = "player3";
                // Make player3 control all countries
                game.nations.get(Nation.AH).controller = "player3";
                game.nations.get(Nation.IT).controller = "player3";
                game.nations.get(Nation.FR).controller = "player3";
                game.nations.get(Nation.GB).controller = "player3";
                game.nations.get(Nation.GE).controller = "player3";
                game.nations.get(Nation.RU).controller = "player3";
                game.players["player1"].bonds = new Set();
                game.players["player2"].bonds = new Set();
                game.players["player1"].cash = 30;
                game.players["player2"].cash = 30;
                game.swissBanks = ["player2", "player1"]
                // Set AH's rondel position to be something *before* investor
                game.nations.get(Nation.AH).rondelPosition = startingPosition;

                // The investor slot lies between 'maneuver1' and 'maneuver2'
                game.tick(
                  Action.rondel({
                    slot: "production2",
                    nation: Nation.AH,
                    cost: 0
                  })
                );
                game.tick(Action.skipForceInvestor({ player: "player1" }));
                game.tick(Action.skipForceInvestor({ player: "player2" }));
                // InvestorCardHolder buys a bond first
                game.tick(
                  Action.bondPurchase({
                    nation: Nation.AH,
                    player: "player3",
                    cost: 4
                  })
                );

                // For testing purposes, we delete the skip  bond purchase action
                game.availableActions.delete(Action.skipBondPurchase({ player: "player1" }));
                game.availableActions.forEach((action) => {
                  expect(action.type).toEqual("bondPurchase");
                  expect(action.payload.player).toEqual("player1");
                });

                // player1 (a Swiss Bank) buys a bond next
                game.tick(
                  Action.bondPurchase({
                    nation: Nation.IT,
                    player: "player1",
                    cost: 4
                  })
                );

                // For testing purposes, we delete the skip  bond purchase action
                game.availableActions.delete(Action.skipBondPurchase({ player: "player2" }));
                game.availableActions.forEach((action) => {
                  expect(action.type).toEqual("bondPurchase");
                  expect(action.payload.player).toEqual("player2");
                });

                // player1 (a Swiss Bank) buys a bond next
                game.tick(
                  Action.bondPurchase({
                    nation: Nation.FR,
                    player: "player2",
                    cost: 4
                  })
                );

                game.availableActions.forEach((action) => {
                  expect(action.type).toEqual("rondel");
                });
              });

              test("a player who has a Swiss Bank may choose to force the current nation to stay on the Investor slot, if the nation can pay out all the money it owes", () => {
                const game = newGame();
                game.players["player1"].cash = 2;
                game.investorCardHolder = "player1";
                game.provinces.get("a").factory = "armaments";
                game.swissBanks = ["player2", "player3"];
                // Make player1 control all countries
                game.nations.get(Nation.AH).controller = "player1";
                game.nations.get(Nation.IT).controller = "player1";
                game.nations.get(Nation.FR).controller = "player1";
                game.nations.get(Nation.GB).controller = "player1";
                game.nations.get(Nation.GE).controller = "player1";
                game.nations.get(Nation.RU).controller = "player1";
                game.players["player2"].bonds = new Set();
                // Set AH's rondel position to be something *before* investor
                game.nations.get(Nation.AH).rondelPosition = startingPosition;

                // The investor slot lies between startingPosition and "production2"
                game.tick(
                  Action.rondel({
                    slot: "production2",
                    nation: Nation.AH,
                    cost: 0
                  })
                );

                expect(game.availableActions).toEqual(new Set([
                  Action.forceInvestor({ player: "player2" }),
                  Action.skipForceInvestor({ player: "player2" }),
                  Action.forceInvestor({ player: "player3" }),
                  Action.skipForceInvestor({ player: "player3" })
                ]))

                game.tick(
                  Action.forceInvestor({
                    player: "player2"
                  })
                );

                // AH was forced to stay on investor so production never got triggered.
                expect(game.units.get(Nation.AH).get("a")).toEqual({
                  armies: 0,
                  fleets: 0,
                  friendly: true
                });
                expect(game.nations.get(Nation.AH).rondelPosition).toEqual("investor");
                expect(game.availableActions).toEqual(
                  new Set([
                    Action.skipBondPurchase({ player: "player1" }),
                    Action.bondPurchase({
                      nation: Nation.AH,
                      player: "player1",
                      cost: 4
                    }),
                    Action.bondPurchase({
                      nation: Nation.AH,
                      player: "player1",
                      cost: 6
                    }),
                    Action.bondPurchase({
                      nation: Nation.AH,
                      player: "player1",
                      cost: 12
                    }),
                    Action.bondPurchase({
                      nation: Nation.AH,
                      player: "player1",
                      cost: 16
                    }),
                    Action.bondPurchase({
                      nation: Nation.IT,
                      player: "player1",
                      cost: 4
                    }),
                    Action.bondPurchase({
                      nation: Nation.IT,
                      player: "player1",
                      cost: 6
                    }),
                    Action.bondPurchase({
                      nation: Nation.FR,
                      player: "player1",
                      cost: 4
                    }),
                    Action.bondPurchase({
                      nation: Nation.FR,
                      player: "player1",
                      cost: 6
                    }),
                    Action.bondPurchase({
                      nation: Nation.GB,
                      player: "player1",
                      cost: 4
                    }),
                    Action.bondPurchase({
                      nation: Nation.GB,
                      player: "player1",
                      cost: 6
                    }),
                    Action.bondPurchase({
                      nation: Nation.GB,
                      player: "player1",
                      cost: 12
                    }),
                    Action.bondPurchase({
                      nation: Nation.GB,
                      player: "player1",
                      cost: 16
                    }),
                    Action.bondPurchase({
                      nation: Nation.GE,
                      player: "player1",
                      cost: 4
                    }),
                    Action.bondPurchase({
                      nation: Nation.GE,
                      player: "player1",
                      cost: 6
                    }),
                    Action.bondPurchase({
                      nation: Nation.RU,
                      player: "player1",
                      cost: 4
                    }),
                    Action.bondPurchase({
                      nation: Nation.RU,
                      player: "player1",
                      cost: 6
                    })
                  ])
                );
              });

              test("a player who has a Swiss Bank may not choose to force the current nation to stay on the Investor slot, if the nation cannot pay out all the money it owes", () => {
                const game = newGame();
                game.players["player1"].cash = 2;
                game.investorCardHolder = "player1";
                game.provinces.get("a").factory = "armaments";
                // Make player1 control all countries
                game.nations.get(Nation.AH).controller = "player1";
                game.nations.get(Nation.IT).controller = "player1";
                game.nations.get(Nation.FR).controller = "player1";
                game.nations.get(Nation.GB).controller = "player1";
                game.nations.get(Nation.GE).controller = "player1";
                game.nations.get(Nation.RU).controller = "player1";
                game.players["player2"].bonds = new Set();
                // Set AH's rondel position to be something *before* investor
                game.nations.get(Nation.AH).rondelPosition = startingPosition;
                game.nations.get(Nation.AH).treasury = 0;

                // The investor slot lies between 'maneuver1' and 'maneuver2'
                game.tick(
                  Action.rondel({
                    slot: "production2",
                    nation: Nation.AH,
                    cost: 0
                  })
                );

                expect(game.availableActions).toEqual(
                  new Set([
                    Action.skipBondPurchase({ player: "player1" }),
                    Action.bondPurchase({
                      nation: Nation.AH,
                      player: "player1",
                      cost: 4
                    }),
                    Action.bondPurchase({
                      nation: Nation.AH,
                      player: "player1",
                      cost: 12
                    }),
                    Action.bondPurchase({
                      nation: Nation.IT,
                      player: "player1",
                      cost: 4
                    }),
                    Action.bondPurchase({
                      nation: Nation.FR,
                      player: "player1",
                      cost: 4
                    }),
                    Action.bondPurchase({
                      nation: Nation.GB,
                      player: "player1",
                      cost: 4
                    }),
                    Action.bondPurchase({
                      nation: Nation.GB,
                      player: "player1",
                      cost: 12
                    }),
                    Action.bondPurchase({
                      nation: Nation.GE,
                      player: "player1",
                      cost: 4
                    }),
                    Action.bondPurchase({
                      nation: Nation.GE,
                      player: "player1",
                      cost: 6
                    }),
                    Action.bondPurchase({
                      nation: Nation.RU,
                      player: "player1",
                      cost: 4
                    }),
                    Action.bondPurchase({
                      nation: Nation.RU,
                      player: "player1",
                      cost: 6
                    })
                  ])
                );
              });
            });
          }
        );
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
              { name: "p", nation: null }
            ],
            edges: []
          });

          const game = new Imperial(board);
          game.tick(
            Action.initialize({
              players: [
                { id: "player1", nation: Nation.AH },
                { id: "player2", nation: Nation.IT }
              ],
              soloMode: false
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
              { name: "b", nation: Nation.AH }
            ],
            edges: []
          });

          const game = new Imperial(board);
          game.tick(
            Action.initialize({
              players: [
                { id: "player1", nation: Nation.AH },
                { id: "player2", nation: Nation.IT }
              ],
              soloMode: false
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
              Action.buildFactory({ province: "b" })
            ])
          );
          expect(game.buildingFactory).toEqual(true);
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
          expect(game.buildingFactory).toEqual(true);
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
          expect(game.buildingFactory).toEqual(true);
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
            { name: "f", nation: Nation.IT },
            { name: "g", nation: null },
          ],
          //"g" - "a" - "e"
          //     /   \  /
          //   "b"   "d" - "c" - "f"
          edges: [
            ["a", "b"],
            ["c", "d"],
            ["a", "d"],
            ["a", "e"],
            ["c", "f"],
            ["d", "e"],
            ["a", "g"]
          ]
        });

        const game = new Imperial(board);
        game.tick(
          Action.initialize({
            players: [
              { id: "player1", nation: Nation.AH },
              { id: "player2", nation: Nation.IT }
            ],
            soloMode: false
          })
        );
        // Allow Italy to be able to afford a factory
        game.nations.get(Nation.IT).treasury = 5;
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
                "taxation"
              ].map(slot => Action.rondel({ nation: Nation.IT, cost: 0, slot }))
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
                challenger: Nation.AH
              }),
              Action.fight({
                province: "b",
                incumbent: Nation.IT,
                challenger: Nation.AH,
                targetType: "fleet"
              })
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
              Action.maneuver({ origin: "b", destination: "a" })
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
                "taxation"
              ].map(slot => Action.rondel({ nation: Nation.IT, cost: 0, slot }))
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
                challenger: Nation.AH
              }),
              Action.fight({
                province: "d",
                incumbent: Nation.IT,
                challenger: Nation.AH,
                targetType: "army"
              })
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
              Action.maneuver({ origin: "d", destination: "e" }),
              Action.maneuver({ origin: "d", destination: "f" })
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
              Action.maneuver({ origin: "c", destination: "e" }),
              Action.maneuver({ origin: "c", destination: "f" })
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
              Action.maneuver({ origin: "c", destination: "e" }),
              Action.maneuver({ origin: "c", destination: "f" })
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
                "taxation"
              ].map(slot => Action.rondel({ nation: Nation.IT, cost: 0, slot }))
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
              Action.maneuver({ origin: "d", destination: "e" }),
              Action.maneuver({ origin: "d", destination: "c" }),
              Action.maneuver({ origin: "d", destination: "f" }),
            ])
          );

          game.tick(Action.maneuver({ origin: "b", destination: "a" }));

          expect(game.availableActions).toEqual(
            new Set([
              Action.endManeuver(),
              Action.maneuver({ origin: "d", destination: "e" }),
              Action.maneuver({ origin: "d", destination: "c" }),
              Action.maneuver({ origin: "d", destination: "f" }),
              Action.maneuver({ origin: "d", destination: "g" })
            ])
          );
        });

        test("fleet can convoy only one army", () => {
          const game = newGame();
          game.units.get(Nation.AH).get("b").fleets++;
          game.units.get(Nation.AH).get("c").armies++;
          game.units.get(Nation.AH).get("c").armies++;

          game.tick(
            Action.rondel({ slot: "maneuver1", nation: Nation.AH, cost: 0 })
          );

          expect(game.availableActions).toEqual(
            new Set([
              Action.endManeuver(),
              Action.maneuver({ origin: "b", destination: "a" }),
              Action.maneuver({ origin: "c", destination: "d" }),
              Action.maneuver({ origin: "c", destination: "e" }),
              Action.maneuver({ origin: "c", destination: "f" })
            ])
          );

          game.tick(Action.maneuver({ origin: "b", destination: "a" }));

          expect(game.availableActions).toEqual(
            new Set([
              Action.endManeuver(),
              Action.maneuver({ origin: "c", destination: "d" }),
              Action.maneuver({ origin: "c", destination: "e" }),
              Action.maneuver({ origin: "c", destination: "g" }),
              Action.maneuver({ origin: "c", destination: "f" }),
            ])
          );

          game.tick(Action.maneuver({ origin: "c", destination: "g" }));

          expect(game.availableActions).toEqual(
            new Set([
              Action.endManeuver(),
              Action.maneuver({ origin: "c", destination: "d" }),
              Action.maneuver({ origin: "c", destination: "e" }),
              Action.maneuver({ origin: "c", destination: "f" })
            ])
          );
        });
      });

      describe("destroying a factory", () => {
        test("3 armies may destroy a foreign factory", () => {
          const game = newGame();
          game.provinces.get("f").factory = "armaments";
          game.units.get(Nation.AH).get("f").armies++;
          game.units.get(Nation.AH).get("f").armies++;
          game.units.get(Nation.AH).get("c").armies++;
          const availableActions = new Set([
            Action.destroyFactory({ province: "f" }),
            Action.skipDestroyFactory({ province: "f" })
          ]);

          game.tick(
            Action.rondel({ slot: "maneuver1", nation: Nation.AH, cost: 0 })
          );
          game.tick(Action.maneuver({ origin: "c", destination: "f" }));

          expect(game.availableActions).toEqual(availableActions);
        });
      });

      describe("updating the province flag", () => {
        test("maneuver army to neutral province adds a flag to the province", () => {
          const game = newGame();
          game.units.get(Nation.AH).get("c").armies++;

          game.tick(
            Action.rondel({ slot: "maneuver1", nation: Nation.AH, cost: 0 })
          );
          game.tick(Action.maneuver({ origin: "c", destination: "e" }));

          expect(game.provinces.get("e").flag).toEqual(Nation.AH);
        });

        test("maneuver army to other nation's province does not add a flag", () => {
          const game = newGame();
          game.units.get(Nation.AH).get("c").armies++;

          game.tick(
            Action.rondel({ slot: "maneuver1", nation: Nation.AH, cost: 0 })
          );
          game.tick(Action.maneuver({ origin: "c", destination: "f" }));

          expect(game.provinces.get("f").flag).toEqual(undefined);
        });
      });
    });

    describe("fight", () => {
      const newGame = () => {
        const board = new GameBoard({
          nodes: [
            { name: "a", nation: null },
            { name: "b", nation: null, isOcean: true },
            { name: "c", nation: null }
          ],
          edges: [["a", "b"], ["a", "c"]]
        });

        const game = new Imperial(board);
        game.tick(
          Action.initialize({
            players: [
              { id: "player1", nation: Nation.AH },
              { id: "player2", nation: Nation.IT }
            ],
            soloMode: false
          })
        );
        // Allow Italy to be able to afford a factory
        game.nations.get(Nation.IT).treasury = 5;
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
              targetType: null
            })
          );

          expect(game.provinces.get("a").flag).toEqual(Nation.AH);
        });

        test("both nations lose an army", () => {
          const game = newGame();
          game.units.get(Nation.AH).get("c").armies++;
          game.units.get(Nation.IT).get("a").armies++;

          game.tick(Action.rondel({nation: Nation.AH, cost: 0, slot: "maneuver1"}));
          game.tick(Action.maneuver({origin: "c", destination: "a"}));
          game.tick(
            Action.fight({
              province: "a",
              incumbent: Nation.IT,
              challenger: Nation.AH,
              targetType: "army"
            })
          );

          expect(game.units.get(Nation.AH).get("a")).toEqual({
            armies: 0,
            fleets: 0,
            friendly: false
          });
          expect(game.units.get(Nation.IT).get("a")).toEqual({
            armies: 0,
            fleets: 0,
            friendly: false
          });
        });

        test("both nations lose a fleet", () => {
          const game = newGame();
          game.units.get(Nation.AH).get("a").fleets++;
          game.units.get(Nation.IT).get("b").fleets++;

          game.tick(Action.rondel({nation: Nation.AH, cost: 0, slot: "maneuver1"}));
          game.tick(Action.maneuver({origin: "a", destination: "b"}));
          game.tick(
            Action.fight({
              province: "b",
              incumbent: Nation.IT,
              challenger: Nation.AH,
              targetType: "fleet"
            })
          );

          expect(game.units.get(Nation.AH).get("b")).toEqual({
            armies: 0,
            fleets: 0,
            friendly: false
          });
          expect(game.units.get(Nation.IT).get("b")).toEqual({
            armies: 0,
            fleets: 0,
            friendly: false
          });
        });
      });

      describe("one nation has more armies than another", () => {
        test("flag changes to the challenger", () => {
          const game = newGame();
          game.units.get(Nation.AH).get("b").armies++;
          game.units.get(Nation.IT).get("a").armies++;
          game.units.get(Nation.IT).get("a").armies++;
          game.provinces.get("a").flag = Nation.IT;

          game.tick(Action.rondel({nation: Nation.AH, cost: 0, slot: "maneuver1"}));
          game.tick(Action.maneuver({origin: "b", destination: "a"}));
          game.tick(
            Action.fight({
              province: "a",
              incumbent: Nation.IT,
              challenger: Nation.AH,
              targetType: "army"
            })
          );

          expect(game.provinces.get("a").flag).toEqual(Nation.IT);
        });

        test("both nations lose one army but another remains", () => {
          const game = newGame();
          game.units.get(Nation.IT).get("a").armies++;
          game.units.get(Nation.IT).get("a").armies++;
          game.units.get(Nation.AH).get("b").armies++;

          game.tick(Action.rondel({nation: Nation.AH, cost: 0, slot: "maneuver1"}));
          game.tick(Action.maneuver({origin: "b", destination: "a"}));
          game.tick(
            Action.fight({
              province: "a",
              incumbent: Nation.IT,
              challenger: Nation.AH,
              targetType: "army"
            })
          );

          expect(game.units.get(Nation.IT).get("a")).toEqual({
            armies: 1,
            fleets: 0,
            friendly: false
          });
          expect(game.units.get(Nation.AH).get("a")).toEqual({
            armies: 0,
            fleets: 0,
            friendly: false
          });
        });
      });

      describe("a coastal province with a mixture of armies and fleets", () => {
        test("challenger chose to attack the fleet", () => {
          const game = newGame();
          game.units.get(Nation.IT).get("a").armies++;
          game.units.get(Nation.IT).get("a").fleets++;
          game.units.get(Nation.AH).get("b").armies++;

          game.tick(Action.rondel({nation: Nation.AH, cost: 0, slot: "maneuver1"}));
          game.tick(Action.maneuver({origin: "b", destination: "a"}));
          game.tick(
            Action.fight({
              province: "a",
              incumbent: Nation.IT,
              challenger: Nation.AH,
              targetType: "fleet"
            })
          );

          expect(game.units.get(Nation.IT).get("a")).toEqual({
            armies: 1,
            fleets: 0,
            friendly: false
          });
          expect(game.units.get(Nation.AH).get("b")).toEqual({
            armies: 0,
            fleets: 0,
            friendly: false
          });
          expect(game.units.get(Nation.AH).get("a")).toEqual({
            armies: 0,
            fleets: 0,
            friendly: false
          });
        });

        test("challenger chose to attack the army", () => {
          const game = newGame();
          game.units.get(Nation.IT).get("a").armies++;
          game.units.get(Nation.IT).get("a").fleets++;
          game.units.get(Nation.AH).get("b").armies++;

          game.tick(Action.rondel({nation: Nation.AH, cost: 0, slot: "maneuver1"}));
          game.tick(Action.maneuver({origin: "b", destination: "a"}));
          game.tick(
            Action.fight({
              province: "a",
              incumbent: Nation.IT,
              challenger: Nation.AH,
              targetType: "army"
            })
          );

          expect(game.units.get(Nation.IT).get("a")).toEqual({
            armies: 0,
            fleets: 1,
            friendly: false
          });
          expect(game.units.get(Nation.AH).get("b")).toEqual({
            armies: 0,
            fleets: 0,
            friendly: false
          });
          expect(game.units.get(Nation.AH).get("a")).toEqual({
            armies: 0,
            fleets: 0,
            friendly: false
          });
        });
      });

      describe("after fight is adjudicated", () => {
        test("availalableActions are updated if challenger has no more units to move", () => {
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
              incumbent: Nation.IT,
              challenger: Nation.AH,
              targetType: "army"
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
                "taxation"
              ].map(slot => Action.rondel({ nation: Nation.IT, cost: 0, slot }))
            )
          );
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
              incumbent: Nation.IT,
              challenger: Nation.AH,
              targetType: "army"
            })
          );

          expect(game.availableActions).toEqual(
            new Set([
              Action.maneuver({ origin: "b", destination: "a" }),
              Action.endManeuver()
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
            { name: "b", nation: null }
          ],
          edges: [["a", "b"]]
        });

        const game = new Imperial(board);
        game.tick(
          Action.initialize({
            players: [
              { id: "player1", nation: Nation.AH },
              { id: "player2", nation: Nation.IT }
            ],
            soloMode: false
          })
        );
        // Allow Italy to be able to afford a factory
        game.nations.get(Nation.IT).treasury = 5;
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
            challenger: Nation.IT
          })
        );

        expect(game.units.get(Nation.AH).get("a")).toEqual({
          armies: 1,
          fleets: 0,
          friendly: false
        });
        expect(game.units.get(Nation.IT).get("a")).toEqual({
          armies: 1,
          fleets: 0,
          friendly: false
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
            challenger: Nation.IT
          })
        );

        expect(game.provinces.get("a").flag).toEqual(Nation.AH);
      });

      describe("after coexistence is adjudicated", () => {
        test("availableActions are updated if challenger has no more units to move", () => {
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
              incumbent: Nation.IT,
              challenger: Nation.AH
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
                "taxation"
              ].map(slot => Action.rondel({ nation: Nation.IT, cost: 0, slot }))
            )
          );
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
              incumbent: Nation.IT,
              challenger: Nation.AH
            })
          );

          expect(game.availableActions).toEqual(
            new Set([
              Action.endManeuver(),
              Action.maneuver({ origin: "b", destination: "a" })
            ])
          );
        });
      });
    });

    describe("currentPlayerName on new turn", () => {
      const newGame = () => {
        const board = new GameBoard({
          nodes: [
            { name: "a", nation: Nation.AH },
            { name: "b", nation: Nation.AH }
          ],
          edges: []
        });

        const game = new Imperial(board);
        game.tick(
          Action.initialize({
            players: [
              { id: "player1", nation: Nation.AH },
              { id: "player2", nation: Nation.IT }
            ],
            soloMode: false
          })
        );
        return game;
      };

      test("when nobody controls a nation, that nation skips their turn", () => {
        const game = newGame();
        // Remove player2 from controlling Italy
        game.nations.get(Nation.IT).controller = null;

        // End maneuver just because it is simple; the action is unimportant
        game.tick(Action.rondel({nation: Nation.AH, cost: 0, slot: "production1"}));

        expect(game.currentNation).toEqual(Nation.FR);
        expect(game.currentPlayerName).toEqual("player1");
      });
    });

    describe("invalid moves", () => {
      const newGame = () => {
        const board = new GameBoard({
          nodes: [
            { name: "a", nation: null },
            { name: "b", nation: null },
            { name: "c", nation: null }
          ],
          edges: [["a", "c"]]
        });

        const game = new Imperial(board);
        game.tick(
          Action.initialize({
            players: [
              { id: "player1", nation: Nation.AH },
              { id: "player2", nation: Nation.IT }
            ],
            soloMode: false
          })
        );
        return game;
      };

      test("when impossible maneuver is attempted, maneuver is rejected", () => {
        const game = newGame();
        game.units.get(Nation.AH).get("a").armies = 1;

        game.tick(Action.rondel({nation: Nation.AH, cost: 0, slot: "maneuver1"}));
        game.tick(Action.maneuver({origin: "a", destination: "b"}));

        expect(game.log).toEqual([
          Action.initialize({
            players: [
              { id: "player1", nation: Nation.AH },
              { id: "player2", nation: Nation.IT }
            ],
            soloMode: false
          }),
          Action.rondel({nation: Nation.AH, cost: 0, slot: "maneuver1"})
        ]);
      });
    });
  });
});

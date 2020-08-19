import { Nation, Bond } from "./constants.js";
import Action from "./action.js";
import standardGameBoard from "./board.js";
import setup from "./standardSetup.js";

export default class Imperial {
  static fromLog(log) {
    let game = new Imperial();
    log.forEach((entry) => game.tick(entry));
    return game;
  }

  constructor(board) {
    this.board = board || standardGameBoard;
    this.log = [];
  }

  tick(action) {
    this.log.push(action);

    switch (action.type) {
      case "noop":
        return;
      case "initialize":
        const s = setup({
          players: action.payload.players,
          provinceNames: Array.from(this.board.graph.keys()),
        });
        this.availableBonds = s.availableBonds;
        this.currentNation = s.currentNation;
        this.investorCardHolder = s.investorCardHolder;
        this.nations = s.nations;
        this.order = s.order;
        this.players = s.players;
        this.provinces = s.provinces;
        this.units = s.units;
        this.currentPlayerName = this.nations.get(
          this.currentNation
        ).controller;
        this.availableActions = new Set(this.rondelActions(Nation.AH));
        return;
      case "bondPurchase":
        this.purchaseBond(action);
        this.handleAdvancePlayer();
        return;
      case "endManeuver":
        this.currentNation = this.nextNation(this.currentNation);
        this.availableActions = new Set(this.rondelActions(this.currentNation));
        this.handleAdvancePlayer();
        return;
      case "fight":
        this.units.get(Nation.FR).get(action.payload.province).fleets -= 1;
        this.units.get(Nation.IT).get(action.payload.province).fleets -= 1;
        this.provinces.get(action.payload.province).flag =
          action.payload.incumbent;
        return;
      case "buildFactory":
        this.buildFactory(action);
        if (
          this.nations.get(this.currentNation).previousRondelPosition ===
          "maneuver1"
        ) {
          this.endOfInvestorTurn();
        }
        this.handleAdvancePlayer();
        return;
      case "import":
        action.payload.placements.forEach(({ province, type }) => {
          const nation = this.board.graph.get(province).nation;
          if (type === "army") {
            this.units.get(nation).get(province).armies++;
          } else {
            this.units.get(nation).get(province).fleets++;
          }
          this.nations.get(nation).treasury--;
        });
        const potentialPreInvestorSlots = [
          "maneuver1",
          "production1",
          "factory",
          "taxation",
          "maneuver2",
        ];
        if (
          potentialPreInvestorSlots.includes(
            this.nations.get(this.currentNation).previousRondelPosition
          )
        ) {
          this.endOfInvestorTurn();
        }
        this.handleAdvancePlayer();
        return;
      case "maneuver":
        const origin = action.payload.origin;
        const destination = action.payload.destination;
        const unitType = this.board.graph.get(destination).isOcean
          ? "fleet"
          : "army";

        // Update province flag
        this.provinces.get(destination).flag = this.currentNation;
        // TODO: Do we really want to store (and need to update)
        // flag count like this?
        this.nations.get(this.currentNation).flagCount += 1;

        // Execute the unit movement
        if (unitType === "fleet") {
          this.units.get(this.currentNation).get(origin).fleets--;
          this.units.get(this.currentNation).get(destination).fleets++;
        }
        if (unitType === "army") {
          this.units.get(this.currentNation).get(origin).armies--;
          this.units.get(this.currentNation).get(destination).armies++;

          // Fleets cannot move after armies!
          this.unitsToMove = this.unitsToMove.filter(
            ([_, type]) => type === "army"
          );
        }

        // Remove the unit that just moved from this.unitsToMove
        const i = this.unitsToMove.findIndex(
          (arr) => arr[0] === action.payload.origin && arr[1] === unitType
        );
        this.unitsToMove.splice(i, 1);

        // Interrupt manuevers in case of potential conflict!
        for (const [nation, _] of this.nations) {
          if (
            nation !== this.currentNation &&
            (this.units.get(nation).get(destination).armies > 0 ||
              this.units.get(nation).get(destination).fleets > 0)
          ) {
            this.availableActions = new Set([
              Action.coexist({
                province: destination,
                incumbent: nation,
                challenger: this.currentNation,
              }),
              Action.fight({
                province: destination,
                incumbent: nation,
                challenger: this.currentNation,
              }),
            ]);
            return;
          }
        }

        if (this.unitsToMove.length > 0) {
          const provincesWithFleets = new Map();
          const provincesWithArmies = new Map();
          const out = new Set([Action.endManeuver()]);
          this.unitsToMove.forEach(([origin, type]) => {
            const units = this.units.get(this.currentNation).get(origin);
            if (units.fleets > 0) {
              provincesWithFleets.set(origin, units.fleets);
            } else if (units.armies > 0) {
              provincesWithArmies.set(origin, units.armies);
            }
            for (const [origin, count] of provincesWithFleets) {
              for (const destination of this.board.neighborsFor({
                origin,
                nation: this.currentNation,
                isFleet: true,
                friendlyFleets: new Set(),
              })) {
                out.add(Action.maneuver({ origin, destination }));
              }
            }
            const friendlyFleets = new Set();
            for (const [province, units] of this.units.get(
              this.currentNation
            )) {
              if (units.fleets > 0) {
                friendlyFleets.add(province);
              }
            }
            for (const [origin, count] of provincesWithArmies) {
              for (const destination of this.board.neighborsFor({
                origin,
                nation: this.currentNation,
                isFleet: false,
                friendlyFleets,
              })) {
                out.add(Action.maneuver({ origin, destination }));
              }
            }
          });
          this.availableActions = out;
        } else {
          if (
            this.nations.get(this.currentNation).rondelPosition === "maneuver2"
          ) {
            const potentialPreInvestorSlots = [
              "factory",
              "production1",
              "maneuver1",
            ];
            if (
              potentialPreInvestorSlots.includes(
                this.nations.get(this.currentNation).previousRondelPosition
              )
            ) {
              this.endOfInvestorTurn();
            }
          }
          this.currentNation = this.getNation(this.log);
          this.availableActions = new Set(
            this.rondelActions(this.getNation(this.log))
          );
        }
        return;
      case "rondel":
        this.currentNation = action.payload.nation;
        this.nations.get(
          this.currentNation
        ).previousRondelPosition = this.nations.get(
          this.currentNation
        ).rondelPosition;
        this.nations.get(this.currentNation).rondelPosition =
          action.payload.slot;
        this.players[this.currentPlayerName].cash -= action.payload.cost;

        switch (action.payload.slot) {
          case "investor":
            // 1. Nation pays bond-holders interest
            for (const player of Object.keys(this.players)) {
              if (player !== this.currentPlayerName) {
                this.playerBondsOfNation(player, action.payload.nation).forEach(
                  (bond) => {
                    if (
                      this.nations.get(action.payload.nation).treasury >=
                      bond.number
                    ) {
                      this.nations.get(action.payload.nation).treasury -=
                        bond.number;
                    } else {
                      this.players[this.currentPlayerName].cash -= bond.number;
                    }
                    this.players[player].cash += bond.number;
                  }
                );
              }
            }
            // Nation pays its controller interest
            const amountOwedToController = [
              ...this.players[this.currentPlayerName].bonds,
            ]
              .filter((bond) => bond.nation === action.payload.nation)
              .reduce((x, y) => x + y.number, 0);
            if (
              this.nations.get(action.payload.nation).treasury >
              amountOwedToController
            ) {
              this.players[
                this.currentPlayerName
              ].cash += amountOwedToController;
              this.nations.get(
                action.payload.nation
              ).treasury -= amountOwedToController;
            }
            this.endOfInvestorTurn();
            return;
          case "import":
            const availableActions = new Set([
              Action.import({ placements: [] }),
            ]);
            const homeProvinces = this.board.byNation.get(
              action.payload.nation
            );
            for (const province of homeProvinces) {
              availableActions.add(
                Action.import({ placements: [{ province, type: "army" }] })
              );

              for (const province2 of homeProvinces) {
                if (province2 === province) continue;

                availableActions.add(
                  Action.import({
                    placements: [
                      { province, type: "army" },
                      { province: province2, type: "army" },
                    ],
                  })
                );

                for (const province3 of homeProvinces) {
                  if (province === province3 || province2 === province3)
                    continue;

                  availableActions.add(
                    Action.import({
                      placements: [
                        { province, type: "army" },
                        { province: province2, type: "army" },
                        { province: province3, type: "army" },
                      ],
                    })
                  );
                }
              }
            }
            this.availableActions = availableActions;
            return;
          case "production1":
          case "production2":
            Array.from(this.board.byNation.get(action.payload.nation))
              .filter(
                (province) => this.provinces.get(province).factory !== null
              )
              .forEach((province) => {
                if (this.provinces.get(province).factory === "shipyard") {
                  this.units.get(action.payload.nation).get(province).fleets++;
                } else {
                  this.units.get(action.payload.nation).get(province).armies++;
                }
              });
            if (action.payload.slot === "production2") {
              const potentialPreInvestorSlots = [
                "maneuver1",
                "production1",
                "factory",
                "taxation",
              ];
              if (
                potentialPreInvestorSlots.includes(
                  this.nations.get(this.currentNation).previousRondelPosition
                )
              ) {
                this.endOfInvestorTurn();
                this.handleAdvancePlayer();
                return;
              }
            }
            this.handleAdvancePlayer();
            this.availableActions = new Set(
              this.rondelActions(this.currentNation)
            );

            return;
          case "taxation":
            const nationName = action.payload.nation;
            const nation = this.nations.get(nationName);
            const taxes = this.factoryCount(nationName) * 2 + nation.flagCount;
            nation.treasury += taxes - this.unitCount(nationName);

            this.players[this.nations.get(nationName).controller].cash +=
              taxes - nation.taxChartPosition;
            nation.taxChartPosition = taxes;
            if (taxes === 6) {
              nation.powerPoints += 1;
            } else {
              nation.powerPoints += 3;
            }
            this.availableActions = new Set(
              this.rondelActions(this.getNation(this.log))
            );
            const potentialPreInvestorSlots = ["maneuver1", "production1"];
            if (
              potentialPreInvestorSlots.includes(
                this.nations.get(this.currentNation).previousRondelPosition
              )
            ) {
              this.endOfInvestorTurn();
            }
            return;
          case "maneuver1":
          case "maneuver2":
            const destinations = new Set([Action.endManeuver()]);

            // Collect all units that are allowed to move on this turn
            this.unitsToMove = [];
            for (const [province, units] of this.units.get(
              action.payload.nation
            )) {
              let fleetCount = units.fleets;
              let armyCount = units.armies;
              while (fleetCount > 0 || armyCount > 0) {
                if (fleetCount > 0) {
                  this.unitsToMove.push([province, "fleet"]);
                  fleetCount--;
                } else if (armyCount > 0) {
                  this.unitsToMove.push([province, "army"]);
                  armyCount--;
                }
              }
            }

            const provincesWithFleets = new Map();
            const provincesWithArmies = new Map();

            for (const [province, units] of this.units.get(
              action.payload.nation
            )) {
              if (units.fleets > 0) {
                provincesWithFleets.set(province, units.fleets);
              }
            }

            for (const [origin, count] of provincesWithFleets) {
              for (const destination of this.board.neighborsFor({
                origin,
                nation: action.payload.nation,
                isFleet: true,
                friendlyFleets: new Set(),
              })) {
                destinations.add(
                  Action.maneuver({
                    origin,
                    destination,
                  })
                );
              }
            }

            for (const [province, units] of this.units.get(
              action.payload.nation
            )) {
              if (units.armies > 0) {
                provincesWithArmies.set(province, units.armies);
              }
            }

            for (const [origin, count] of provincesWithArmies) {
              for (const destination of this.board.neighborsFor({
                origin,
                nation: action.payload.nation,
                isFleet: false,
                friendlyFleets: new Set(),
              })) {
                destinations.add(
                  Action.maneuver({
                    origin,
                    destination,
                  })
                );
              }
            }

            this.availableActions = destinations;
            return;
          case "factory":
            this.availableActions = new Set(
              this.buildFactoryAction(action.payload.nation)
            );
            return;
        }
    }
  }

  endOfInvestorTurn() {
    // 2. Investor card holder gets 2m cash
    this.players[this.investorCardHolder].cash += 2;
    // Investor card holder may buy a bond belonging to the nation
    this.availableActions = new Set(
      [...this.availableBonds]
        .filter((bond) => {
          const player = this.investorCardHolder;
          const exchangeableBondCosts = [...this.players[player].bonds]
            .filter((exchangeableBond) => {
              return exchangeableBond.nation === bond.nation;
            })
            .map((x) => x.cost);
          const topBondCost = Math.max(exchangeableBondCosts) || 0;
          return bond.cost <= this.players[player].cash + topBondCost;
        })
        .map((bond) => {
          return Action.bondPurchase({
            nation: bond.nation,
            player: this.investorCardHolder,
            cost: bond.cost,
          });
        })
    );
    // TODO: 3. Investing without a flag
  }

  playerBondsOfNation(player, nation) {
    const out = [];
    for (const bond of this.players[player].bonds) {
      if (bond.nation === nation) {
        out.push(bond);
      }
    }
    return out;
  }

  handleAdvancePlayer() {
    this.currentNation = this.getNation(this.log);
    this.currentPlayerName = this.nations.get(this.currentNation).controller;
  }

  purchaseBond(action) {
    const uncost = {
      2: 1,
      4: 2,
      6: 3,
      9: 4,
      12: 5,
      16: 6,
      20: 7,
      25: 8,
      30: 9,
    };
    const bonds = this.players[action.payload.player].bonds;
    if (action.payload.cost > this.players[action.payload.player].cash) {
      const tradeIn = [...bonds]
        .filter(({ nation }) => nation === action.payload.nation)
        .map(({ cost }) => cost)[0];
      if (tradeIn === undefined) {
        throw new Error(
          `${action.payload.player} does not have any bonds to trade for ${action.payload.nation}`
        );
      }
      const bondToTrade = Bond(action.payload.nation, uncost[tradeIn]);
      const netCost = action.payload.cost - bondToTrade.cost;
      this.nations.get(action.payload.nation).treasury += netCost;
      this.availableBonds.add(bondToTrade);
      this.players[action.payload.player].cash -= netCost;
      this.players[action.payload.player].bonds.delete(bondToTrade);
    } else {
      this.nations.get(action.payload.nation).treasury += action.payload.cost;
      this.players[action.payload.player].cash -= action.payload.cost;
    }

    const newBond = Bond(action.payload.nation, uncost[action.payload.cost]);
    if (!this.availableBonds.has(newBond)) {
      throw new Error(`${bond} not available`);
    }
    this.players[action.payload.player].bonds.add(newBond);
    this.availableBonds.delete(newBond);

    if (this.nations.get(action.payload.nation).controller === null) {
      this.nations.get(action.payload.nation).controller =
        action.payload.player;
    }

    if (
      this.totalInvestmentInNation(
        action.payload.player,
        action.payload.nation
      ) >
      this.totalInvestmentInNation(
        this.nations.get(action.payload.nation).controller,
        action.payload.nation
      )
    ) {
      this.nations.get(action.payload.nation).controller =
        action.payload.player;
    }
    this.advanceInvestorCard();
  }

  totalInvestmentInNation(player, nation) {
    return [...this.players[player].bonds]
      .filter((bond) => bond.nation === nation)
      .reduce((x, y) => x + y.cost, 0);
  }

  advanceInvestorCard() {
    if (!!this.investorCardHolder) {
      const index = this.order.indexOf(this.investorCardHolder);
      if (index === 0) {
        this.investorCardHolder = this.order[this.order.length - 1];
      } else {
        this.investorCardHolder = this.order[index - 1];
      }
    }
  }

  unitCount(nation) {
    let out = 0;
    for (const [province, units] of this.units.get(nation)) {
      out += units.armies;
      out += units.fleets;
    }
    return out;
  }

  buildFactory(action) {
    this.provinces.get(action.payload.province).factory = this.board.graph.get(
      action.payload.province
    ).factoryType;
    this.nations.get(this.currentNation).treasury -= 5;
  }

  rondelActions(nation) {
    const rondelPositions = [
      "factory",
      "production1",
      "maneuver1",
      "investor",
      "import",
      "production2",
      "maneuver2",
      "taxation",
    ];
    const currentPosition = this.nations.get(nation).rondelPosition;
    const out = new Set();
    if (currentPosition) {
      const currentIndex = rondelPositions.indexOf(currentPosition);
      const distance = currentIndex - 8;
      [
        rondelPositions[currentIndex + 1] || rondelPositions[distance + 1],
        rondelPositions[currentIndex + 2] || rondelPositions[distance + 2],
        rondelPositions[currentIndex + 3] || rondelPositions[distance + 3],
      ].forEach((slot) => {
        out.add(Action.rondel({ nation, cost: 0, slot }));
      });
      out.add(
        Action.rondel({
          nation,
          cost: 2,
          slot:
            rondelPositions[currentIndex + 4] || rondelPositions[distance + 4],
        })
      );
      out.add(
        Action.rondel({
          nation,
          cost: 4,
          slot:
            rondelPositions[currentIndex + 5] || rondelPositions[distance + 5],
        })
      );
      out.add(
        Action.rondel({
          nation,
          cost: 6,
          slot:
            rondelPositions[currentIndex + 6] || rondelPositions[distance + 6],
        })
      );
    } else {
      rondelPositions.forEach((slot) => {
        out.add(Action.rondel({ nation, cost: 0, slot }));
      });
    }
    return out;
  }

  getNation(log) {
    const rondelActions = log.filter((action) => action.type === "rondel");
    if (rondelActions.length > 0) {
      const lastTurnNation =
        rondelActions[rondelActions.length - 1].payload.nation;
      return this.nextNation(lastTurnNation);
    } else {
      return this.currentNation;
    }
  }

  nextNation(lastTurnNation) {
    return lastTurnNation.when({
      AH: () => Nation.IT,
      IT: () => Nation.FR,
      FR: () => Nation.GB,
      GB: () => Nation.GE,
      GE: () => Nation.RU,
      RU: () => Nation.AH,
    });
  }

  importAction(nation) {
    const out = new Set();
    for (const province of this.board.byNation.get(nation)) {
      if (this.board.graph.get(province).factoryType === "shipyard") {
        out.add(Action.import({ placements: [{ province, unit: "fleet" }] }));
      }
      out.add(Action.import({ placements: [{ province, unit: "army" }] }));
    }
    return out;
  }

  buildFactoryAction(nation) {
    return new Set(
      nation
        .when({
          AH: () => ["trieste", "prague", "lemburg"],
          IT: () => ["genoa", "venice", "florence"],
          FR: () => ["brest", "dijon", "marseille"],
          GB: () => ["dublin", "sheffield", "edinburgh"],
          GE: () => ["danzig", "munich", "cologne"],
          RU: () => ["kiev", "st. petersburg", "warsaw"],
        })
        .map((province) => Action.buildFactory({ province }))
    );
  }

  factoryCount(nation) {
    let count = 0;
    for (const province of this.board.byNation.get(nation)) {
      if (this.provinces.get(province).factory) {
        count++;
      }
    }
    return count;
  }
}

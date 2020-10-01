import GameBoard from "./gameBoard";

describe("GameBoard", () => {
  test("empty", () => {
    const gameBoard = new GameBoard({
      nodes: new Map(),
      edges: [],
    });
    expect(() =>
      gameBoard.neighborsFor({
        origin: "oops",
        nation: "big oops",
        friendlyFleets: new Set(),
      })
    ).toThrowError("not found");
  });

  test("edges are undirected", () => {
    const gameBoard = new GameBoard({
      nodes: [
        { name: "p1", nation: "n1", isOcean: false },
        { name: "p2", nation: "n1", isOcean: false },
      ],
      edges: [["p1", "p2"]],
    });

    expect(
      gameBoard.neighborsFor({
        origin: "p1",
        nation: "n1",
        isFleet: false,
        friendlyFleets: new Set(),
      })
    ).toEqual(new Set(["p2"]));
    expect(
      gameBoard.neighborsFor({
        origin: "p2",
        nation: "n1",
        isFleet: false,
        friendlyFleets: new Set(),
      })
    ).toEqual(new Set(["p1"]));
  });

  describe("railroad rule", () => {
    const gameBoard = new GameBoard({
      nodes: [
        { name: "1", nation: "a", isOcean: false },
        { name: "2", nation: "a", isOcean: false },
        { name: "3", nation: "a", isOcean: false },
        { name: "4", nation: "b", isOcean: false },
        { name: "5", nation: "b", isOcean: false },
      ],
      edges: [
        ["1", "2"],
        ["2", "3"],
        ["3", "4"],
        ["4", "5"],
      ],
    });

    test("home unit can use railroads", () => {
      expect(
        gameBoard.neighborsFor({
          origin: "1",
          nation: "a",
          isFleet: false,
          friendlyFleets: new Set(),
        })
      ).toEqual(new Set(["2", "3", "4"]));
    });

    test("foreign unit cannot use railroads", () => {
      expect(
        gameBoard.neighborsFor({
          origin: "1",
          nation: "b",
          isFleet: false,
          friendlyFleets: new Set(),
        })
      ).toEqual(new Set(["2"]));
    });

    test("home unit in the middle can go places", () => {
      expect(
        gameBoard.neighborsFor({
          origin: "3",
          nation: "a",
          isFleet: false,
          friendlyFleets: new Set(),
        })
      ).toEqual(new Set(["1", "2", "4"]));
    });

    test("foreign unit in the middle can go fewer places", () => {
      expect(
        gameBoard.neighborsFor({
          origin: "3",
          nation: "b",
          isFleet: false,
          friendlyFleets: new Set(),
        })
      ).toEqual(new Set(["2", "4"]));
    });
  });

  describe("fleets", () => {
    const gameBoard = new GameBoard({
      nodes: [
        { name: "1", nation: "a", isOcean: false },
        { name: "2", nation: null, isOcean: true },
        { name: "3", nation: "a", isOcean: false },
      ],
      edges: [
        ["1", "2"],
        ["1", "3"],
      ],
    });

    test("fleet can move from land to sea", () => {
      expect(
        gameBoard.neighborsFor({
          origin: "1",
          nation: "a",
          isFleet: true,
          friendlyFleets: new Set(),
        })
      ).toEqual(new Set(["2"]));
    });

    test("fleets cannot use railroad rule", () => {
      expect(
        gameBoard.neighborsFor({
          origin: "3",
          nation: "a",
          isFleet: true,
          friendlyFleets: new Set(),
        })
      ).toEqual(new Set());
    });

    test("army cannot move from land to sea", () => {
      expect(
        gameBoard.neighborsFor({
          origin: "1",
          nation: "a",
          isFleet: false,
          friendlyFleets: new Set(),
        })
      ).toEqual(new Set(["3"]));
    });

    test("fleet cannot move from sea to land", () => {
      expect(
        gameBoard.neighborsFor({
          origin: "2",
          nation: "a",
          isFleet: true,
          friendlyFleets: new Set(),
        })
      ).toEqual(new Set());
    });
  });

  describe("convoy", () => {
    const gameBoard = new GameBoard({
      nodes: [
        { name: "1", nation: "a", isOcean: false },
        {
          name: "2",
          nation: null,
          isOcean: true,
        },
        {
          name: "3",
          nation: null,
          isOcean: true,
        },
        { name: "4", nation: "b", isOcean: false },
      ],
      edges: [
        ["1", "2"],
        ["2", "3"],
        ["3", "4"],
      ],
    });

    test("army can move across multiple ocean provinces if friendly fleets are there", () => {
      expect(
        gameBoard.neighborsFor({
          origin: "1",
          nation: "a",
          isFleet: false,
          friendlyFleets: new Set(["2", "3"]),
        })
      ).toEqual(new Set(["4"]));
    });

    test("army cannot move across ocean in the absence of a friendly fleet", () => {
      expect(
        gameBoard.neighborsFor(
          {
            origin: "1",
            nation: "b",
            isFleet: false,
            friendlyFleets: new Set(),
          },
          new Set()
        )
      ).toEqual(new Set());
    });
  });
});

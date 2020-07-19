import GameBoard from "./gameBoard";

describe("GameBoard", () => {
  test("empty", () => {
    const gameBoard = new GameBoard({
      nodes: new Map(),
      edges: [],
    });
    expect(() =>
      gameBoard.neighborsFor({ province: "oops", nation: "big oops" })
    ).toThrowError("not found");
  });

  test("edges are undirected", () => {
    const gameBoard = new GameBoard({
      nodes: new Map([
        ["p1", "n1"],
        ["p2", "n1"],
      ]),
      edges: [["p1", "p2"]],
    });

    expect(gameBoard.neighborsFor({ province: "p1", nation: "n1" })).toEqual(
      new Set(["p2"])
    );
    expect(gameBoard.neighborsFor({ province: "p2", nation: "n1" })).toEqual(
      new Set(["p1"])
    );
  });

  describe("railroad rule", () => {
    const gameBoard = new GameBoard({
      nodes: new Map([
        ["1", "a"],
        ["2", "a"],
        ["3", "a"],
        ["4", "b"],
        ["5", "b"],
      ]),
      edges: [
        ["1", "2"],
        ["2", "3"],
        ["3", "4"],
        ["4", "5"],
      ],
    });

    test("home unit can use railroads", () => {
      expect(gameBoard.neighborsFor({ province: "1", nation: "a" })).toEqual(
        new Set(["2", "3", "4"])
      );
    });

    test("foreign unit cannot use railroads", () => {
      expect(gameBoard.neighborsFor({ province: "1", nation: "b" })).toEqual(
        new Set(["2"])
      );
    });

    test("home unit in the middle can go places", () => {
      expect(gameBoard.neighborsFor({ province: "3", nation: "a" })).toEqual(
        new Set(["1", "2", "4"])
      );
    });

    test("foreign unit in the middle can go fewer places", () => {
      expect(gameBoard.neighborsFor({ province: "3", nation: "b" })).toEqual(
        new Set(["2", "4"])
      );
    });
  });
});

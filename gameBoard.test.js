import GameBoard from "./gameBoard";

describe("GameBoard", () => {
  test("empty", () => {
    const gameBoard = new GameBoard(new Map(), []);
    expect(() =>
      gameBoard.neighborsFor({ province: "oops", nation: "big oops" })
    ).toThrowError();
  });

  test("unknown nation", () => {
    const gameBoard = new GameBoard(new Map([["1", "a"]]), []);

    expect(() =>
      gameBoard.neighborsFor({ province: "1", nation: "oops" })
    ).toThrowError();
  });

  test("edges are undirected", () => {
    const gameBoard = new GameBoard(
      new Map([
        ["p1", "n1"],
        ["p2", "n1"],
      ]),
      [["p1", "p2"]]
    );

    expect(gameBoard.neighborsFor({ province: "p1", nation: "n1" })).toEqual(
      new Set(["p2"])
    );
    expect(gameBoard.neighborsFor({ province: "p2", nation: "n1" })).toEqual(
      new Set(["p1"])
    );
  });

  test("railroad rule", () => {
    const gameBoard = new GameBoard(
      new Map([
        ["1", "a"],
        ["2", "a"],
        ["3", "b"],
      ]),
      [
        ["1", "2"],
        ["2", "3"],
      ]
    );

    expect(gameBoard.neighborsFor({ province: "1", nation: "a" })).toEqual(
      new Set(["2", "3"])
    );
    expect(gameBoard.neighborsFor({ province: "1", nation: "b" })).toEqual(
      new Set(["2"])
    );
    expect(gameBoard.neighborsFor({ province: "3", nation: "a" })).toEqual(
      new Set(["2"])
    );
  });
});

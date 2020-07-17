import GameBoard from "./gameBoard";

describe("GameBoard", () => {
  test("it works really well", () => {
    const gameBoard = new GameBoard(
      new Map([
        ["p1", "n1"],
        ["p2", "n1"],
      ]),
      [["p1", "p2"]]
    );

    const originUnit = {
      province: "p1",
      nation: "n1",
    };

    const neighbors = new Set(["p2"]);

    expect(gameBoard.neighborsFor(originUnit)).toEqual(neighbors);
  });
});

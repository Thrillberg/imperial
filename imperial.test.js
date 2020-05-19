const imperial = require("./imperial");
let gameState = require('./startingGameState');

describe("Austria-Hungary selects their first turn action", () => {
  test("franzJosef is on the first rondel space", () => {
    expect(imperial.selectAction(0, gameState).rondelPositions.franzJosef).toEqual(0);
  });
})

describe("buildFactory action", () => {
  test("it costs 5 money", () => {
    expect(imperial.buildFactory(gameState).money.austriaHungary).toEqual(-3);
  })
})

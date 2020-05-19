const imperial = require("./imperial");
let gameState = require('./startingGameState');

describe("Austria-Hungary selects their first turn action", () => {
  test("franzJosef is on the first rondel space", () => {
    expect(imperial.selectAction(0, gameState)).toEqual(0);
    expect(gameState.rondel[0][0]).toEqual("franzJosef");
  });
})

describe("buildFactory action", () => {
  test("it costs 5 money", () => {
    expect(imperial.buildFactory(gameState)).toEqual(5);
    expect(gameState.money.austriaHungary).toEqual(-3);
  })
})

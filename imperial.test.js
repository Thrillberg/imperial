const imperial = require("./imperial");
const gameState = require('./startingGameState');

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

describe("available actions", () => {
  test("empty state", () => {
    const log = []
    const actions = imperial.getAvailableActions(log)
    const expected = ['factory', 'production1', 'maneuver1', 'investor', 'import', 'production2', 'maneuver2', 
  'taxation'].map((slot) => ({
    type: 'rondel', payload: {nation: 'AH', cost: 0, slot}
  }))
    expect(actions).toEqual(new Set(expected))
  })

  test("AH moved to the factory slot", () => {
    const log = [{type: 'rondel', payload: {nation: 'AH', cost: 0, slot: "factory"}}]
    const actions = imperial.getAvailableActions(log)
    const expected = new Set([
      'trieste', 'prague', 'lemburg'
    ].map((province) => ({type: 'buildFactory', payload: {province}})))
    expect(actions).toEqual(expected) 
  })

  test("AH built a factory in Trieste", () => {
    const log = [
      {type: 'rondel', payload: {nation: 'AH', cost: 0, slot: "factory"}},
      {type: 'buildFactory', payload: {province: 'trieste'}}
    ]
    const actions = imperial.getAvailableActions(log)
    const expected = ['factory', 'production1', 'maneuver1', 'investor', 'import', 'production2', 'maneuver2', 
    'taxation'].map((slot) => ({
      type: 'rondel', payload: {nation: 'IT', cost: 0, slot}
    }))
      expect(actions).toEqual(new Set(expected))
  })
})
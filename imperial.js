let gameState = require('./startingGameState');

function imperial() {
  return selectAction(0, gameState);
}

function selectAction(actionIndex, gameState) {
  gameState.rondel[actionIndex].push(getAustrianPlayer(gameState.investors))
  return gameState
}

function getAustrianPlayer(investors) {
  return Object.entries(investors).filter((entry) => {
    return entry[1].austriaHungary === Math.max(...investorsInvestmentsInAustria(allInvestorsInAustria(investors)))
  })[0]
}

function investorsInvestmentsInAustria(investors) {
  return investors.map(investor => investor[1].austriaHungary);
}

function allInvestorsInAustria(investors) {
  return Object.entries(investors).filter((entry) => {
    return (Number.isInteger(entry[1].austriaHungary))
  })
}

module.exports = imperial;

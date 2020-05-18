let gameState = require('./startingGameState');

function imperial() {
  return selectAction(gameState);
}

function selectAction(gameState) {
  const player = getAustrianPlayer(gameState.investors);
  return player;
}

function getAustrianPlayer(investors) {
  return Object.entries(investors).filter((entry) => {
    return entry[1].austriaHungary === Math.max(...investorsInvestmentsInAustria(allInvestorsInAustria(investors)))
  })[0][0]
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

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
    return entry[1].austriaHungary === Math.max(...allInvestorsInAustria(investors).map(investor => investor[1]))
  })[0][0]
}

function allInvestorsInAustria(investors) {
  return Object.entries(investors).map((entry) => {
    const investorName = entry[0];
    const investments = entry[1];

    if (Number.isInteger(investments.austriaHungary)) {
      return [investorName, investments.austriaHungary]
    }
  }).filter(Boolean);
}

module.exports = imperial;

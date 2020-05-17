let gameState = require('./startingGameState');

function imperial() {
  return selectAction(gameState);
}

function selectAction(gameState) {
  const player = getAustrianPlayer(gameState);
  return player;
}

function getAustrianPlayer(gameState) {
  const investors = gameState.investors
  const austriaHungaryInvestments = Object.entries(investors).map((entry) => {
    const investorName = entry[0];
    const investments = entry[1];

    if (Number.isInteger(investments.austriaHungary)) {
      return [investorName, investments.austriaHungary]
    }
  }).filter(Boolean);
  leadingInvestor = "";
  leadingInvestment = 0;
  austriaHungaryInvestments.forEach((investment) => {
    if (investment[1] > leadingInvestment) {
      leadingInvestor = investment[0]
      leadingInvestment = investment[1]
    }
  });
  return leadingInvestor;
}

module.exports = imperial;

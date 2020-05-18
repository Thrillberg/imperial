let gameState = require('./startingGameState');

function imperial() {
  return selectAction(0, gameState);
}

function selectAction(actionIndex, gameState) {
  gameState.rondel[actionIndex].push(getAustrianPlayer(gameState.investments))
  return gameState
}

function getAustrianPlayer(investments) {
  return leadingAustrianInvestment(investments).investor
}

function leadingAustrianInvestment(investments) {
  return investments.filter(isLeadingAustrianInvestment)[0]
}

function isLeadingAustrianInvestment(investments) {
  return function(investment) {
    return investment.amount === Math.max(allAustrianInvestments(investments))
  }
}

function allAustrianInvestments(investments) {
  return investments.filter(isAustrianInvestment).map(investmentAmount)
}

function isAustrianInvestment(investment) {
  return investment.country === "austriaHungary";
}

function investmentAmount(investment) {
  return investment.amount;
}

module.exports = imperial;

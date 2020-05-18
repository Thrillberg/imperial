let gameState = require('./startingGameState');

function imperial() {
  if (selectAction(0, gameState) === 0) {
    return buildFactory(gameState)
  }
}

function selectAction(actionIndex, gameState) {
  gameState.rondel[actionIndex].push(getAustrianPlayer(gameState.investments))
  return actionIndex
}

function buildFactory(gameState) {
  return payToBank(5, gameState)
}

function getAustrianPlayer(investments) {
  return leadingAustrianInvestment(investments).investor
}

function payToBank(amount, gameState) {
  gameState.money[gameState.currentCountry] -= amount
  return gameState
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

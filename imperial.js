const imperial = {
  play(gameState) {
    if (this.selectAction(0, gameState) === 0) {
      return this.buildFactory(gameState)
    }
  },

  selectAction(actionIndex, gameState) {
    gameState.rondel[actionIndex].push(this.getAustrianPlayer(gameState.investments))
    return actionIndex
  },
  
  buildFactory(gameState) {
    return this.payToBank(5, gameState)
  },
  
  getAustrianPlayer(investments) {
    return this.leadingAustrianInvestment(investments).investor
  },
  
  payToBank(amount, gameState) {
    gameState.money[gameState.currentCountry] -= amount
    return amount
  },
  
  leadingAustrianInvestment(investments) {
    return investments.filter(this.isLeadingAustrianInvestment)[0]
  },
  
  isLeadingAustrianInvestment(investments) {
    return function(investment) {
      return investment.amount === Math.max(this.allAustrianInvestments(investments))
    }
  },
  
  allAustrianInvestments(investments) {
    return investments.filter(isAustrianInvestment).map(investmentAmount)
  },
  
  isAustrianInvestment(investment) {
    return investment.country === "austriaHungary";
  },
  
  investmentAmount(investment) {
    return investment.amount;
  }
}

module.exports = imperial;

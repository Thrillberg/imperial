const imperial = {
  play(gameState) {
    if (this.selectAction(0, gameState).rondelPositions.franzJosef === 0) {
      return this.buildFactory(gameState)
    }
  },

  selectAction(actionIndex, gameState) {
    const key = "rondelPositions"
    const austrianPlayer = this.getAustrianPlayer(gameState.investments)
    const value = this.updateGameState(gameState.rondelPositions, austrianPlayer, actionIndex)
    return this.updateGameState(gameState, key, value)
  },
  
  buildFactory(gameState) {
    return this.payToBank(5, gameState)
  },
  
  getAustrianPlayer(investments) {
    return this.leadingAustrianInvestment(investments).investor
  },
  
  payToBank(amount, gameState) {
    const key = "money"
    const currentCountry = gameState.currentCountry
    const value = this.updateGameState(gameState.money, currentCountry, gameState.money[currentCountry] - amount)
    return this.updateGameState(gameState, key, value)
  },
  
  leadingAustrianInvestment(investments) {
    return investments.filter(this.isLeadingAustrianInvestment)[0]
  },
  
  isLeadingAustrianInvestment(investments) {
    return investment => investment.amount === Math.max(this.allAustrianInvestments(investments))
  },
  
  allAustrianInvestments(investments) {
    return investments.filter(isAustrianInvestment).map(investmentAmount)
  },
  
  isAustrianInvestment(investment) {
    return investment.country === "austriaHungary";
  },
  
  investmentAmount(investment) {
    return investment.amount;
  },

  updateGameState(gameState, key, value) {
    return Object.assign({}, gameState, {[key]: value})
  }
}

module.exports = imperial;

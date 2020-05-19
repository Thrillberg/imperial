const imperial = {
  play(gameState) {
    if (this.selectAction(0, gameState).rondelPositions.franzJosef === 0) {
      return this.buildFactory(gameState)
    }
  },

  selectAction(actionIndex, gameState) {
    const austrianPlayer = this.getAustrianPlayer(gameState.investments)
    let newRondelPositions = Object.assign({}, gameState.rondelPositions, {[austrianPlayer]: actionIndex})
    return Object.assign({}, gameState, {rondelPositions: newRondelPositions})
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
  }
}

module.exports = imperial;

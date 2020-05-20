const imperial = {
  play(gameState) {
    if (this.selectAction(0, gameState).rondelPositions.franzJosef === 0) {
      return this.buildFactory(gameState)
    }
  },

  selectAction(actionIndex, gameState) {
    const austrianPlayer = this.getAustrianPlayer(gameState.investments)
    return this.updateRondelPositions(gameState, austrianPlayer, actionIndex)
  },
  
  buildFactory(gameState) {
    return this.payToBank(5, gameState)
  },
  
  getAustrianPlayer(investments) {
    return this.leadingAustrianInvestment(investments).investor
  },
  
  payToBank(amount, gameState) {
    const currentCountry = gameState.currentCountry
    const newAmount = gameState.money[currentCountry] - amount
    return this.updateMoney(gameState, currentCountry, newAmount)
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

  update(object, key, value) {
    return Object.assign({}, object, {[key]: value})
  },

  updateRondelPositions(gameState, key, value) {
    const newRondelPositions = this.update(gameState.rondelPositions, key, value)
    return this.update(gameState, "rondelPositions", newRondelPositions)
  },

  updateMoney(gameState, key, value) {
    const newMoney = this.update(gameState.money, key, value)
    return this.update(gameState, "money", newMoney)
  }
}

module.exports = imperial
// define(imperial)
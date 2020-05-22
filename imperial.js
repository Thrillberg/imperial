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
module.exports.getAvailableActions = (log) => {
  if (log.length == 0 || log[log.length - 1].type == 'buildFactory') {
    // find the last 'rondel' nation
    // boop up by one on the list of nations
    return new Set(['factory', 'production1', 'maneuver1', 'investor', 'import', 'production2', 'maneuver2', 
    'taxation'].map((slot) => ({
      type: 'rondel', payload: {nation: 'AH', cost: 0, slot}
    })))
  } else {
    return new Set([
      'trieste', 'prague', 'lemburg'
    ].map((province) => ({type: 'buildFactory', payload: {province}})))
  }
}

/*
events = []
initial = {}

at setup:
score == 0
2-5 in the tax chart
predetermined territories
  (2 factories each, in the square cities)

assume 6 players for now
13mm per player
pay 9mm -> their "own" nation
pay 2mm -> their "sister" nation

rondel is empty
*/

/*
<- events is empty
-> it's austria-hungary's controller's turn
-> validRondelPositions(Country) -> [RondelSlot]
*/

/*
<- events has {AH placed token in rondel @ ??}
*/
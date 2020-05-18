const startingGameState = {
  rondel: [[],[],[],[],[],[],[],[]],
  taxChart: {

  },
  countries: {
    austriaHungary: {
      score: 0,
    },
    italy: {
      score: 0,
    },
    france: {
      score: 0,
    },
    uk: {
      score: 0,
    },
    germany: {
      score: 0,
    },
    russia: {
      score: 0,
    }
  },
  investors: {
    franzJosef: {
      austriaHungary: 9,
      germany: 2
    },
    nicholas: {
      russia: 9,
      france: 2
    },
    raymond: {
      france: 9,
      austriaHungary: 2
    },
    george: {
      uk: 9,
      russia: 2
    },
    wilhelm: {
      germany: 9,
      italy: 2
    },
    victor: {
      italy: 9,
      uk: 2
    },
  }
}

module.exports = startingGameState;
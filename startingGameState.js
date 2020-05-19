const startingGameState = {
  currentCountry: "austriaHungary",
  money: {
    austriaHungary: 2,
    italy: 2,
    france: 2,
    uk: 2,
    germany: 2,
    russia: 2
  },
  rondelPositions: {
    franzJosef: null,
    victor: null,
    raymond: null,
    uk: null,
    germany: null,
    russia: null
  },
  taxChart: {},
  countries: {
    austriaHungary: { score: 0 },
    italy: { score: 0 },
    france: { score: 0 },
    uk: { score: 0 },
    germany: { score: 0 },
    russia: { score: 0 }
  },
  investments: [
    { investor: "franzJosef", country: "austriaHungary", amount: 9 },
    { investor: "franzJosef", country: "germany", amount: 2 },
    { investor: "nicholas", country: "russia", amount: 9 },
    { investor: "nicholas", country: "france", amount: 2 },
    { investor: "raymond", country: "france", amount: 9 },
    { investor: "raymond", country: "austriaHungary", amount: 2 },
    { investor: "george", country: "uk", amount: 9 },
    { investor: "george", country: "russia", amount: 2 },
    { investor: "wilhelm", country: "germany", amount: 9 },
    { investor: "wilhelm", country: "italy", amount: 2 },
    { investor: "victor", country: "italy", amount: 9 },
    { investor: "victor", country: "uk", amount: 2 }
  ]
}

module.exports = startingGameState;
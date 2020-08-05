import { Nation } from "./constants.js";
import Action from "./action.js";
import setup from "./standardSetup.js";

export default [
  // setup
  Action.initialize({
    players: [
      { id: "Daniel", nation: Nation.RU },
      { id: "Claudia", nation: Nation.FR },
      { id: "Bert", nation: Nation.GB },
      { id: "Anton", nation: Nation.IT },
    ],
    setup,
  }),
  Action.noop,
  Action.noop,
  Action.noop,
  Action.noop,
  Action.noop,
  Action.noop,
  Action.noop,
  Action.noop,
  Action.noop,
  Action.noop,
  Action.noop,
  Action.noop,
  Action.noop,
  // first round
  Action.rondel({ nation: Nation.AH, cost: 0, slot: "import" }),
  Action.import([
    { province: "trieste", type: "fleet" },
    { province: "lemberg", type: "army" },
  ]),
  Action.noop,
  Action.rondel({ nation: Nation.IT, cost: 0, slot: "investor" }),
  Action.bondPurchase({ nation: Nation.GE, player: "Daniel", cost: 4 }),
  Action.rondel({ nation: Nation.FR, cost: 0, slot: "factory" }),
  Action.buildFactory({ province: "marseille" }),
  Action.rondel({ nation: Nation.GB, cost: 0, slot: "production1" }),
  Action.rondel({ nation: Nation.GE, cost: 0, slot: "production2" }),
  Action.rondel({ nation: Nation.RU, cost: 0, slot: "investor" }),
  Action.bondPurchase({ nation: Nation.GE, player: "Anton", cost: 6 }),
  // second round
  Action.rondel({ nation: Nation.AH, cost: 0, slot: "production2" }),
  Action.rondel({ nation: Nation.IT, cost: 0, slot: "production2" }),
  Action.rondel({ nation: Nation.FR, cost: 0, slot: "production1" }),
  Action.rondel({ nation: Nation.GB, cost: 0, slot: "maneuver1" }),
  Action.maneuver({ origin: "liverpool", destination: "north atlantic" }),
  Action.maneuver({ origin: "london", destination: "english channel" }),
  Action.rondel({ nation: Nation.GE, cost: 0, slot: "maneuver2" }),
  Action.maneuver({ origin: "hamburg", destination: "north sea" }),
  Action.maneuver({ origin: "berlin", destination: "norway" }),
  Action.rondel({ nation: Nation.RU, cost: 0, slot: "import" }),
  Action.import([
    { province: "st. petersburg", type: "fleet" },
    { province: "moscow", type: "army" },
    { province: "moscow", type: "army" },
  ]),
  Action.noop,
  Action.noop,
  // third round
  Action.rondel({ nation: Nation.AH, cost: 0, slot: "maneuver2" }),
  Action.maneuver({ origin: "trieste", destination: "ionian sea" }),
  Action.maneuver({ origin: "lemberg", destination: "romania" }),
  Action.maneuver({ origin: "budapest", destination: "west balkan" }),
  Action.maneuver({ origin: "vienna", destination: "tunis" }),
  Action.rondel({ nation: Nation.IT, cost: 0, slot: "maneuver2" }),
  Action.maneuver({
    origin: "naples",
    destination: "western mediterranean sea",
  }),
  Action.maneuver({ origin: "rome", destination: "spain" }),
  Action.rondel({ nation: Nation.FR, cost: 0, slot: "maneuver1" }),
  Action.maneuver({
    origin: "marseille",
    destination: "western mediterranean sea",
  }),
  Action.maneuver({
    origin: "bordeaux",
    destination: "bay of biscay",
  }),
  Action.maneuver({
    origin: "paris",
    destination: "morocco",
  }),
  Action.rondel({ nation: Nation.GB, cost: 0, slot: "investor" }),
  Action.bondPurchase({ nation: Nation.RU, player: "Bert", cost: 6 }),
  Action.rondel({ nation: Nation.GE, cost: 0, slot: "taxation" }),
  Action.rondel({ nation: Nation.RU, cost: 0, slot: "production2" }),
  // fourth round
  Action.rondel({ nation: Nation.AH, cost: 0, slot: "taxation" }),
  Action.rondel({ nation: Nation.IT, cost: 0, slot: "production1" }),
  Action.rondel({ nation: Nation.FR, cost: 0, slot: "production2" }),
  Action.bondPurchase({ nation: Nation.AH, player: "Claudia", cost: 6 }),
  Action.rondel({ nation: Nation.GB, cost: 0, slot: "production2" }),
  Action.rondel({ nation: Nation.GE, cost: 0, slot: "factory" }),
  Action.buildFactory({ province: "cologne" }),
  Action.rondel({ nation: Nation.RU, cost: 0, slot: "maneuver2" }),
  Action.maneuver({
    origin: "st. petersburg",
    destination: "baltic sea",
  }),
  Action.maneuver({
    origin: "odessa",
    destination: "black sea",
  }),
  Action.maneuver({
    origin: "moscow",
    destination: "sweden",
  }),
  Action.maneuver({
    origin: "moscow",
    destination: "turkey",
  }),
  Action.maneuver({
    origin: "moscow",
    destination: "lemberg",
  }),
];

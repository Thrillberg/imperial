import { Nation } from './constants';
import Action from './action';

export default [
  // setup
  Action.initialize({
    players: [
      { id: 'Daniel', nation: Nation.RU },
      { id: 'Claudia', nation: Nation.FR },
      { id: 'Bert', nation: Nation.GB },
      { id: 'Anton', nation: Nation.IT },
    ],
    soloMode: false,
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
  Action.rondel({ nation: Nation.AH, cost: 0, slot: 'import' }),
  Action.import({
    placements: [
      { province: 'trieste', type: 'fleet' },
      { province: 'lemberg', type: 'army' },
    ],
  }),
  Action.noop,
  Action.rondel({ nation: Nation.IT, cost: 0, slot: 'investor' }),
  Action.bondPurchase({ nation: Nation.GE, player: 'Daniel', cost: 4 }),
  Action.rondel({ nation: Nation.FR, cost: 0, slot: 'factory' }),
  Action.buildFactory({ province: 'marseille' }),
  Action.rondel({ nation: Nation.GB, cost: 0, slot: 'production1' }),
  Action.rondel({ nation: Nation.GE, cost: 0, slot: 'production2' }),
  Action.rondel({ nation: Nation.RU, cost: 0, slot: 'investor' }),
  Action.bondPurchase({ nation: Nation.GE, player: 'Anton', cost: 6 }),
  // second round
  Action.rondel({ nation: Nation.AH, cost: 0, slot: 'production2' }),
  Action.rondel({ nation: Nation.IT, cost: 0, slot: 'production2' }),
  Action.rondel({ nation: Nation.FR, cost: 0, slot: 'production1' }),
  Action.rondel({ nation: Nation.GB, cost: 0, slot: 'maneuver1' }),
  Action.maneuver({ origin: 'liverpool', destination: 'northatlantic' }),
  Action.maneuver({ origin: 'london', destination: 'englishchannel' }),
  Action.rondel({ nation: Nation.GE, cost: 0, slot: 'maneuver2' }),
  Action.maneuver({ origin: 'hamburg', destination: 'northsea' }),
  Action.maneuver({ origin: 'berlin', destination: 'norway' }),
  Action.rondel({ nation: Nation.RU, cost: 0, slot: 'import' }),
  Action.import({
    placements: [
      { province: 'stpetersburg', type: 'fleet' },
      { province: 'moscow', type: 'army' },
      { province: 'moscow', type: 'army' },
    ],
  }),
  Action.noop,
  Action.noop,
  // third round
  Action.rondel({ nation: Nation.AH, cost: 0, slot: 'maneuver2' }),
  Action.maneuver({ origin: 'trieste', destination: 'ioniansea' }),
  Action.maneuver({ origin: 'lemberg', destination: 'romania' }),
  Action.maneuver({ origin: 'budapest', destination: 'westbalkan' }),
  Action.maneuver({ origin: 'vienna', destination: 'tunis' }),
  Action.rondel({ nation: Nation.IT, cost: 0, slot: 'maneuver2' }),
  Action.maneuver({
    origin: 'naples',
    destination: 'westernmediterraneansea',
  }),
  Action.maneuver({ origin: 'rome', destination: 'spain' }),
  Action.rondel({ nation: Nation.FR, cost: 0, slot: 'maneuver1' }),
  Action.maneuver({
    origin: 'marseille',
    destination: 'westernmediterraneansea',
  }),
  Action.fight({
    province: 'westernmediterraneansea',
    incumbent: Nation.IT,
    challenger: Nation.FR,
    targetType: 'fleet',
  }),
  Action.maneuver({
    origin: 'bordeaux',
    destination: 'bayofbiscay',
  }),
  Action.maneuver({
    origin: 'paris',
    destination: 'morocco',
  }),
  Action.rondel({ nation: Nation.GB, cost: 0, slot: 'investor' }),
  Action.bondPurchase({ nation: Nation.RU, player: 'Bert', cost: 6 }),
  Action.rondel({ nation: Nation.GE, cost: 0, slot: 'taxation' }),
  Action.rondel({ nation: Nation.RU, cost: 0, slot: 'production2' }),
  // fourth round
  Action.rondel({ nation: Nation.AH, cost: 0, slot: 'taxation' }),
  Action.rondel({ nation: Nation.IT, cost: 0, slot: 'production1' }),
  Action.rondel({ nation: Nation.FR, cost: 0, slot: 'production2' }),
  Action.bondPurchase({ nation: Nation.AH, player: 'Claudia', cost: 6 }),
  Action.rondel({ nation: Nation.GB, cost: 0, slot: 'production2' }),
  Action.rondel({ nation: Nation.GE, cost: 0, slot: 'factory' }),
  Action.buildFactory({ province: 'cologne' }),
  Action.rondel({ nation: Nation.RU, cost: 0, slot: 'maneuver2' }),
  Action.maneuver({
    origin: 'stpetersburg',
    destination: 'balticsea',
  }),
  Action.maneuver({
    origin: 'odessa',
    destination: 'blacksea',
  }),
  Action.maneuver({
    origin: 'moscow',
    destination: 'sweden',
  }),
  Action.maneuver({
    origin: 'moscow',
    destination: 'turkey',
  }),
  Action.maneuver({
    origin: 'moscow',
    destination: 'lemberg',
  }),
  // fifth round
  Action.rondel({ nation: Nation.AH, cost: 0, slot: 'maneuver1' }),
  Action.maneuver({
    origin: 'ioniansea',
    destination: 'westernmediterraneansea',
  }),
  Action.maneuver({ origin: 'tunis', destination: 'algeria' }),
  Action.maneuver({ origin: 'westbalkan', destination: 'bulgaria' }),
  Action.maneuver({ origin: 'romania', destination: 'odessa' }),
];

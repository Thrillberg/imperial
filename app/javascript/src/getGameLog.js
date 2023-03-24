import { Nation, Nation2030, NationAsia } from '../lib/constants';

export default (rawLog, baseGame) => rawLog.map((rawAction) => {
  // The following map only exists because of our custom Nation type, which
  // has weirdness when we attempt nation.when() in the setup file.
  let nations;
  if (baseGame === 'imperial') {
    nations = Nation;
  } else if (baseGame === 'imperial2030') {
    nations = Nation2030;
  } else if (baseGame === 'imperialAsia') {
    nations = NationAsia;
  }

  const action = JSON.parse(rawAction);
  if (action.type === 'initialize' && (!action.payload.variant || action.payload.variant === 'standard')) {
    action.payload.players = action.payload.players.map((player) => ({
      id: player.id,
      nation: nations[player.nation.value],
    }));
  }

  if (action.payload) {
    if (action.payload.incumbent) {
      action.payload.incumbent = nations[action.payload.incumbent.value];
    }

    if (action.payload.challenger) {
      action.payload.challenger = nations[action.payload.challenger.value];
    }

    if (action.payload.nation) {
      action.payload.nation = nations[action.payload.nation.value];
    }
  }

  return action;
});

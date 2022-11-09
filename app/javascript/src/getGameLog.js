import { Nation, Nation2030, NationAsia } from '../lib/constants';

export default (rawLog, baseGame) => rawLog.map((rawAction) => {
  // The following map only exists because of our custom Nation type, which
  // has weirdness when we attempt nation.when() in the setup file.
  const action = JSON.parse(rawAction);
  if (
    action.type === 'initialize'
      && (!action.payload.variant || action.payload.variant === 'standard')
  ) {
    if (baseGame === 'imperial') {
      action.payload.players = action.payload.players.map((player) => ({
        id: player.id,
        nation: Nation[player.nation.value],
      }));
    } else if (baseGame === 'imperial2030') {
      action.payload.players = action.payload.players.map((player) => ({
        id: player.id,
        nation: Nation2030[player.nation.value],
      }));
    } else if (baseGame === 'imperialAsia') {
      action.payload.players = action.payload.players.map((player) => ({
        id: player.id,
        nation: NationAsia[player.nation.value],
      }));
    }
  } else if (
    (
      action.type === 'rondel'
        || action.type === 'bondPurchase'
        || action.type === 'skipBondPurchase'
        || action.type === 'skipBuildFactory'
    ) && action.payload.nation
  ) {
    if (baseGame === 'imperial') {
      action.payload.nation = Nation[action.payload.nation.value];
    } else if (baseGame === 'imperial2030') {
      action.payload.nation = Nation2030[action.payload.nation.value];
    } else if (baseGame === 'imperialAsia') {
      action.payload.nation = NationAsia[action.payload.nation.value];
    }
  } else if (
    action.type === 'fight'
      || action.type === 'coexist'
      || action.type === 'unfriendlyEntrance'
      || action.type === 'friendlyEntrance'
  ) {
    if (baseGame === 'imperial') {
      action.payload.incumbent = Nation[action.payload.incumbent.value];
      action.payload.challenger = Nation[action.payload.challenger.value];
    } else if (baseGame === 'imperial2030') {
      action.payload.incumbent = Nation2030[action.payload.incumbent.value];
      action.payload.challenger = Nation2030[action.payload.challenger.value];
    } else if (baseGame === 'imperialAsia') {
      action.payload.incumbent = NationAsia[action.payload.incumbent.value];
      action.payload.challenger = NationAsia[action.payload.challenger.value];
    }
  }
  return action;
});

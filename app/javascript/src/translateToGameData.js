export const defaultLatestState = (baseGame) => {
  switch (baseGame) {
    case 'imperial':
      return {
        baseGame: 'imperial',
        currentNation: 'AH',
        nations: [],
        units: {},
      };
    case 'imperialEurope2030':
      return {
        baseGame: 'imperialEurope2030',
        currentNation: 'AH',
        nations: [],
        units: {},
      };
    case 'imperial2030':
      return {
        baseGame: 'imperial2030',
        currentNation: 'RU',
        nations: [],
        units: {},
      };
    case 'imperialAsia':
      return {
        baseGame: 'imperialAsia',
        currentNation: 'CN',
        nations: [],
        units: {},
      };
    default:
      return {
        baseGame: 'imperial',
        currentNation: 'AH',
        nations: [],
        units: {},
      };
  }
};

export default (game) => {
  let latestState;

  const nullsafeLatestState = game.latest_state || '{}';
  if (Object.keys(JSON.parse(nullsafeLatestState)).length > 0) {
    latestState = game.latest_state;
  } else {
    latestState = JSON.stringify(defaultLatestState(game.base_game));
  }

  return {
    host: game.host,
    baseGame: game.base_game,
    players: game.players,
    name: game.name,
    id: game.id,
    currentPlayerName: game.current_player_name,
    winner: game.winner_name,
    forceEndedAt: game.force_ended_at,
    cancelledAt: game.cancelled_at,
    createdAt: game.created_at,
    startedAt: game.started_at,
    observers: game.observers,
    variant: game.variant,
    lastMoveAt: game.last_move_at,
    clonedFromGame: game.cloned_from_game,
    isPublic: game.is_public,
    latestState,
  };
};

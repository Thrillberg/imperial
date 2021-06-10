export default (game) => {
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
    clonedFromGame: game.cloned_from_game
  };
};

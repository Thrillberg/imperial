class API::RankedGamesController < ApplicationController
  def index
    finished_games = Game
      .joins(:players)
      .where.not(winner_id: nil)
    games = finished_games.map do |game|
      game.players.map do |player|
        {
          game_name: game.name,
          player_name: player.user.name,
          player_id: player.user.id,
          player_score: player.score
        }
      end
    end

    render json: games
  end
end

class API::GamesController < ApplicationController
  def index
    finished_games = Game
      .joins(:players)
      .where.not(winner_id: nil)
      .distinct
    games = finished_games.map do |game|
      game.players.map do |player|
        {game: game.name, name: player.user.name, score: player.score}
      end
    end
    render json: games
  end

  def show
    game = Game.find(params[:id])
    render json: game.to_json
  end
end

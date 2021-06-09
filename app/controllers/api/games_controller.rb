class API::GamesController < ApplicationController
  def show
    game = Game.find(params[:id])
    render json: game.to_json
  end
end

class CloneGamesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    host = User.find(params[:host_id])
    cloned_game = Game.find(params[:id]).clone(host)

    render json: cloned_game.to_json
  end
end

class API::HiddenGamesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    game = Game.find(params[:game_id])
    current_user = User.find(params[:user_id])

    if game && current_user
      current_user.hidden_games.find_or_create_by(game: game)
    end
  end

  def destroy_all
    HiddenGame.where(user_id: params[:user_id]).destroy_all
  end
end

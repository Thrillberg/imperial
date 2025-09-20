class API::HiddenGamesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def destroy_all
    p "look here"
    p params
    HiddenGame.where(user_id: params[:user_id]).destroy_all
    head :no_content
  end
end

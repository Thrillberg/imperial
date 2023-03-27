class ImportsController < ApplicationController
  def create
    # There should be no imported games on production.
    # Importing is only for local debugging of production games.
    return if Rails.env == "production"

    log = JSON.parse(params[:log])
    game = Game.import(log, params[:hostId])

    render json: game.to_json
  end
end

class ImportsController < ApplicationController
  def create
    log = JSON.parse(params[:log])
    game = Game.import(log, params[:hostId])

    render json: game.to_json
  end
end

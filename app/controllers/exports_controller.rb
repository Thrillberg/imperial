class ExportsController < ApplicationController
  def show
    log = Game.find(params[:id]).log.to_json
    send_data(
      log,
      type: "application/json; header=present",
      disposition: "attachment; filename=imperial-#{params[:id]}.json"
    )
  end
end

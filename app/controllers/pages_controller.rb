class PagesController < ActionController::Base
  def index
    @games = Game.current.includes(:host, :current_player, :users, :winner, :cloned_from_game).map(&:to_json)
    render layout: "application"
  end

  def robots
    rules = <<~ROBOTS
      User-agent: *
      Allow: /
    ROBOTS

    respond_to do |format|
      format.text { render plain: rules }
    end
  end
end

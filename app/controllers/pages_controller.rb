class PagesController < ActionController::Base
  def index
    raise ActionController::RoutingError.new("Not Found") unless route_valid?

    raw_games = Game.current.includes(:current_player, :winner, :cloned_from_game)

    @games = raw_games.map do |game|
      observers = Rails.cache.fetch("users_observing_game_#{game.id}") { [] }
      game.to_json_with_observers(observers)
    end

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

  private

  def route_valid?
    %w[register sign_in about supporters rules game finished_games users games cloned_games import_game forgot_password reset_password rankings].any? { |path| params[:path]&.include?(path) } || !params[:path]
  end
end

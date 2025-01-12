class PagesController < ActionController::Base
  def index
    raise ActionController::RoutingError.new("Not Found") unless route_valid?

    raw_games = Game.current.includes(:host, :current_player, :users, :winner, :cloned_from_game)
    redis_data = JSON.parse(REDIS.get("users_observing_games"))

    @games = raw_games.map do |game|
      observers = redis_data[game.id.to_s] || []
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
    %w[register sign_in about rules game finished_games users games cloned_games import_game forgot_password reset_password rankings].any? { |path| params[:path]&.include?(path) } || !params[:path]
  end
end

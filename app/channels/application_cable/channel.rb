module ApplicationCable
  class Channel < ActionCable::Channel::Base
    def broadcast_users(channel, kind)
      payload = {
        kind: kind,
        data: {users: User.all}
      }
      ActionCable.server.broadcast(channel, payload)
    end

    def broadcast_games(channel, kind)
      games = Game.current.includes(:host, :current_player, :users, :winner, :cloned_from_game)
      payload_games = games.map do |game|
        observers = Rails.cache.fetch("users_observing_game_#{game.id}") { [] }
        game.to_json_with_observers(observers)
      end
      payload = {
        kind: kind,
        data: {
          games: payload_games
        }
      }
      ActionCable.server.broadcast(channel, payload)
    end

    def broadcast_update_game_log(channel, kind, game)
      log_timestamps = if game.cloned_from_game
        game.actions.order(:originally_created_at).map(&:originally_created_at)
      else
        game.actions.order(:created_at).map(&:created_at)
      end

      payload = {
        kind: kind,
        data: {
          gameId: game.id,
          log: game.actions.order(:originally_created_at).order(:created_at).map(&:data),
          logTimestamps: log_timestamps,
          game: game.to_json
        }
      }
      ActionCable.server.broadcast(channel, payload)
    end
  end
end

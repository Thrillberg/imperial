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
      games = Game.current
      payload_games = []
      games.find_each do |game|
        payload_games << game.to_json
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
      payload = {
        kind: kind,
        data: {
          gameId: game.id,
          log: game.actions.order(:created_at).map(&:data),
          logTimestamps: game.actions.order(:created_at).map(&:created_at)
        }
      }
      ActionCable.server.broadcast(channel, payload)
    end
  end
end

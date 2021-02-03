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
      payload = {
        kind: kind,
        data: {
          games: Game.includes(:host, :users, :actions).all.map(&:to_json)
        }
      }
      ActionCable.server.broadcast(channel, payload)
    end

    def broadcast_update_game_log(channel, kind, game)
      payload = {
        kind: kind,
        data: {
          gameId: game.id,
          log: game.actions.order(:created_at).map(&:data)
        }
      }
      ActionCable.server.broadcast(channel, payload)
    end

    private

    def game_from_data(data)
      Game.includes(:actions).find(data["gameId"])
    end
  end
end

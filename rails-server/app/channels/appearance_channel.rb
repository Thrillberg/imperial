class AppearanceChannel < ApplicationCable::Channel
  def subscribed
    stream_from "appearance_channel"
    ActionCable.server.broadcast(
      "appearance_channel",
      { kind: "updateUsers", data: {users: User.all} }
    )
    payload = {
      kind: "updateGames",
      data: {
        games: Game.all.map do |game|
          { name: game.name, id: game.id, host: game.host.name }
        end
      }
    }
    ActionCable.server.broadcast("appearance_channel", payload)
  end

  def receive(data)
    case data["kind"]
    when "registerUser"
      user = User.create(name: data["data"]["name"])
    when "openGame"
      host = User.find_by(name: data["data"]["host"])
      host.games << Game.create(name: "Darkwing Duck", host: host)
      payload = {
        kind: "updateGames",
        data: {
          games: Game.all.map do |game|
            { name: game.name, id: game.id, host: game.host.name }
          end
        }
      }
      ActionCable.server.broadcast("appearance_channel", payload)
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end

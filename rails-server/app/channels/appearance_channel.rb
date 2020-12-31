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
          to_json(game)
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
            to_json(game)
          end
        }
      }
      ActionCable.server.broadcast("appearance_channel", payload)
    when "tick"
      game = Game.find(data["data"]["gameId"])
      data = JSON.parse(data["data"]["action"])
      game.actions << Action.new(data: data)
    end
  end

  private

  def to_json(game)
    {
      name: game.name,
      id: game.id,
      host: game.host.name,
      players: game.users.map(&:name)
    }
  end
end

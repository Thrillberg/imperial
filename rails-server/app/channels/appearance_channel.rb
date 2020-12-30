class AppearanceChannel < ApplicationCable::Channel
  def subscribed
    stream_from "appearance_channel"
    ActionCable.server.broadcast(
      "appearance_channel",
      { kind: "updateUsers", data: {users: User.all} }
    )
  end

  def receive(data)
    case data["kind"]
    when "registerUser"
      user = User.create(name: data["data"]["name"])
    when "openGame"
      p data
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end

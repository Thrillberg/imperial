class AppearanceChannel < ApplicationCable::Channel
  def subscribed
    stream_from "appearance_channel"
    ActionCable.server.broadcast(
      "appearance_channel",
      { kind: "updateUsers", data: {users: User.all} }
    )
  end

  def receive(data)
    user = User.create(name: data["data"]["name"])
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end

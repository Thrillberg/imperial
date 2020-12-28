class AppearanceChannel < ApplicationCable::Channel
  def subscribed
    stream_from "appearance_channel"
    ActionCable.server.broadcast(
      "appearance_channel",
      { kind: "updateUsers", data: {users: [{id: 1, name: "eric"}]} }
    )
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end

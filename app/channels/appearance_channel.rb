class AppearanceChannel < ApplicationCable::Channel
  @@online_users = []

  def subscribed
    unless @@online_users.include? current_user&.name
      @@online_users << current_user&.name
    end

    stream_from "appearance_channel"
    ActionCable.server.broadcast("appearance_channel", {kind: "updateUsers", data: {users: @@online_users}})
  end

  def unsubscribed
    if @@online_users.include? current_user&.name
      @@online_users.delete(current_user&.name)
    end

    ActionCable.server.broadcast("appearance_channel", {kind: "updateUsers", data: {users: @@online_users}})
  end

  def receive(data)
    case data["kind"]
    when "updateUser"
      unless @@online_users.include? data["data"]["username"]
        @@online_users << data["data"]["username"]
      end
      if @@online_users.include? data["data"]["oldUsername"]
        @@online_users.delete(data["data"]["oldUsername"])
      end
      ActionCable.server.broadcast("appearance_channel", {kind: "updateUsers", data: {users: @@online_users}})
    end
  end
end

class AppearanceChannel < ApplicationCable::Channel
  def subscribed
    online_users = JSON.parse(REDIS.get("online_users"))
    unless online_users.include? current_user.name
      online_users << current_user.name
    end
    REDIS.set("online_users", online_users.to_json)

    stream_from "appearance_channel"
    ActionCable.server.broadcast("appearance_channel", {kind: "updateUsers", data: {users: online_users}})
  end

  def unsubscribed
    online_users = JSON.parse(REDIS.get("online_users"))
    if online_users.include? current_user.name
      online_users.delete(current_user.name)
    end
    REDIS.set("online_users", online_users.to_json)

    ActionCable.server.broadcast("appearance_channel", {kind: "updateUsers", data: {users: online_users}})
  end

  def receive(data)
    case data["kind"]
    when "updateUser"
      online_users = JSON.parse(REDIS.get("online_users"))
      unless online_users.include? data["data"]["username"]
        online_users << data["data"]["username"]
      end
      if online_users.include? data["data"]["oldUsername"]
        online_users.delete(data["data"]["oldUsername"])
      end
      ActionCable.server.broadcast("appearance_channel", {kind: "updateUsers", data: {users: online_users}})
    end
  end
end

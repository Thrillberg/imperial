require "redis"

REDIS = Redis.new(url: ENV["REDIS_URL"] || "redis://localhost:6379/0")
REDIS.set("online_users", [].to_json)
REDIS.set("users_observing_games", {}.to_json)

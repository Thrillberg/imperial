require "redis"

REDIS = Redis.new
REDIS.set("online_users", [].to_json)
REDIS.set("users_observing_games", {}.to_json)
REDIS.set("game_latest_states", {}.to_json)

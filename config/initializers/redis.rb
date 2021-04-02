require "redis"

REDIS = Redis.new
REDIS.set("online_users", [].to_json)
REDIS.set("current_player_names", Hash.new("").to_json)

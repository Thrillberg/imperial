require "redis"

REDIS = Redis.new
REDIS.set("online_users", [].to_json)

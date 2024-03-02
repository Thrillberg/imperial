require "redis"

REDIS = Redis.new(ssl_params: {verify_mode: OpenSSL::SSL::VERIFY_NONE})
REDIS.set("online_users", [].to_json)
REDIS.set("users_observing_games", {}.to_json)

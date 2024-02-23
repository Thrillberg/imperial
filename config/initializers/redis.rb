if Rails.env.production? || Rails.env.staging? || Rails.env.test?
  require "redis"

  REDIS = Redis.new
  REDIS.set("online_users", [].to_json)
  REDIS.set("users_observing_games", {}.to_json)
end

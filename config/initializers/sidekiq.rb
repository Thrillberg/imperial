Sidekiq.configure_server do |config|
  config.redis = {url: ENV["REDIS_URL"], namespace: "imperial_production"}
end

Sidekiq.configure_client do |config|
  config.redis = {url: ENV["REDIS_URL"], namespace: "imperial_production"}
end

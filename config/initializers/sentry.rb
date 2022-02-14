Sentry.init do |config|
  config.dsn = "https://fd248a7ee8904fec99cfee9a4ea6f51c@o987046.ingest.sentry.io/5943913"
  config.breadcrumbs_logger = [:active_support_logger, :http_logger]

  config.traces_sample_rate = 0.5
  config.environment = "production"
end

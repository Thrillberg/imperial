source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "2.7.2"

gem "bootsnap", ">= 1.4.2", require: false
gem "devise"
gem "faker"
gem "pg", ">= 0.18", "< 2.0"
gem "puma", "~> 4.3"
gem "rack-cors"
gem "rails", "~> 6.0.3", ">= 6.0.3.6"
gem "redis", "~> 4.0"
gem "sentry-rails"
gem "sentry-ruby"
gem "sidekiq"
gem "webpacker", "~> 5.x"

group :development, :test do
  gem "factory_bot_rails"
  gem "standard"
  gem "rspec-rails", "~> 4.0.2"
end

group :development do
  gem "pry"
  gem "listen", "~> 3.2"
  gem "spring"
  gem "spring-watcher-listen", "~> 2.0.0"
end

gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]

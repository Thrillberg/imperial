source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "2.7.1"

gem "bootsnap", ">= 1.4.2", require: false
gem "devise"
gem "faker"
gem "pg", ">= 0.18", "< 2.0"
gem "puma", "~> 4.1"
gem "rack-cors"
gem "rails", "~> 6.0.3", ">= 6.0.3.4"
gem "redis", "~> 4.0"
gem "sentry-rails"
gem "sentry-ruby"
gem "webpacker", git: "https://github.com/rails/webpacker.git"

group :development, :test do
  gem "factory_bot_rails"
  gem "standard"
  gem "rspec-rails", "~> 4.0.2"
end

group :development do
  gem "listen", "~> 3.2"
  gem "spring"
  gem "spring-watcher-listen", "~> 2.0.0"
end

gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]

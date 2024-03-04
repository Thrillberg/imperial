source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.2.2"

gem "bootsnap", ">= 1.4.2", require: false
gem "devise"
gem "faker"
gem "globalid", "~> 1.0"
gem "net-imap", require: false
gem "net-pop", require: false
gem "net-smtp", require: false
gem "pg", ">= 0.18", "< 2.0"
gem "psych", "< 4"
gem "puma", "~> 5.6"
gem "rack-cors"

# rails without actionmailbox because of memory bloat
# gem "rails", "~> 7.0.4.3"
rails_version = "~> 7.0.4.3"
gem "activesupport", rails_version
gem "actionpack", rails_version
gem "actionview", rails_version
gem "activemodel", rails_version
gem "activerecord", rails_version
gem "actionmailer", rails_version
gem "activejob", rails_version
gem "actioncable", rails_version
gem "activestorage", rails_version
# gem "actionmailbox", rails_version
gem "actiontext", rails_version
gem "railties", rails_version

gem "redis", "~> 4.0"
gem "sentry-rails"
gem "sentry-ruby"
gem "sidekiq"
gem "webpacker", "~> 5.x"

group :development, :test do
  gem "bullet"
  gem "factory_bot_rails"
  gem "standard", "~> 1.16", ">= 1.16.1"
  gem "rspec-rails", "~> 4.0.2"
end

group :development do
  gem "pry"
  gem "listen", "~> 3.2"
  gem "spring"
  gem "spring-watcher-listen", "~> 2.0.0"
end

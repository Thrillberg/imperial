FROM ruby:2.7.1

RUN apt-get update -qq && apt-get install -y nodejs postgresql-client
WORKDIR /rails-server
COPY rails-server/Gemfile /rails-server/Gemfile
COPY rails-server/Gemfile.lock /rails-server/Gemfile.lock
RUN bundle install
COPY /rails-server /rails-server
EXPOSE 3000

# Start the main process.
CMD ["rails", "server", "-b", "0.0.0.0", "-e", "production"]

FROM ruby:3.2.2

ENV APP_ROOT /imperial
RUN mkdir -p $APP_ROOT

RUN apt-get update && apt-get install -y \
  build-essential

RUN gem install rails

WORKDIR $APP_ROOT

COPY . .

RUN bundle config set --local without 'development test'
RUN bundle install
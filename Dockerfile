FROM ruby:3.2.2

ENV APP_ROOT /imperial
RUN mkdir -p $APP_ROOT && \
  apt-get update && apt-get install -y \
  build-essential npm nodejs && \
  gem install rails

WORKDIR $APP_ROOT

COPY . .

RUN npm install --global yarn && \
  npm install && \
  bundle config set --local without 'development test' && \
  bundle install

RUN bin/webpack

CMD [ "rails", "s", "-p", "80", "-b", "0.0.0.0" ]

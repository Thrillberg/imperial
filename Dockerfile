FROM ruby:3.2.2-slim
WORKDIR /app
RUN apt-get update -qq && apt-get install -y \
  libpq-dev \
  nodejs \
  npm \
  yarn \
  && rm -rf /var/lib/apt/lists/*
RUN gem install rails bundler
COPY Gemfile Gemfile.lock ./
RUN bundle install --without development test
COPY package.json yarn.lock ./
RUN npm install -g yarn@1.22.21
COPY . .
RUN yarn install
RUN bundle exec ./bin/webpack
EXPOSE 3000
CMD ["rails", "s", "-b", "0.0.0.0"]

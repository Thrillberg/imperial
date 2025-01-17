FROM ruby:3.2.2-slim
WORKDIR /app
RUN apt-get update -qq && apt-get install -y \
  libpq-dev \
  nodejs \
  npm \
  yarn \
  && rm -rf /var/lib/apt/lists/*
COPY Gemfile Gemfile.lock ./
RUN bundle install --without development test
COPY package.json yarn.lock ./
RUN npm install -g yarn@1.22.21
RUN yarn install
COPY . .
RUN bundle exec rails assets:precompile
EXPOSE 80
CMD ["rails", "s", "-b", "0.0.0.0", "-p", "80"]
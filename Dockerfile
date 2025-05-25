FROM ruby:3.2.2-slim
WORKDIR /app
RUN apt-get update -qq && apt-get install -y \
  libpq-dev \
  build-essential \
  nodejs \
  npm
RUN npm install -g corepack && corepack enable && corepack prepare yarn@stable --activate

COPY Gemfile Gemfile.lock ./
ENV RAILS_ENV production
ARG SECRET_KEY_BASE
ENV SECRET_KEY_BASE=${SECRET_KEY_BASE}
RUN bundle install --without development test

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
RUN yarn install --immutable

COPY . .

RUN bin/vite build && rm -rf public/assets && bundle exec rails assets:precompile
EXPOSE 80
CMD ["rails", "s", "-b", "0.0.0.0", "-p", "80"]
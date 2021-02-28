# dockerfile
FROM ruby:2.7.1-alpine3.12

ARG APP_ROOT=/imperial
ARG BUILD_PACKAGES="build-base curl-dev git"
ARG DEV_PACKAGES="postgresql-dev yaml-dev zlib-dev nodejs npm yarn"
ARG RUBY_PACKAGES="tzdata"

RUN mkdir $APP_ROOT
WORKDIR $APP_ROOT

# install packages
RUN apk update \
    && apk upgrade \
    && apk add --update --no-cache $BUILD_PACKAGES $DEV_PACKAGES \
       $RUBY_PACKAGES


COPY Gemfile Gemfile.lock package.json package-lock.json ./

RUN bundle install

RUN npm install
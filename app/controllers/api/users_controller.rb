require "faker"

class API::UsersController < ApplicationController
  skip_before_action :verify_authenticity_token

  def show
    user = User.find(params[:id])
    games = Game.joins(:users).where(users: {id: user.id}).map(&:to_json)
    render json: {user: user, games: games}
  end

  def create
    user = User.find_by(id: cookies[:user_id])
    return if user

    user = User.create(name: lovely_string)
    cookies[:user_id] = {
      value: user.id,
      # This cookie will expire in 68 years!
      max_age: 2147483647
    }
    render json: user
  end

  private

  def lovely_string
    Faker::Name.first_name + " the " + Faker::Creature::Animal.name.capitalize
  end
end

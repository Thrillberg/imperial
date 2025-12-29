require "faker"

class API::UsersController < ApplicationController
  skip_before_action :verify_authenticity_token

  def show
    user = User.find(params[:id])
    finished_games = user.finished_games_for_profile.page(params[:page]).per(2)
    render json: {user: user.to_json_for_profile(finished_games)}
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

  def update
    user = User.find(user_params[:id])
    user.turn_notifications_enabled = user_params[:turn_notifications_enabled]
    user.discord_id = user_params[:discord_id]
    user.save
    render json: user
  end

  private

  def user_params
    params.require(:user).permit(:id, :turn_notifications_enabled, :discord_id)
  end

  def lovely_string
    Faker::Name.first_name + " the " + Faker::Creature::Animal.name.capitalize
  end
end

require "faker"

class UsersController < ApplicationController
  skip_before_action :verify_authenticity_token

  def show
    user = User.find_by(id: params[:id])
    profile = {}
    if user
      account = Account.find_by(user: user)
      if account
        profile[:registered] = true
        if sign_in account
          profile[:email] = account.email
        end
      end
      profile[:name] = user.name
      profile[:anonymity_confirmed_at] = user.anonymity_confirmed_at
      profile[:id] = user.id
    end
    render json: profile
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

class SessionsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    return if User.find_by(id: cookies[:user_id])

    user = User.create(name: "anonymous")
    cookies[:user_id] = user.id
  end
end

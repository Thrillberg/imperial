class SessionsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    if cookies[:user_id]
      user = User.find(cookies[:user_id])
    else
      user = User.create(name: "anonymous")
      cookies[:user_id] = user.id
    end
  end
end

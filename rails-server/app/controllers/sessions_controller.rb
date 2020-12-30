class SessionsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    if session[:user_id]
      user = User.find(session[:user_id])
    else
      user = User.create(name: "anonymous")
      session[:user_id] = user.id
    end
  end
end

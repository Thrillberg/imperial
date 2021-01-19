class SessionsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    return if User.find_by(id: cookies[:user_id])

    user = User.create(name: "anonymous")
    cookies[:user_id] = {
      value: user.id,
      same_site: :lax,
      # This cookie will expire in 68 years!
      max_age: 2147483647
    }
  end
end

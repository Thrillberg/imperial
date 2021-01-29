class UsersController < ApplicationController
  skip_before_action :verify_authenticity_token

  def show
    user = User.find_by(id: params[:id])
    profile = {}
    if user
      account = Account.find_by(user: user)
      if account
        profile[:registered] = true
        if account == current_account
          profile[:email] = account.email
        end
      end
      profile[:name] = user.name
    end
    render json: profile
  end

  def create
    user = User.create(name: params[:name])
    # This cookie will expire in 68 years!
    cookies[:user_id] = {value: user.id, max_age: 2147483647}
    redirect_to "/"
  end
end

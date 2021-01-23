class UsersController < ApplicationController
  skip_before_action :verify_authenticity_token

  def show
    user = User.find_by(id: params[:id])
    profile = {}
    if user
      account = Account.find_by(user: user)
      profile = { name: user&.name, email: account&.email }
    end
    render json: profile
  end

  def create
    user = User.find(params[:id])
    user.update(name: params[:name])
    redirect_to "/"
  end
end

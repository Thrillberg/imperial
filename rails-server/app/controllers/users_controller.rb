class UsersController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    user = User.find(params[:id])
    user.update(name: params[:name])
  end
end

class AnonymityConfirmationsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    user = User.find(params[:id])
    user.update(anonymity_confirmed_at: Time.now)
  end
end

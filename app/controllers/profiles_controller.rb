class ProfilesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def show
    user = User.find_by(id: params[:id])
    profile = {}
    if user
      account = Account.find_by(user: user)
      if account
        profile[:registered] = true
        if current_account == account
          profile[:email] = account.email
        end
      end
      profile[:name] = user.name
      profile[:anonymity_confirmed_at] = user.anonymity_confirmed_at
      profile[:id] = user.id
      profile[:turn_notifications_enabled] = user.turn_notifications_enabled
    end
    render json: profile
  end
end

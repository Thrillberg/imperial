class Cypress::SessionsController < ActionController::Base
  def create
    sign_in(user)
    render json: user
  end

  private

  def user
    account =
      if params[:email]
        Account.find_by!(email: params.fetch(:email))
      else
        Account.first!
      end
    cookies[:user_id] = account.user.id
    account
  end
end

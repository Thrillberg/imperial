# frozen_string_literal: true

class Accounts::SessionsController < Devise::SessionsController
  skip_before_action :verify_authenticity_token
  # before_action :configure_sign_in_params, only: [:create]

  # GET /resource/sign_in
  # def new
  #   super
  # end

  # POST /resource/sign_in
  def create
    account = Account.find_by(email: session_params[:email])
    if account&.valid_password?(session_params[:password])
      sign_in account
      user = account.user
      # This cookie will expire in 68 years!
      cookies[:user_id] = {value: user.id, max_age: 2147483647}
      render(json: {username: user.name, email: account.email, id: user.id}) && return
    end

    render(json: {errors: "invalid login"}) && return
  end

  # DELETE /resource/sign_out
  def destroy
    cookies.delete(:user_id)
    super
  end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end

  private

  def session_params
    params.require(:session).permit(:email, :password)
  end
end

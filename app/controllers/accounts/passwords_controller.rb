# frozen_string_literal: true

class Accounts::PasswordsController < Devise::PasswordsController
  skip_before_action :verify_authenticity_token
  # GET /resource/password/new
  # def new
  #   super
  # end

  # POST /resource/password
  # def create
  #   super
  # end

  # GET /resource/password/edit?reset_password_token=abcdef
  # def edit
  #   super
  # end

  # PUT /resource/password
  def update
    super do |account|
      password = account_params[:password]
      if account.reset_password(password, password)
        sign_in account
        user = account.user
        # This cookie will expire in 68 years!
        cookies[:user_id] = {value: user.id, max_age: 2147483647}
        render(json: {username: user.name, email: account.email}) && return
      end

      render(json: {errors: "invalid password"}) && return
    end
  end

  # protected

  # def after_resetting_password_path_for(resource)
  #   super(resource)
  # end

  # The path used after sending reset password instructions
  # def after_sending_reset_password_instructions_path_for(resource_name)
  #   super(resource_name)
  # end

  private

  def account_params
    params.require(:account).permit(:password, :reset_password_token)
  end
end

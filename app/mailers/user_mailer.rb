class UserMailer < ApplicationMailer
  def turn_notification_email
    @user = params[:user]
    @game = params[:game]
    mail(
      to: @user.account.email,
      subject: "It's your turn on playimperial.club"
    )
  end
end

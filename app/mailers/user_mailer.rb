class UserMailer < ApplicationMailer
  def turn_notification_email
    @user = params[:user]
    @game = params[:game]
    mail(
      to: @user.account.email,
      subject: "It's your turn on playimperial.club"
    )
  end

  def you_won_notification_email
    @user = params[:user]
    @game = params[:game]
    mail(
      to: @user.account.email,
      subject: "Huzzah! You won #{@game.name} on playimperial.club!"
    )
  end

  def game_over_notification_email
    @user = params[:user]
    @game = params[:game]
    mail(
      to: @user.account.email,
      subject: "#{@game.name} has ended on playimperial.club"
    )
  end
end

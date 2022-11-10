class YouWonNotificationJob < ApplicationJob
  queue_as :default

  def perform(player_id, game_id)
    player = User.find(player_id)
    game = Game.find(game_id)
    UserMailer.with(user: player, game: game)
      .you_won_notification_email.deliver_now
  end
end

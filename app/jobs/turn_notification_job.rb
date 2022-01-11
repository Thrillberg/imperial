class TurnNotificationJob < ApplicationJob
  queue_as :default

  def perform(player_id, game_id)
    player = User.find(player_id)
    game = Game.find(game_id)
    if game.current_player == player
      UserMailer.with(user: player, game: game)
        .turn_notification_email.deliver_now
    end
  end
end

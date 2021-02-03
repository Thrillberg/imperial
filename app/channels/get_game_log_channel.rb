class GetGameLogChannel < ApplicationCable::Channel
  def subscribed
    stream_from "get_game_log_channel"
    broadcast_games "get_game_log_channel"
  end

  def receive(data)
    game = game_from_data(data)
    broadcast_update_game_log "get_game_log_channel", "updateGameLog", game
  end
end

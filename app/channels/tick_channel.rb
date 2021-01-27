class TickChannel < ApplicationCable::Channel
  def subscribed
    stream_from "tick_channel"
    broadcast_games "tick_channel", "updateGames"
  end

  def receive(data)
    game = game_from_data(data)
    data = data["data"]["action"]
    game.actions << Action.create(data: data)

    broadcast_update_game_log "tick_channel", "updateGameLog", game
  end
end

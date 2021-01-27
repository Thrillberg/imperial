class JoinGameChannel < ApplicationCable::Channel
  def subscribed
    stream_from "join_game_channel"
    broadcast_games "join_game_channel", "updateGames"
  end

  def receive(data)
    game = game_from_data(data)
    user = User.find(data["data"]["userId"])
    game.users << user
    broadcast_games "join_game_channel", "updateGames"
  end
end

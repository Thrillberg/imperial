class GameChannel < ApplicationCable::Channel
  def subscribed
    stream_from "game_channel"
    broadcast_games "game_channel", "updateGames"
  end

  def receive(data)
    case data["kind"]
    when "openGame"
      broadcast_games "game_channel", "updateGames"

    when "joinGame"
      game = game_from_data(data)
      user = User.find(data["data"]["userId"])
      game.users << user
      broadcast_games "game_channel", "updateGames"

    when "getGameLog"
      game = game_from_data(data)
      broadcast_update_game_log "game_channel", "updateGameLog", game

    when "tick"
      game = game_from_data(data)
      game.update(started_at: Time.zone.now) unless game.started_at
      game.update(force_ended_at: nil) if game.force_ended_at
      data = data["data"]["action"]
      game.actions << Action.create(data: data)
      broadcast_update_game_log "game_channel", "updateGameLog", game
      broadcast_games "game_channel", "updateGames"

    when "updateGames"
      broadcast_games "game_channel", "updateGames"

    when "cancelGame"
      game = game_from_data(data)
      game.update(cancelled_at: Time.zone.now)
      broadcast_games "game_channel", "updateGames"

    when "bootPlayer"
      game = game_from_data(data)
      user_id = game.users.find_by(name: data["data"]["playerName"]).id
      game.players.find_by(user_id: user_id).delete
      broadcast_games "game_channel", "updateGames"

    when "updateCurrentPlayerName"
      game = game_from_data(data)
      current_player_name = data["data"]["currentPlayerName"]
      player = game.users.find_by(name: current_player_name)
      game.update(current_player: player)
      broadcast_games "game_channel", "updateGames"

    when "updateWinnerName"
      game = game_from_data(data)
      scores = data["data"]["scores"]
      game.players.each do |player|
        player.update(score: scores[player.user.name])
      end
      winner_name = data["data"]["winnerName"]
      winner = game.users.find_by(name: winner_name)
      game.update(winner: winner) unless game.winner
      broadcast_games "game_channel", "updateGames"

    when "userObservingGame"
      user_name = data["data"]["playerName"]
      game_id = data["data"]["gameId"]
      users_observing_game = JSON.parse(REDIS.get("users_observing_games"))[game_id]
      users_observing_game ||= []
      unless users_observing_game.include? user_name
        users_observing_game << user_name
      end
      users_observing_games = JSON.parse(REDIS.get("users_observing_games")).merge(game_id => users_observing_game).to_json
      REDIS.set("users_observing_games", users_observing_games)
      broadcast_games "game_channel", "updateGames"

    when "userStoppedObservingGame"
      user_name = data["data"]["playerName"]
      game_id = data["data"]["gameId"]
      users_observing_game = JSON.parse(REDIS.get("users_observing_games"))[game_id]
      users_observing_game ||= []
      if users_observing_game.include? user_name
        users_observing_game.delete(user_name)
      end
      users_observing_games = JSON.parse(REDIS.get("users_observing_games")).merge(game_id => users_observing_game).to_json
      REDIS.set("users_observing_games", users_observing_games)
      broadcast_games "game_channel", "updateGames"

    end
  end

  private

  def game_from_data(data)
    Game.includes(:actions).find(data["data"]["gameId"])
  end
end

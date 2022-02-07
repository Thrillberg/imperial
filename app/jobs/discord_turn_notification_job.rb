class DiscordTurnNotificationJob < ApplicationJob
  queue_as :default

  def perform(player_id, game_id, game_name)
    player = User.find(player_id)
    game = Game.find(game_id)
    if game.current_player == player
      uri = URI(ENV["DISCORD_WEBHOOK_URL"])
      Net::HTTP.post(
        uri,
        {
          content: "<@#{player_id}> it is your turn!",
          allowed_mentions: {parse: ["users"]},
          embeds: [
            title: game_name,
            url: "https://www.playimperial.club/game/#{game_id}"
          ]
        }.to_json,
        "Content-Type" => "application/json"
      )
    end
  end
end

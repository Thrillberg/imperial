class DiscordGameOverNotificationJob < ApplicationJob
  queue_as :default

  def perform(winner_discord_id, game_id, game_name)
    game = Game.find(game_id)
    if game.discord_channel_id
      uri = URI("https://discord.com/api/channels/#{game.discord_channel_id}/messages")
      Net::HTTP.post(
        uri,
        {
          content: "#{game_name} has ended and <@#{winner_discord_id}> is the winner!",
          allowed_mentions: {parse: ["users"]},
          embeds: [
            title: game_name,
            url: "https://www.playimperial.club/game/#{game_id}"
          ]
        }.to_json,
        "Content-Type" => "application/json",
        "authorization" => "Bot #{ENV["DISCORD_TOKEN"]}"
      )
    else
      uri = URI(ENV["DISCORD_WEBHOOK_URL"])
      Net::HTTP.post(
        uri,
        {
          content: "#{game_name} has ended and <@#{winner_discord_id}> is the winner!",
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

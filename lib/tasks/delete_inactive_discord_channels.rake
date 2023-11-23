desc "Find inactive Discord channels and delete them"

task delete_inactive_discord_channels: :environment do
  Game.all.each do |game|
    if game.discord_channel_id
      # Get the last message id
      uri = URI("https://discord.com/api/channels/#{game.discord_channel_id}")
      response = Net::HTTP.get(
        uri,
        "Content-Type" => "application/json",
        "authorization" => "Bot #{ENV["DISCORD_TOKEN"]}"
      )
      last_message_id = JSON.parse(response)["last_message_id"]

      # Get the timestamp of the last message
      uri = URI("https://discord.com/api/channels/#{game.discord_channel_id}/messages/#{last_message_id}")
      response = Net::HTTP.get(
        uri,
        "Content-Type" => "application/json",
        "authorization" => "Bot #{ENV["DISCORD_TOKEN"]}"
      )
      last_timestamp = JSON.parse(response)["timestamp"]

      # If timestamp is older than 14 days, delete the channel
      if last_timestamp.to_time < 14.days.ago
        uri = URI.parse("https://discord.com/api/channels/#{game.discord_channel_id}")
        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = true
        request = Net::HTTP::Delete.new(uri.path)
        request["Authorization"] = "Bot #{ENV["DISCORD_TOKEN"]}"
        response = http.request(request)
        if response.code == "200"
          channel = JSON.parse(response)
          puts "Successfully deleted channel. Channel id: #{channel.id}, name: #{channel.name}"
        end
      end
    end
  end
end

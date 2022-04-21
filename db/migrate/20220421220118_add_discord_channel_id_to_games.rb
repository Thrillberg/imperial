class AddDiscordChannelIdToGames < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :discord_channel_id, :string
  end
end

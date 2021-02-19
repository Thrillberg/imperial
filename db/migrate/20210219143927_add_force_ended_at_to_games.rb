class AddForceEndedAtToGames < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :force_ended_at, :timestamp
  end
end

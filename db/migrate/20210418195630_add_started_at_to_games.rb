class AddStartedAtToGames < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :started_at, :datetime
  end
end

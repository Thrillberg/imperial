class AddCancelledAtToGames < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :cancelled_at, :datetime
  end
end

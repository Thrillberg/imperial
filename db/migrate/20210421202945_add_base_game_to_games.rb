class AddBaseGameToGames < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :base_game, :integer, default: 0
  end
end

class AddCurrentPlayerToGames < ActiveRecord::Migration[6.0]
  def change
    add_reference :games, :current_player, foreign_key: {to_table: :users}, type: :uuid
  end
end

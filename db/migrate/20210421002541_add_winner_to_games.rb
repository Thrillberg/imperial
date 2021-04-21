class AddWinnerToGames < ActiveRecord::Migration[6.0]
  def change
    add_reference :games, :winner, foreign_key: {to_table: :users}, type: :uuid
  end
end

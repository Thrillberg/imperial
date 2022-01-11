class AddClonedFromGameToGames < ActiveRecord::Migration[6.0]
  def change
    add_reference :games, :cloned_from_game, foreign_key: {to_table: :games}, type: :uuid
  end
end

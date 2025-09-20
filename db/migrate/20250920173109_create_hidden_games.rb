class CreateHiddenGames < ActiveRecord::Migration[7.1]
  def change
    create_table :hidden_games, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :game, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
    add_index :hidden_games, [:user_id, :game_id], unique: true
  end
end

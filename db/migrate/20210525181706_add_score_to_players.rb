class AddScoreToPlayers < ActiveRecord::Migration[6.0]
  def change
    add_column :players, :score, :integer
  end
end

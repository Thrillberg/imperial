class AddTimeCommitmentToGames < ActiveRecord::Migration[7.0]
  def change
    add_column :games, :time_commitment, :integer, default: 0
  end
end

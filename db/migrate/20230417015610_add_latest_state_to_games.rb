class AddLatestStateToGames < ActiveRecord::Migration[7.0]
  def change
    add_column :games, :latest_state, :json
  end
end

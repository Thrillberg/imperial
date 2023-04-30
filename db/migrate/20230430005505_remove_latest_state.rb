class RemoveLatestState < ActiveRecord::Migration[7.0]
  def change
    remove_column :games, :latest_state, :json
  end
end

class AddPlayerNotifiedAtToAction < ActiveRecord::Migration[7.0]
  def change
    add_column :actions, :player_notified_at, :datetime
  end
end

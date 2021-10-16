class AddTurnNotificationsEnabledToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :turn_notifications_enabled, :boolean, default: false
  end
end

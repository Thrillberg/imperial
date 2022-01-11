class AddIsBotToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :is_bot, :boolean
  end
end

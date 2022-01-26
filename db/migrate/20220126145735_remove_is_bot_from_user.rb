class RemoveIsBotFromUser < ActiveRecord::Migration[6.0]
  def change
    remove_column :users, :is_bot, :boolean
  end
end

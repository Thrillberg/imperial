class AddIsBotToUserAgain < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :is_bot, :boolean
  end
end

class AddAnonymitConfirmedAtToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :anonymity_confirmed_at, :datetime
  end
end

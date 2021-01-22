class AddAccountIdToUser < ActiveRecord::Migration[6.0]
  def change
    add_reference :users, :account, null: false, foreign_key: true, type: :uuid
  end
end

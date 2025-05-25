class AddAdminToAccounts < ActiveRecord::Migration[7.1]
  def change
    add_column :accounts, :admin, :boolean, default: false
  end
end

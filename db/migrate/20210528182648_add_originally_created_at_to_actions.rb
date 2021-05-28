class AddOriginallyCreatedAtToActions < ActiveRecord::Migration[6.0]
  def change
    add_column :actions, :originally_created_at, :datetime
  end
end

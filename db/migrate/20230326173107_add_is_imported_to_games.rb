class AddIsImportedToGames < ActiveRecord::Migration[7.0]
  def change
    add_column :games, :is_imported, :boolean
  end
end

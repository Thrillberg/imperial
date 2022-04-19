class AddIsPublicToGames < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :is_public, :boolean, default: true
  end
end

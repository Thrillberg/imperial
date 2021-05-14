class AddVariantToGames < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :variant, :integer, default: 0
  end
end

class CreateGames < ActiveRecord::Migration[6.0]
  def change
    create_table :games, id: :uuid do |t|
      t.string :name
      t.belongs_to :host, type: :uuid, foreign_key: {to_table: :users}, null: false

      t.timestamps
    end
  end
end

class CreatePlayers < ActiveRecord::Migration[6.0]
  def change
    create_table :players, id: :uuid do |t|
      t.belongs_to :user, type: :uuid, null: false
      t.belongs_to :game, type: :uuid, null: false

      t.timestamps
    end
  end
end

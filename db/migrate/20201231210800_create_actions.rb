class CreateActions < ActiveRecord::Migration[6.0]
  def change
    create_table :actions, id: :uuid do |t|
      t.string :data
      t.belongs_to :game, type: :uuid, null: false

      t.timestamps
    end
  end
end

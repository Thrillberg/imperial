class CreateSnapshots < ActiveRecord::Migration[7.0]
  def change
    create_table :snapshots, id: :uuid do |t|
      t.json :state
      t.references :game, type: :uuid, index: true, null: false

      t.timestamps
    end
  end
end

class CreateGames < ActiveRecord::Migration[6.1]
  def change
    enable_extension 'pgcrypto'

    create_table :games, id: :uuid do |t|
      t.text :data

      t.timestamps
    end
  end
end

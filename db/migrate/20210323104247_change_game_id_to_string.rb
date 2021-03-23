class ChangeGameIdToString < ActiveRecord::Migration[6.1]
  def change
    reversible do |dir|
      dir.up do
        create_table :new_games, id: :string do |t|
          t.text :data

          t.timestamps
        end

        execute <<~SQL
          INSERT INTO new_games
          SELECT * FROM games
        SQL

        drop_table :games

        rename_table :new_games, :games
      end

      dir.down do
        raise ActiveRecord::IrreversibleMigration
      end
    end
  end
end

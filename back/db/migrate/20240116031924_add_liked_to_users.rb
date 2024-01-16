class AddLikedToUsers < ActiveRecord::Migration[7.1]
  def change
    remove_column :users, :liked
    add_column :users, :liked, :string, default: [].to_s
    add_index :users, :liked
  end
end

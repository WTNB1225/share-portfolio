class AddLikedToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :liked, :string, default: [].to_s
    add_index :users, :liked
  end
end

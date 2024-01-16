class AddIndexToFavorites < ActiveRecord::Migration[7.1]
  def change
    remove_index :favorites, :user_id
    remove_index :favorites, :post_id
    add_index :favorites, :user_id
    add_index :favorites, :post_id
    add_index :favorites, [:user_id, :post_id], unique: true
  end
end

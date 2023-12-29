class AddIndexToPosts < ActiveRecord::Migration[7.1]
  def change
    add_column :posts, :username,:string
    add_index :posts, :username
  end
end

class AddUserIdToPosts < ActiveRecord::Migration[7.1]
  def change
    remove_column :posts, :userid, :string
    remove_column :posts, :user_id, :integer
    add_column :posts, :userid, :string
    add_column :posts, :user_id, :integer
  end
end

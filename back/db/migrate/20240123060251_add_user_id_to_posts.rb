class AddUserIdToPosts < ActiveRecord::Migration[7.1]
  def change
    add_column :posts, :userid, :string
  end
end

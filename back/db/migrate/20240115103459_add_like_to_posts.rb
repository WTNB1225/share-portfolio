class AddLikeToPosts < ActiveRecord::Migration[7.1]
  def change
    remove_column :posts, :like, :integer
    add_column :posts, :like, :string
    add_index :posts, :like
  end
end

class AddLikeToPosts < ActiveRecord::Migration[7.1]
  def change
    add_column :posts, :like, :integer
    add_index :posts, :like
  end
end

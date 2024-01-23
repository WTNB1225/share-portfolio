class RemoveLikeFromUsers < ActiveRecord::Migration[7.1]
  def change
    remove_column :users, :liked, :string
  end
end
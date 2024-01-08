class AddAvatarUrlToPosts < ActiveRecord::Migration[7.1]
  def change
    add_column :posts, :avatar_url, :string
  end
end

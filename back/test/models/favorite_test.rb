require "test_helper"

class FavoriteTest < ActiveSupport::TestCase
  test "should not save favorite without user_id" do
    favorite = Favorite.new(post_id: 1)
    assert_not favorite.save
  end
  
  test "should not save favorite without post_id" do
    favorite = Favorite.new(user_id: 1)
    assert_not favorite.save
  end
  
  test "should save favorite with user_id and post_id" do
    user = users(:michael)
    post = posts(:one)
    favorite = Favorite.new(user_id: user.id, post_id: post.id)
    assert favorite.save
  end
  
  test "should belong to user" do
    assert Favorite.reflect_on_association(:user).macro
  end
  
  test "should belong to post" do
    assert Favorite.reflect_on_association(:post).macro
  end
end

require "test_helper"

class BookmarkTest < ActiveSupport::TestCase
  test "should not save bookmark without user_id" do
    bookmark = Bookmark.new(post_id: 1)
    assert_not bookmark.save
  end
  
  test "should not save bookmark without post_id" do
    bookmark = Bookmark.new(user_id: 1)
    assert_not bookmark.save
  end
  
  test "should save bookmark with user_id and post_id" do
    user = users(:michael)
    post = posts(:one)
    user.save
    post.save
    bookmark = Bookmark.new(user_id: user.id, post_id: post.id)
    assert bookmark.save
  end
  
  test "should belong to user" do
    assert Bookmark.reflect_on_association(:user).macro
  end
  
  test "should belong to post" do
    assert Bookmark.reflect_on_association(:post).macro
  end
end

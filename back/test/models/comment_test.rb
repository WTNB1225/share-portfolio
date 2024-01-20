require "test_helper"

class CommentTest < ActiveSupport::TestCase
  test "should not save comment without user_id" do
    comment = Comment.new(post_id: 1, content: "Test content")
    assert_not comment.save
  end
  
  test "should not save comment without post_id" do
    comment = Comment.new(user_id: 1, content: "Test content")
    assert_not comment.save
  end
  
  test "should not save comment without content" do
    comment = Comment.new(user_id: 1, post_id: 1)
    assert_not comment.save
  end
  
  test "should not save comment with content longer than 140 characters" do
    comment = Comment.new(user_id: 1, post_id: 1, content: "a" * 141)
    assert_not comment.save
  end
  
  test "should save comment with user_id, post_id and content" do
    user = users(:michael)
    post = posts(:one)
    user.save
    post.save
    comment = Comment.new(user_id: user.id, post_id: post.id, content: "Test content")
    assert comment.save
  end
  
  test "should belong to user" do
    assert Comment.reflect_on_association(:user).macro
  end
  
  test "should belong to post" do
    assert Comment.reflect_on_association(:post).macro
  end
end

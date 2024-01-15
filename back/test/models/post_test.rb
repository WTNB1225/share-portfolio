require "test_helper"

class PostTest < ActiveSupport::TestCase
  def setup
    @user = users(:michael)
    @post = @user.posts.build(title:"First test",content: "This is the first test",user_id: @user.id, username: @user.name)
  end

  test "should be valid" do
    assert @post.valid?
  end

  test "title should be present" do
    @post.title = ""
    assert_not @post.valid?
  end

  test "content should be present" do
    @post.content = ""
    assert_not @post.valid?
  end

  test "user_id should be present" do
    @post.user_id = ""
    assert_not @post.valid?
  end

  test "username should be present" do
    @post.username = ""
    assert_not @post.valid?
  end

  test "title should not be too long" do
    @post.title = "a" * 51
    assert_not @post.valid?
  end

  test "content should not be too long" do
    @post.content = "a" * 501
    assert_not @post.valid?
  end

  test "One image should be posted" do
    @post.images.attach(io: File.open("/Users/watanabeyuki/portfolio-service/back/test/images/test.jpg"), filename: "test.jpg", content_type: "image/jpg")
    assert @post.images.attached?
  end

  test "images should be posted up to 4" do
    @post.images.attach(io: File.open("/Users/watanabeyuki/portfolio-service/back/test/images/test.jpg"), filename: "test.jpg", content_type: "image/jpg")
    @post.images.attach(io: File.open("/Users/watanabeyuki/portfolio-service/back/test/images/test.jpg"), filename: "test.jpg", content_type: "image/jpg")
    @post.images.attach(io: File.open("/Users/watanabeyuki/portfolio-service/back/test/images/test.jpg"), filename: "test.jpg", content_type: "image/jpg")
    @post.images.attach(io: File.open("/Users/watanabeyuki/portfolio-service/back/test/images/test.jpg"), filename: "test.jpg", content_type: "image/jpg")
    assert @post.valid?
  end

  test "images should not be posted more than 5" do
    @post.images.attach(io: File.open("/Users/watanabeyuki/portfolio-service/back/test/images/test.jpg"), filename: "test.jpg", content_type: "image/jpg")
    @post.images.attach(io: File.open("/Users/watanabeyuki/portfolio-service/back/test/images/test.jpg"), filename: "test.jpg", content_type: "image/jpg")
    @post.images.attach(io: File.open("/Users/watanabeyuki/portfolio-service/back/test/images/test.jpg"), filename: "test.jpg", content_type: "image/jpg")
    @post.images.attach(io: File.open("/Users/watanabeyuki/portfolio-service/back/test/images/test.jpg"), filename: "test.jpg", content_type: "image/jpg")
    @post.images.attach(io: File.open("/Users/watanabeyuki/portfolio-service/back/test/images/test.jpg"), filename: "test.jpg", content_type: "image/jpg")
    assert_not @post.valid?
  end

  test "images should not be too large" do
    @post.images.attach(io: File.open("/Users/watanabeyuki/portfolio-service/back/test/images/100MB.jpg"), filename: "100MB.jpg", content_type: "image/jpg")
    assert_not @post.valid?
  end
  
end

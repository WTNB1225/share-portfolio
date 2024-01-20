require "test_helper"

class PostTest < ActiveSupport::TestCase
  def setup
    @user = users(:michael)
    @user2 = users(:archer)
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

  test "post should have one comment" do
    @post.save
    assert_difference '@post.comments.count', 1 do
      @comment = @post.comments.create(user_id: @user.id, content: "This is the first comment")
    end
  end
  
  test "post should have many comments" do
    @post.save
    assert_difference '@post.comments.count', 2 do
      @comment = @post.comments.create(user_id: @user.id, content: "This is the first comment")
      @comment2 = @post.comments.create(user_id: @user2.id, content: "This is the second comment")
    end
  end
  
  test "should destroy associated comments when destroyed" do
    @post.save
    @comment = @post.comments.create(user_id: @user.id, content: "This is the first comment")
    @comment2 = @post.comments.create(user_id: @user2.id, content: "This is the second comment")
    assert_difference 'Comment.count', -@post.comments.count do
      @post.destroy
    end
  end
  test "post should have one bookmark" do
    @post.save
    assert_difference '@post.bookmarks.count', 1 do
      @bookmark = @post.bookmarks.create(user_id: @user.id)
    end
  end
  
  test "post should have many bookmarks" do
    @post.save
    assert_difference '@post.bookmarks.count', 2 do
      @bookmark = @post.bookmarks.create(user_id: @user.id)
      @bookmark2 = @post.bookmarks.create(user_id: @user2.id)
    end
  end
  
  test "should destroy associated bookmarks when destroyed" do
    @post.save
    @bookmark = @post.bookmarks.create(user_id: @user.id)
    @bookmark2 = @post.bookmarks.create(user_id: @user2.id)
    assert_difference 'Bookmark.count', -@post.bookmarks.count do
      @post.destroy
    end
  end
  
  test "post should have one favorite" do
    @post.save
    assert_difference '@post.favorites.count', 1 do
      @favorite = @post.favorites.create(user_id: @user.id)
    end
  end
  
  test "post should have many favorites" do
    @post.save
    assert_difference '@post.favorites.count', 2 do
      @favorite = @post.favorites.create(user_id: @user.id)
      @favorite2 = @post.favorites.create(user_id: @user2.id)
    end
  end
  
  test "should destroy associated favorites when destroyed" do
    @post.save
    @favorite = @post.favorites.create(user_id: @user.id)
    @favorite2 = @post.favorites.create(user_id: @user2.id)
    assert_difference 'Favorite.count', -@post.favorites.count do
      @post.destroy
    end
  end
end

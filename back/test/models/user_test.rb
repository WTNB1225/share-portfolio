require "test_helper"

class UserTest < ActiveSupport::TestCase

  def setup
    @user = User.new(name:"Example User", email:"user@example.com",
                    password: "foobar", password_confirmation: "foobar")
  end

  test "name should be unique" do
    deprecate_user = @user.dup
    @user.save
    assert_not deprecate_user.valid?
  end

  test "should be valid" do
    assert @user.valid?
  end

  test "name should be present" do
    @user.name = ""
    assert_not @user.valid?
  end

  test "email should be present" do
    @user.email = ""
    assert_not @user.valid?
  end

  test "name should not be too long" do
    @user.name = "a" * 51
    assert_not @user.valid?
  end

  test "email should not be too long" do
    @user.email = "a" * 244 + "@example.com"
    assert_not @user.valid?
  end

  test "email validation should accept valid address" do
    valid_addresses = %w[user@example.com USER@foo.COM A_US-ER@foo.bar.org
                        first.last@foo.jp alice+bob@baz.cn]
    valid_addresses.each do |valid_address|
      @user.email = valid_address
      assert @user.valid?, "#{valid_address.inspect} should be valid"
    end
  end

  test "email validation should reject invalid address" do
    invalid_addresses = %w[user@example,com user_at_foo.org user.name@example.
                          foo@bar_baz.com foo@bar+baz.com]
    invalid_addresses.each do |invalid_address|
      @user.email = invalid_address
      assert_not @user.valid?, "#{invalid_address.inspect} should be invalid"
    end
  end

  test "email addresses should be unique" do
    duplicate_user = @user.dup
    @user.save
    assert_not duplicate_user.valid?
  end

  test "email addresses should be saved as lowercase" do
    mixed_case_email = "Foo@ExAMPle.CoM"
    @user.email = mixed_case_email
    @user.save
    assert_equal mixed_case_email.downcase, @user.reload.email
  end

  test "password should be present" do
    @user.password = @user.password_confirmation = " " * 6
    assert_not @user.valid?
  end

  test "password should have a minimum length" do
    @user.password = @user.password_confirmation = "a" * 5
    assert_not @user.valid?
  end

  test "authenticated? should return false for a user with nil digest" do
    assert_not @user.authenticated?("")
  end

  test "avatar should be less than 10MB" do
    @user.avatar.attach(io: File.open("/Users/watanabeyuki/portfolio-service/back/test/images/test.jpg"), filename: "test.jpg", content_type: "image/jpg")
    assert @user.avatar.attached?
  end

  test "avatar should not be too large" do
    @user.avatar.attach(io: File.open("/Users/watanabeyuki/portfolio-service/back/test/images/100MB.jpg"), filename: "test_large.jpg", content_type: "image/jpg")
    assert @user.avatar.attached?
  end

  test "avatar should accept valid file format" do
    @user.avatar.attach(io: File.open("/Users/watanabeyuki/portfolio-service/back/test/images/test.jpg"), filename: "test.jpg", content_type: "image/jpg")
    assert @user.avatar.attached?
  end

  test "avatar should not accept invalid file format" do
    @user.avatar.attach(io: File.open("/Users/watanabeyuki/portfolio-service/back/app/controllers/users_controller.rb"), filename: "users_controller.rb", content_type: "text/plain")
    assert_not @user.valid?
  end

  test "user should have one post" do
    @user.save
    assert_difference '@user.posts.count', 1 do
      @post = @user.posts.build(title: "test", content: "test", username: @user.name, user_id: @user.id)
      @post.save
    end
  end

  test "user should have many posts" do
    @user.save
    assert_difference '@user.posts.count', 2 do
      @post = @user.posts.build(title: "test", content: "test", username: @user.name, user_id: @user.id)
      @post.save
      @post2 = @user.posts.build(title: "test2", content: "test2", username: @user.name, user_id: @user.id)
      @post2.save
    end
  end
end

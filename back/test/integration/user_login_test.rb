require "test_helper"

class UsersLogin < ActionDispatch::IntegrationTest

  def setup
    @user = users(:michael)
  end
end

class InvalidPasswordTest < UsersLogin


  test "login with valid email/invalid password" do
    post login_path, params: { session: { email:    @user.email,
                                          password: "invalid" } }
    assert_not is_logged_in?
  end
end

class ValidLogin < UsersLogin

  def setup
    super
    post login_path, params: { session: { email:    @user.email,
                                          password: 'password' } }
  end
end

class ValidLoginTest < ValidLogin

  test "valid login" do
    assert is_logged_in?
  end
end

class Logout < ValidLogin

  def setup
    super
    delete logout_path
  end
end

class LogoutTest < Logout

  test "successful logout" do
    assert_not is_logged_in?
  end

end

#class RememberingTest < UsersLogin
#
#  test "login with remembering" do
#    log_in_as(@user, remember_me: '1')
#    assert_not cookies[:remember_token].blank?
#    assert_equal cookies[:remember_token], assigns(:user).remember_token
#  end
#
#  test "login without remembering" do
#    # Cookieを保存してログイン
#    log_in_as(@user, remember_me: '1')
#    # Cookieが削除されていることを検証してからログイン
#    log_in_as(@user, remember_me: '0')
#    assert cookies[:remember_token].blank?
#  end
#end

module SessionHelper

  #受け取ったuserでログイン
  def log_in(user)
    session[:user_id] = user.id
  end

  def remember(user)
    user.remember
    cookies.permanent.encrypted[:user_id] = {value: user.id, http_only: true, secure:true}
    cookies.permanent[:remember_token] ={ value: user.remember_token, http_only: true, secure: true }
    cookies.permanent[:username] ={ value: user.name, http_only: true, secure: true }
  end

  #ログインuserを返す いない場合はnil
  def current_user
    if(user_id = session[:user_id])
      @current_user ||= User.find_by(id: user_id)
    elsif (user_id = cookies.encrypted[:user_id])
      user = User.find_by(id: user_id)
      if user && user.authenticated?(cookies[:remember_token])
        log_in user
        @current_user = user
      end
    end
  end
  #ログイン確認
  def logged_in?
    !current_user.nil?
  end

  #セッションを破棄する
  def forget(user)
    user.forget
    cookies.delete(:user_id)
    cookies.delete(:remember_token)
  end

  # 現在のユーザーをログアウトする
  def log_out
    forget(current_user)
    reset_session
    @current_user = nil   # 安全のため
  end

end
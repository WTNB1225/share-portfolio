class SessionController < ApplicationController
  include SessionHelper
  protect_from_forgery with: :exception

  def index
  end

  def create
    @user = User.find_by(email:params[:session][:email].downcase)
    if @user && @user.authenticate(params[:session][:password])
      reset_session
      params[:session][:remember_me] == "1" ? remember(@user) : forget(@user)
      log_in @user
      #csrf_token
      render json: {is_logged_in: true , user: @user}, status: :created
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def destroy
    log_out if logged_in?
  end

  def get_current_user
    render json: current_user
  end

  def get_token
    render json: { csrfToken: form_authenticity_token }
  end
end

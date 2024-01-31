class SessionController < ApplicationController
  include SessionHelper

  skip_before_action :authenticate_request, only: [:create, :get_token]
  after_action :set_csrf_token_header

  def index
  end

  def create
    @user = User.find_by(email:params[:session][:email].downcase)
    if @user && @user.authenticate(params[:session][:password])
      reset_session
      params[:session][:remember_me] == "1" ? remember(@user) : forget(@user)
      token = generate_jwt(@user)
      cookies[:jwt] = {value: token, http_only: true, secure: true}
      log_in @user
      render json: {user: @user.as_json(only:[:name,:id]).merge(avatar_url: url_for(@user.avatar)), token: token}, status: :created
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def destroy
    log_out if logged_in?
  end


  def get_current_user
    render json: current_user.as_json(only:[:name,:id, :admin]).merge(avatar_url: url_for(current_user.avatar))
  end

  def get_token
    render json: {csrf_token: form_authenticity_token}
  end

end

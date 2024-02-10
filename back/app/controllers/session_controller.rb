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
      render json: {user: @user.as_json(only:[:name,:id]).merge(avatar_url: "https://pub-a05d828609984db8b2239cd099a20aac.r2.dev/" + @user.avatar.blob.filename.to_s), token: token}, status: :created
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def destroy
    log_out if logged_in?
  end


  def get_current_user
    render json: current_user.as_json(only:[:name,:id, :admin]).merge(avatar_url: "https://pub-a05d828609984db8b2239cd099a20aac.r2.dev/" + current_user.avatar.blob.filename.to_s)
  end

  def get_token
    render json: {csrf_token: form_authenticity_token}
  end

end

class UsersController < ApplicationController

  include SessionHelper

  protect_from_forgery with: :exception
  skip_before_action :verify_authenticity_token, only: [:create]
  skip_before_action :authenticate_request, only: [:create]

  def show
    @user = User.find_by(name:params[:id])
    if @user
      user = @user.as_json(only: [:name, :id, :admin, :introduction]).merge(avatar_url: url_for(@user.avatar))
      render json: user
    end
  end

  def show_by_id
    @user = User.find_by(id:params[:user_id])
    if @user
      user = @user.as_json(only: [:name, :id, :admin]).merge(avatar_url: url_for(@user.avatar))
      render json: user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end


  def create
    @user = User.new(user_params)
    if @user.save
      reset_session
      token = generate_jwt(@user)
      cookies[:jwt] = {value: token, http_only: true, secure: true}
      log_in @user
      render json:{token: token}, status: :created
    else
      @user.save
      render json:@user.errors, status: :unprocessable_entity
    end
  end

  def edit
  end

  def destroy
  end

  def update
    @user = User.find_by(name: params[:id])
    if @user.update(user_params)
      render json:@user.as_json(only: [:name, :id, :admin]).merge(avatar_url: url_for(@user.avatar))
    else
      @user.update(user_params)
      render json:@user.errors, status: :unprocessable_entity
    end
  end

  private

    def user_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation, :avatar, :introduction)
    end
end

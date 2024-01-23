class UsersController < ApplicationController

  include SessionHelper

  def index
    @users = User.all
    render json: @users
  end

  def show
    @user = User.find_by(name:params[:id])
    if @user
      user = @user.as_json(include: :avatar).merge(avatar_url: url_for(@user.avatar))
    end
    render json: user
  end

  def show_by_id
    @user = User.find_by(id:params[:user_id])
    if @user
      user = @user.as_json(include: :avatar).merge(avatar_url: url_for(@user.avatar))
      render json: user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end


  def create
    @user = User.new(user_params)
    if @user.save
      reset_session
      log_in @user
      render json:@user, status: :created
    else
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
      render json:@user
    else
      render json:@user.errors, status: :unprocessable_entity
    end
  end

  private

    def user_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation, :avatar)
    end
end

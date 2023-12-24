class UsersController < ApplicationController
  before_action :logged_in_user, only: [:edit, :update]

  def index
    @users = User.all
    render json: @users
  end

  def show
    @user = User.find_by(name:params[:id])
    render json: @user
  end

  def new
  end

  def create
    @user = User.new(user_params)
    if @user.save
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
  end

  private

    def user_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation)
    end

    def logged_in_user
      unless logged_in?
        redirect_to "http://localhost:8080/login", status: :see_other
      end
    end
end

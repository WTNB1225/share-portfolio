class RelationshipsController < ApplicationController

  #フォロー

  def index
    render json:current_user
  end

  def create
    current = current_user
    user = User.find_by(name:params[:relationship][:name])
    current.follow(user)
    render json:current_user
  end

  #解除
  def destroy
    current = current_user
    user = User.find_by(name:params[:relationship][:name] )
    current.unfollow(user)
    current.reload
    user.reload
    render json: current_user
  end

  #フォロー一覧
  def followings
    user = User.find_by(name:params[:id])
    @users = user.following
    render json: @users
  end
  # フォロワー一覧
  def followers
    user = User.find_by(name:params[:id])
    @users = user.followers
    render json: @users
  end
end

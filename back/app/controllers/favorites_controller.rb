class FavoritesController < ApplicationController

  def index
    @favorites = Favorite.all
    render json: @favorites
  end
  def create
    @favorite = Favorite.new(favorite_params)
    if @favorite.save
      render json:@favorite, status: :created
    else
      render json:@favorite.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @favorite = Favorite.find_by(user_id: params[:user_id], post_id: params[:post_id])
    if @favorite
      @favorite.destroy
      render json: @favorite
    else
      render json: @favorite.errors, status: :unprocessable_entity
    end
  end

  def count
    @favorite = Favorite.where(post_id: params[:id])
    render json: @favorite.count
  end

  def favorite?
    @favorite = Favorite.find_by(user_id: params[:user_id], post_id: params[:post_id])
    if @favorite
      render json: true
    else
      render json: false
    end
  end

  def users_favorite
    @favorite = Favorite.where(user_id: params[:id])
    render json:@favorite
  end

  private
    def favorite_params
      params.require(:favorite).permit(:user_id, :post_id)
    end
end

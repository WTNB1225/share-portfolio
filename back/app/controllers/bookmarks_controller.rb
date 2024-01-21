class BookmarksController < ApplicationController
  def index
    @bookmark = Bookmark.all
    render json: @bookmark
  end
  
  def create
    @bookmark = Bookmark.new(bookmark_params)
    if @bookmark.save
      render json:@bookmark, status: :created
    else
      render json:@bookmark.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @bookmark = Bookmark.find_by(user_id: params["user_id"], post_id: params["post_id"])
    if @bookmark
      @bookmark.destroy
      render json: @bookmark
    else
      render json: @bookmark.errors, status: :unprocessable_entity
    end
  end

  def count
    @bookmark = Bookmark.where(post_id: params[:id])
    render json: @bookmark.count
  end

  def bookmark?
    @bookmark = Bookmark.find_by(user_id: params["user_id"], post_id: params[:post_id])
    if @bookmark
      render json: true
    else
      render json: false
    end
  end

  def users_bookmark
    @bookmark = Bookmark.where(user_id: params[:id])
    render json:@bookmark
  end

  private
    def bookmark_params
      params.require(:bookmark).permit(:user_id, :post_id)
    end
end

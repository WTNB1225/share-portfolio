class BookmarksController < ApplicationController
  def index
    @bookmark = Bookmark.all
    render json: @bookmark, status: :ok
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
      render json: @bookmark, status: :ok
    else
      render json: { error: 'Bookmark not found.' }, status: :not_found
    end
  end

  def count
    @bookmark = Bookmark.where(post_id: params[:id])
    render json: @bookmark.count, status: :ok
  end

  def bookmark?
    @bookmark = Bookmark.find_by(user_id: params["user_id"], post_id: params[:post_id])
    if @bookmark
      render json: true, status: :ok
    else
      render json: false, status: :ok
    end
  end

  def users_bookmark
    @bookmark = Bookmark.where(user_id: params[:id]).order(created_at: :desc)
    if @bookmark
      render json:@bookmark, status: :ok
    else
      render json: { error: 'No bookmarks found for this user.' }, status: :not_found
    end
  end

  private
    def bookmark_params
      params.require(:bookmark).permit(:user_id, :post_id)
    end
end
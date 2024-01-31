class CommentsController < ApplicationController
  protect_from_forgery with: :exception
  def index
    @comments = Comment.all
    render json: @comments, status: :ok
  end

  def create
    @comment = Comment.new(comment_params)
    if @comment.save
      render json:@comment, status: :created
    else
      render json:@comment.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @comment = Comment.find_by(id: params[:id])
    if @comment
      @comment.destroy
      render json: @comment, status: :ok
    else
      render json: @comment.errors, status: :not_found
    end
  end

  def show_post_comments
    @comments = Comment.where(post_id: params[:post_id])
    if @comments.exists?
      render json: @comments, status: :ok
    else 
      render json: { error: 'No comments found for this post.' }, status: :not_found
    end
  end

  private
    def comment_params
      params.require(:comment).permit(:user_id, :post_id, :content)
    end
end
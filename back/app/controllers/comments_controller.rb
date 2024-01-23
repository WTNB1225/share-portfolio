class CommentsController < ApplicationController

  def index
    @comments = Comment.all
    render json: @comments
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
      render json: @comment
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  def show_post_comments
    @comments = Comment.where(post_id: params[:post_id])
    if @comments
      render json: @comments
    else 
      render json: @comments.errors, status: :unprocessable_entity
    end
  end

  private
    def comment_params
      params.require(:comment).permit(:user_id, :post_id, :content)
    end
end

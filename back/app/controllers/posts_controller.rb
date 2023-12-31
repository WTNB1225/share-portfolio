class PostsController < ApplicationController
  protect_from_forgery with: :exception
  
  def index
    @posts = Post.all.order(created_at: :desc)
    posts_with_images = @posts.map do |post|
      post_data = post.as_json(include: :images)
      post_data.merge(
        images_url: post.images.map { |image| url_for(image) },
      )
    end
    render json: posts_with_images
  end

  def show
    @post = Post.where(username: params[:id])
    post_with_images = @post.map do |post|
      post_data = post.as_json(include: :images)
      post_data.merge(
        images_url: post.images.map { |image| url_for(image)},
      )
    end
    render json: post_with_images
  end

  def show_by_id
    @post = Post.find_by(id: params[:id])
    if @post
      post = @post.as_json(include: :images).merge(images_url: @post.images.map { |image| url_for(image) })
    end
    render json: post
  end
  
  def create
    @post = Post.new(post_params)
    if @post.save
      render json: @post, status: :created
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  private

  def post_params
    params.require(:post).permit(:title, :content, :user_id, :username, :avatar_url, images:[])
  end

end

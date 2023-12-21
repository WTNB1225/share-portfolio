class SessionController < ApplicationController

  def create
    user = User.find_by(email:params[:session][:email].downcase)
    if user && user.authenticate(params[:session][:password])
      render json: user, status: :created
    else
      render json: user.errors, status: :unprocessable_entity
    end
  end
end

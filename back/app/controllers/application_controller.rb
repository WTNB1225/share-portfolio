class ApplicationController < ActionController::API
  include ActionController::Cookies
  include Rails.application.routes.url_helpers
  include ActionController::RequestForgeryProtection
  include SessionHelper

  before_action :authenticate_request

  attr_reader :current_user

  def set_csrf_token_header
    response.set_header('X-CSRF-Token', form_authenticity_token)
  end

  private

  #apiの認証 外部からのアクセスを制限する
  def authenticate_request
    auth_header = request.headers['Authorization']
    auth_token = auth_header&.sub(/Bearer /i,'')
    puts auth_token
    if auth_token
      begin
        decoded_token = JWT.decode(auth_token, Rails.application.credentials.secret_key_base)
        @current_user = User.find(decoded_token[0]['user_id'])
      rescue JWT::DecodeError
        render json: { error: 'Invalid token' }, status: :unauthorized
      end
    else
      render json: { error: 'Not authenticated' }, status: :unauthorized
    end
  end
end
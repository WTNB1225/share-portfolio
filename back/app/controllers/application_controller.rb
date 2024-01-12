class ApplicationController < ActionController::API
  include ActionController::Cookies
  include Rails.application.routes.url_helpers
  include ActionController::RequestForgeryProtection
  include SessionHelper
end

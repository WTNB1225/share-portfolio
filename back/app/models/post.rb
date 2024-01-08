class Post < ApplicationRecord
  include Rails.application.routes.url_helpers
  belongs_to :user
  has_one_attached :avatar
  has_many_attached :images
  validates :title, presence:true
  validates :user_id, presence:true
  validates :content, presence:true, length: {maximum: 500}
  validates :username, presence:true
end

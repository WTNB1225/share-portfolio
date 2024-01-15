class Post < ApplicationRecord
  include Rails.application.routes.url_helpers
  belongs_to :user
  has_many_attached :images
  validates :title, presence:true, length: {maximum: 50}
  validates :user_id, presence:true
  validates :content, presence:true, length: {maximum: 500}
  validates :username, presence:true
  validates :images, content_type: { in: %w[image/jpeg image/gif image/png],
  message: "must be a valid image format" },
  size:         { less_than: 30.megabytes,
  message:   "should be less than 30MB" },
  limit: {min: 0, max: 4}
end

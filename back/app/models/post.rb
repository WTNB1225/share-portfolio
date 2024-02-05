class Post < ApplicationRecord
  include Rails.application.routes.url_helpers
  belongs_to :user
  has_many_attached :images do |attachable|
    attachable.variant :display, resize: "280x280"
  end
  has_many :favorites, dependent: :destroy
  has_many :bookmarks, dependent: :destroy
  has_many :comments, dependent: :destroy
  validates :title, presence:true, length: {maximum: 50}
  validates :user_id, presence:true
  validates :content, presence:true, length: {maximum: 3000}
  validates :username, presence:true
  validates :userid, presence:true
  #サムネイルのバリデーション
  validate :images_count_within_limit
  validates :images, content_type: { in: %w[image/jpeg image/gif image/png],
  message: "有効なフォーマットを選択してください" },
  size:         { less_than: 20.megabytes,
  message:   "20MBより小さくしてください" },
  presence: {presence: true, message: "サムネイルを選択してください"}
  
  private

  def images_count_within_limit
    if self.images.length > 1 || self.images.length == 0
      errors.add(:images, "サムネイルは1枚だけ選択してください")
    end
  end

end

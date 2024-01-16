class User < ApplicationRecord
  attr_accessor :remember_token
  before_save {self.email = email.downcase}
  has_many :posts, dependent: :destroy
  has_one_attached :avatar
  has_many :favorites, dependent: :destroy
  has_many :active_relationships, class_name:  "Relationship",
                                  foreign_key: "follower_id",
                                  dependent:   :destroy

  has_many :passive_relationships, class_name:  "Relationship",
                                    foreign_key: "followed_id",
                                    dependent:   :destroy
  has_many :following, through: :active_relationships, source: :followed
  has_many :followers, through: :passive_relationships, source: :follower
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i
  validates :name, presence: true, length: { maximum: 50 }
  validates :email, presence: true, length: { maximum: 255 },
                    format: {with: VALID_EMAIL_REGEX},
                    uniqueness: true
  has_secure_password
  validates :password, presence:true, length: {minimum: 6} ,on: :create
  validates :avatar, content_type: { in: %w[image/jpeg image/gif image/png],
  message: "must be a valid image format" },
  size:         { less_than: 10.megabytes,
  message:   "should be less than 10MB" }

  # 渡された文字列のハッシュ値を返す
  def User.digest(string)
    cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST :
                                                  BCrypt::Engine.cost
    BCrypt::Password.create(string, cost: cost)
  end

  #ランダムなトークンを生成
  def User.new_token
    SecureRandom.urlsafe_base64
  end

  #userにtoken追加
  def remember
    self.remember_token = User.new_token
    update_attribute(:remember_digest, User.digest(remember_token))
    remember_digest
  end

  #tokenと比較
  def authenticated?(remember_token)
    return false if remember_digest.nil?
    BCrypt::Password.new(remember_digest).is_password?(remember_token)
  end

  def forget
    update_attribute(:remember_digest, nil)
  end

  def session_token
    remember_digest || remember
  end

  #フォロー
  def follow(other_user)
    following << other_user unless self == other_user
  end

  #フォロー解除
  def unfollow(other_user)
    following.delete(other_user)
  end

  #フォローチェック
  def following?(other_user)
    following.include?(other_user)
  end
end
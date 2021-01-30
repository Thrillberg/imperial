class User < ActiveRecord::Base
  has_many :players
  has_many :games, through: :players
  belongs_to :account, optional: true

  validates :name, uniqueness: {case_sensitive: false}
end

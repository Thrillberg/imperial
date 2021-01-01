class User < ActiveRecord::Base
  has_many :players
  has_many :games, through: :players
end

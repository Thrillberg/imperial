class Game < ActiveRecord::Base
  has_many :actions
  has_many :players
  has_many :users, through: :players
  belongs_to :host, class_name: "User"
end

class User < ActiveRecord::Base
  has_many :players
  has_many :games, through: :players
  belongs_to :account, optional: true

  validates :name, uniqueness: {case_sensitive: false}

  def convert_games(old_name)
    games.each do |game|
      initialize_action = game.actions.order(:created_at).first
      data = initialize_action.data.gsub(old_name, name)
      initialize_action.update(data: data)
    end
  end
end

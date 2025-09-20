class User < ActiveRecord::Base
  has_many :players, dependent: :destroy
  has_many :games, through: :players
  has_many :hidden_games
  has_many :hidden_games_list, through: :hidden_games, source: :game

  belongs_to :account, optional: true

  validates :name, uniqueness: {case_sensitive: false}

  def convert_games(old_name)
    games.each do |game|
      game.actions.each do |action|
        data = action.data.gsub(old_name, name)
        action.update(data: data)
      end
    end
  end

  def to_json_in_game
    {name: name, id: id}
  end
end

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

  def to_json_for_profile
    {
      id: id,
      name: name,
      turn_notifications_enabled: turn_notifications_enabled,
      discord_id: discord_id,
      finished_games: finished_games_for_profile
    }
  end

  private

  def finished_games_for_profile
    games
      .where.not(winner_id: nil)
      .where(cloned_from_game: nil)
      .includes(:winner)
      .order(updated_at: :desc)
      .map(&:to_json_for_profile)
  end
end

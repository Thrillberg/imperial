class Game < ActiveRecord::Base
  enum base_game: {imperial: 0, imperial2030: 1}
  enum variant: {standard: 0, auction: 1, withoutInvestorCard: 2}

  has_many :actions, dependent: :destroy
  has_many :players, dependent: :destroy
  has_many :users, through: :players
  belongs_to :winner, class_name: "User", optional: true
  belongs_to :host, class_name: "User"
  belongs_to :current_player, class_name: "User", optional: true

  scope :current, -> {
    includes(:host, :users)
      .where(force_ended_at: nil, cancelled_at: nil)
      .order(created_at: :desc)
  }

  def to_json
    observers = JSON.parse(REDIS.get("users_observing_games"))[id] || []
    {
      name: name,
      id: id,
      base_game: base_game,
      host: host.name,
      players: users.map(&:name),
      force_ended_at: force_ended_at,
      cancelled_at: cancelled_at,
      created_at: created_at,
      current_player_name: current_player&.name,
      started_at: started_at,
      winner_name: winner&.name,
      observers: observers,
      variant: variant,
      last_move_at: last_move_at
    }
  end

  def abandoned?
    if actions.length > 0 && !force_ended_at
      return actions.order(:created_at).last.created_at < 3.days.ago
    elsif !force_ended_at
      return created_at < 3.days.ago
    end

    false
  end

  def last_move_at
    actions.order(:created_at).last&.created_at
  end
end

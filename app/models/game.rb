class Game < ActiveRecord::Base
  enum base_game: {imperial: 0, imperial2030: 1}

  has_many :actions, dependent: :destroy
  has_many :players, dependent: :destroy
  has_many :users, through: :players
  belongs_to :winner, class_name: "User", optional: true
  belongs_to :host, class_name: "User"

  scope :current, -> {
    includes(:host, :users)
      .where(force_ended_at: nil, cancelled_at: nil)
      .order(created_at: :desc)
  }

  def to_json
    {
      name: name,
      id: id,
      base_game: base_game,
      host: host.name,
      players: users.map(&:name),
      force_ended_at: force_ended_at,
      cancelled_at: cancelled_at,
      created_at: created_at,
      current_player_name: JSON.parse(REDIS.get("current_player_names"))[id],
      started_at: started_at,
      winner: winner&.name
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
end

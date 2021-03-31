class Game < ActiveRecord::Base
  has_many :actions, dependent: :destroy
  has_many :players, dependent: :destroy
  has_many :users, through: :players
  belongs_to :host, class_name: "User"

  scope :current, -> {
    includes(:host, :users, :actions)
      .where(force_ended_at: nil, cancelled_at: nil)
      .order(created_at: :desc)
  }

  def to_json
    {
      name: name,
      id: id,
      host: host.name,
      players: users.map(&:name),
      log: actions.map(&:data),
      force_ended_at: force_ended_at,
      cancelled_at: cancelled_at,
      created_at: created_at
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

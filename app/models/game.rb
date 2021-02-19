class Game < ActiveRecord::Base
  has_many :actions
  has_many :players
  has_many :users, through: :players
  belongs_to :host, class_name: "User"

  def to_json
    {
      name: name,
      id: id,
      host: host.name,
      players: users.map(&:name),
      log: actions.map(&:data),
      force_ended_at: force_ended_at
    }
  end

  def abandoned?
    if actions.length > 0 && !force_ended_at
      return actions.order(:created_at).last.created_at < 3.days.ago
    end

    return false
  end
end

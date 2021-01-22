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
      log: actions.map(&:data)
    }
  end
end

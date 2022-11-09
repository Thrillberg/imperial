class Game < ActiveRecord::Base
  enum base_game: {imperial: 0, imperial2030: 1, imperialAsia: 2}
  enum variant: {standard: 0, auction: 1, withoutInvestorCard: 2}

  has_many :actions, dependent: :destroy
  has_many :players, dependent: :destroy
  has_many :users, through: :players
  has_many :cloned_games, class_name: "Game", foreign_key: "cloned_from_game_id", dependent: :nullify

  belongs_to :winner, class_name: "User", optional: true
  belongs_to :host, class_name: "User"
  belongs_to :current_player, class_name: "User", optional: true
  belongs_to :cloned_from_game, class_name: "Game", optional: true

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
      players: users.map(&:to_json_in_game),
      force_ended_at: force_ended_at,
      cancelled_at: cancelled_at,
      created_at: created_at,
      current_player_name: current_player&.name,
      started_at: started_at,
      winner_name: winner&.name,
      observers: observers,
      variant: variant,
      last_move_at: last_move_at,
      cloned_from_game: cloned_from_game&.id,
      is_public: is_public
    }
  end

  def abandoned?
    if actions.length > 0 && !force_ended_at
      return actions.order(:created_at).last.created_at < 7.days.ago
    elsif !force_ended_at
      return created_at < 7.days.ago
    end

    false
  end

  def last_move_at
    actions.order(:created_at).last&.created_at
  end

  def clone(host, log)
    cloned_game = dup
    cloned_game.cloned_from_game = self
    cloned_game.host = host
    cloned_game.users << host
    puts "Cloning game #{cloned_game.name}"
    puts "Full game has #{actions.length} actions; cloning #{log.length} actions"
    actions.order(created_at: :asc).first(log.length).each do |action|
      cloned_game.actions << action.dup.tap do |cloned_action|
        parsed_data = JSON.parse(action.data)
        if parsed_data.dig("payload", "soloMode") == false
          parsed_data["payload"]["soloMode"] = true
          cloned_action.data = parsed_data.to_json
        end
        cloned_action.originally_created_at = action.created_at
      end
    end
    cloned_game.save
    cloned_game
  end
end

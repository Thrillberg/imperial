class Game < ActiveRecord::Base
  enum base_game: {imperial: 0, imperial2030: 1, imperialAsia: 2, imperialEurope2030: 3}
  enum variant: {standard: 0, auction: 1, withoutInvestorCard: 2}
  enum time_commitment: {infinite: 0, slow: 1, async: 2, live: 3}, _suffix: "game"

  has_many :actions, dependent: :destroy
  has_many :players, dependent: :destroy
  has_many :users, through: :players
  has_many :cloned_games, class_name: "Game", foreign_key: "cloned_from_game_id", dependent: :nullify
  has_many :snapshots

  belongs_to :winner, class_name: "User", optional: true
  belongs_to :host, class_name: "User"
  belongs_to :current_player, class_name: "User", optional: true
  belongs_to :cloned_from_game, class_name: "Game", optional: true

  scope :current, -> {
    includes(:host, :users)
      .where(force_ended_at: nil, cancelled_at: nil)
      .order(created_at: :desc)
  }

  def self.import(log, host_id)
    initialize_payload = log[0]["payload"]
    raise ArgumentError unless log[0]["type"] == "initialize"

    imported_games_count = Game.where(is_imported: true).count
    host = User.find(host_id)
    game = Game.new(base_game: initialize_payload["baseGame"], variant: initialize_payload["variant"], host: host)
    initialize_payload["players"].each do |player|
      user = User.create!(name: player["id"] + "-import(#{rand(100000)})")
      game.players << Player.new(user: user)
    end
    log.each do |action|
      if action["type"] == "initialize"
        action["payload"]["soloMode"] = true
      end
      game.actions << Action.new(data: action.to_json)
    end
    game.is_imported = true
    game.name = "Imported game: #{imported_games_count + 1}"
    game.save!
    game
  end

  def to_json
    observers = Rails.cache.fetch("users_observing_game_#{id}") { [] }
    latest_state = snapshots.order(:created_at).last&.state
    parsed_latest_state = latest_state ? JSON.parse(latest_state)["state"] : nil
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
      is_public: is_public,
      time_commitment: time_commitment,
      latest_state: parsed_latest_state
    }
  end

  def to_json_with_observers(observers)
    latest_state = snapshots.order(:created_at).last&.state
    parsed_latest_state = latest_state ? JSON.parse(latest_state)["state"] : nil

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
      is_public: is_public,
      time_commitment: time_commitment,
      latest_state: parsed_latest_state
    }
  end

  def log
    actions.order(:created_at).map do |action|
      JSON.parse(action.data)
    end
  end

  def abandoned?
    if actions.any? && !force_ended_at
      return actions.order(:created_at).last.created_at < 7.days.ago
    elsif actions.any? { |a| JSON.parse(a.data)["type"] == "rondel" } && !force_ended_at
      return actions.order(:created_at).last.created_at < 30.days.ago
    elsif !force_ended_at
      return created_at < 7.days.ago
    end

    false
  end

  def last_move
    actions.order(:created_at).last
  end

  def last_move_at
    last_move&.created_at
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

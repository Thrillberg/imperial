require "rails_helper"

RSpec.describe Game, "#to_json" do
  it "converts the game data to json" do
    host_user = create(:user)
    game = create(:game, host: host_user)
    host = create(:player, user: host_user, game: game)
    players = [host] + create_list(:player, 4, game: game)
    player_names = players.map { |player| {name: player.user.name, id: player.user.id} }

    expect(game.to_json).to eq({
      name: game.name,
      base_game: game.base_game,
      id: game.id,
      host: host_user.name,
      players: player_names,
      force_ended_at: nil,
      current_player_name: nil,
      cancelled_at: game.cancelled_at,
      created_at: game.created_at,
      started_at: game.started_at,
      winner_name: nil,
      observers: [],
      variant: "standard",
      last_move_at: game.last_move_at,
      cloned_from_game: nil,
      is_public: true
    })
  end
end

RSpec.describe Game, "#log" do
  context "game has two actions" do
    let(:game) { create(:game) }
    action1_string = "{\"type\":\"rondel\",\"payload\":{\"nation\":{\"value\":\"CN\",\"label\":\"Nation2030\"},\"cost\":0,\"slot\":\"production1\"}}"
    action2_string = "{\"type\":\"maneuver\",\"payload\":{\"origin\":\"northafrica\",\"destination\":\"nigeria\"}}"
    let!(:action1) { create(:action, data: action1_string, game: game, created_at: 2.days.ago) }
    let!(:action2) { create(:action, data: action2_string, game: game, created_at: 1.day.ago) }

    it "converts the actions to a game log as json" do
      expect(game.log).to eq([
        JSON.parse(action1_string),
        JSON.parse(action2_string)
      ])
    end
  end
end

RSpec.describe Game, "#abandoned?" do
  context "last action was more than 7 days ago" do
    let(:game) { create(:game, created_at: 8.days.ago) }
    let!(:action1) { create(:action, data: "anything", created_at: 9.days.ago, game: game) }
    let!(:action2) { create(:action, data: "anything", created_at: 8.days.ago, game: game) }

    it "returns true" do
      expect(game.abandoned?).to eq true
    end
  end

  context "last action was less than 7 days ago" do
    let(:game) { create(:game, created_at: 1.day.ago) }
    let!(:action1) { create(:action, data: "anything", created_at: 8.days.ago, game: game) }
    let!(:action2) { create(:action, data: "anything", created_at: 1.day.ago, game: game) }

    it "returns false" do
      expect(game.abandoned?).to eq false
    end
  end
end

require "rails_helper"

RSpec.describe Game, "#to_json" do
  it "converts the game data to json" do
    host_user = create(:user)
    game = create(:game, host: host_user)
    host = create(:player, user: host_user, game: game)
    players = [host] + create_list(:player, 4, game: game)
    player_names = players.map { |player| player.user.name }

    expect(game.to_json).to eq({
      name: game.name,
      id: game.id,
      host: host_user.name,
      players: player_names,
      force_ended_at: nil,
      current_player_name: nil,
      cancelled_at: game.cancelled_at,
      created_at: game.created_at
    })
  end
end

RSpec.describe Game, "#abandoned?" do
  context "last action was more than 3 days ago" do
    let(:game) { create(:game, created_at: 4.days.ago) }
    let!(:action1) { create(:action, data: "anything", created_at: 5.days.ago, game: game) }
    let!(:action2) { create(:action, data: "anything", created_at: 4.days.ago, game: game) }

    it "returns true" do
      expect(game.abandoned?).to eq true
    end
  end

  context "last action was less than 3 days ago" do
    let(:game) { create(:game, created_at: 1.day.ago) }
    let!(:action1) { create(:action, data: "anything", created_at: 4.days.ago, game: game) }
    let!(:action2) { create(:action, data: "anything", created_at: 1.day.ago, game: game) }

    it "returns false" do
      expect(game.abandoned?).to eq false
    end
  end
end

require "rails_helper"

RSpec.describe Game, "#to_json" do
  it "converts the game data to json" do
    host_user = create(:user)
    game = create(:game, host: host_user)
    host = create(:player, user: host_user, game: game)
    players = [host] + create_list(:player, 4, game: game)
    player_names = players.map { |player| {name: player.user.name, id: player.user.id, isBot: false} }

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
      is_public: true,
      latest_state: nil
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

RSpec.describe Game, "#import" do
  context "valid input" do
    let!(:host) { create(:user) }

    action1 = {
      "type" => "initialize",
      "payload" => {
        "players" => [
          {"id" => "Henry", "nation" => {"value" => "RU", "label" => "Nation2030"}},
          {"id" => "Otto", "nation" => {"value" => "CN", "label" => "Nation2030"}},
          {"id" => "Raguel the Seal", "nation" => {"value" => "IN", "label" => "Nation2030"}},
          {"id" => "Louis", "nation" => {"value" => "BR", "label" => "Nation2030"}},
          {"id" => "Conrad", "nation" => {"value" => "US", "label" => "Nation2030"}},
          {"id" => "Charles", "nation" => {"value" => "EU", "label" => "Nation2030"}}
        ],
        "soloMode" => true,
        "variant" => "standard",
        "baseGame" => "imperial2030"
      }
    }
    action2 = {"type" => "rondel", "payload" => {"nation" => {"value" => "RU", "label" => "Nation2030"}, "cost" => 0, "slot" => "factory"}}
    action3 = {"type" => "buildFactory", "payload" => {"province" => "novosibirsk"}}

    log = [action1, action2, action3]

    it "creates a Game record" do
      expect { Game.import(log, host.id) }.to change { Game.count }.by(1)
    end

    it "imports the right actions" do
      game = Game.import(log, host.id)

      expect(game.actions[0].data).to eq(action1.to_json)
      expect(game.actions[1].data).to eq(action2.to_json)
      expect(game.actions[2].data).to eq(action3.to_json)
    end

    it "inserts the right number of players" do
      game = Game.import(log, host.id)
      expected_names = ["Henry", "Otto", "Raguel the Seal", "Louis", "Conrad", "Charles"]

      game.players.each_with_index do |player, index|
        expect(player.user.name).to start_with expected_names[index]
      end
    end

    it "indicates that it is imported" do
      game = Game.import(log, host.id)

      expect(game.is_imported).to be(true)
    end
  end

  context "invalid input, missing initialize action" do
    let!(:host) { create(:user) }

    action1 = {"type" => "rondel", "payload" => {"nation" => {"value" => "RU", "label" => "Nation2030"}, "cost" => 0, "slot" => "factory"}}
    action2 = {"type" => "buildFactory", "payload" => {"province" => "novosibirsk"}}

    log = [action1, action2]

    it "raises an error" do
      expect { Game.import(log, host.id) }.to raise_error(ArgumentError)
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

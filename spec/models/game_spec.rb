require "rails_helper"

RSpec.describe Game, "#to_json" do
  it "converts the game data to json" do
    host_user = create(:user)
    game = create(:game, host: host_user)
    host = create(:player, user: host_user, game: game)
    players = [host] + create_list(:player, 4, game: game)
    player_names = players.map { |player| player.user.name }
    actions = create_list(:action, 2, game: game)
    log = actions.map(&:data)

    expect(game.to_json).to eq({
      name: game.name,
      id: game.id,
      host: host_user.name,
      players: player_names,
      log: log
    })
  end
end

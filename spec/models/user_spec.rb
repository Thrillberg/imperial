require "rails_helper"

RSpec.describe User, "#convert_games" do
  it "updates the user's name in the game" do
    user = create(:user, name: "old name")
    game = create(:game, host: user)
    create(:player, game: game, user: user)
    initialize_action = create(:action, data: "old name", game: game)
    user.update(name: "new name")
    
    user.convert_games("old name")

    expect(game.actions.first.data).to include("new name")
    expect(game.actions.first.data).not_to include("old name")
  end
end

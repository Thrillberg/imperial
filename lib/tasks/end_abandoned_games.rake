desc "Find all abandoned games (last move was more than 3 days ago) and end them"

task end_abandoned_games: :environment do
  Game.find_each(batch_size: 100) do |game|
    if game.abandoned?
      Rails.logger.info "#{game.name} is abandoned. Force-ending now..."
      game.update(force_ended_at: Time.now)
    end
  end
end

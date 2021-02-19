desc "Find all abandoned games (last move was more than 3 days ago) and end them"

task end_abandoned_games: :environment do
  Game.all.each do |game|
    if game.abandoned?
      puts "#{game.name} is abandoned. Force-ending now..."
      game.update(force_ended_at: Time.now)
    end
  end
end

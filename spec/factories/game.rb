FactoryBot.define do
  factory :game do
    sequence(:name) { |x| "game #{x}" }
    association :host, factory: :user

    trait :finished do
      after :create do |game|
        create_list(:player, rand(1..5), :with_score, game: game)
        game.update(
          winner: game.players.max_by { |player| player.score }.user
        )
      end
    end
  end
end

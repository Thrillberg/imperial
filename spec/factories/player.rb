FactoryBot.define do
  sequence(:score) { |x| rand(50) * x }

  factory :player do
    game
    user

    trait :with_score do
      score { generate(:score) }
    end
  end
end

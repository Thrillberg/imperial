FactoryBot.define do
  factory :game do
    sequence(:name) { |x| "game #{x}" }
  end
end

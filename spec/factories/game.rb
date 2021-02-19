FactoryBot.define do
  factory :game do
    sequence(:name) { |x| "game #{x}" }
    association :host, factory: :user
  end
end

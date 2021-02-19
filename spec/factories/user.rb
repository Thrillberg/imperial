FactoryBot.define do
  factory :user do
    sequence(:name) { |x| "user #{x}" }
  end
end

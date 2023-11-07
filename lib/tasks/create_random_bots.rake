desc "Create 5 random bot users"

task create_random_bots: :environment do
  User.create(name: "Red Anarchist", is_bot: true)
  User.create(name: "Blue Anarchist", is_bot: true)
  User.create(name: "Green Anarchist", is_bot: true)
  User.create(name: "Purple Anarchist", is_bot: true)
  User.create(name: "Pink Anarchist", is_bot: true)
end

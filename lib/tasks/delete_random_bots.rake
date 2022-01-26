desc "Delete 5 random bot users"

task delete_random_bots: :environment do
  User.find_by(name: "Red Anarchist 🤖").destroy
  User.find_by(name: "Blue Anarchist 🤖").destroy
  User.find_by(name: "Green Anarchist 🤖").destroy
  User.find_by(name: "Purple Anarchist 🤖").destroy
  User.find_by(name: "Pink Anarchist 🤖").destroy
end

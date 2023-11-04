require "openai"

desc "Run training on OpenAI bot"

task train_openai_bot: :environment do
  real_games = Game.joins(:players)
    .where('game_id IN (SELECT game_id FROM players GROUP BY game_id HAVING COUNT(game_id) > 1)')
    .where.not(winner_id: nil)
  real_games.order(created_at: :desc)[1..9].each do |game|
    snapshots = Snapshot.where(game: game)
    snapshots.each do |snapshot|
      full_state = JSON.parse(snapshot.state)
      binding.pry
      # parsed_state = JSON.parse(full_state["state"])

      # units = {}
      # full_units = JSON.parse(full_state["state"])["oldState"]["units"]
      # full_units.each do |nation, provinces|
      #   units[nation] = {}
      #   provinces.each do |province, unit_data|
      #     if unit_data["armies"] != 0 || unit_data["fleets"] != 0
      #       units[nation][province] = unit_data
      #     end
      #   end
      # end

      # parsed_state["oldState"]["units"] = units

      # provinces = {}
      # full_provinces = JSON.parse(full_state["state"])["oldState"]["provinces"]
      # full_provinces.each do |province, factory_data|
      #   if factory_data["factory"]
      #     provinces[province] = factory_data
      #   end
      # end

      # parsed_state["oldState"]["provinces"] = provinces

      # prompt = parsed_state.to_json
      # completion = full_state["action"]

      parsed_log = JSON.parse(full_state["log"])
      parsed_available_actions = JSON.parse(full_state["available_actions"])
      prompt = {log: parsed_log, available_actions: parsed_available_actions}.to_json
      completion = " " + full_state["action"]

      line = { prompt: prompt, completion: completion }.to_json

      File.open("public/openai.jsonl", "a") do |f|
        f << line + "\n"
      end
    end
  end

  client = OpenAI::Client.new
  binding.pry
  # response = client.files.upload(parameters: { file: "public/openai.jsonl", purpose: "fine-tune" })
  # file_id = JSON.parse(response.body)["id"]
  # response = client.finetunes.create(
  #   parameters: {
  #     training_file: file_id,
  #     model: "davinci-002",
  #   }
  # )
  puts client.finetunes.list
end
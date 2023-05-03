class Snapshot < ActiveRecord::Base
  belongs_to :game

  def to_csv
    state_as_array = []
    16.times do
      state_as_array << nil
    end
    parsed_state = JSON.parse(JSON.parse(state)["state"])

    # Rondel positions
    nations_order = ["AH", "IT", "FR", "GB", "GE", "RU"]
    rondel_positions_order = ["taxation", "factory", "production1", "maneuver1", "investor", "import", "production2", "maneuver2"]
    nations = parsed_state["nations"]
    nations.each do |nation|
      nation.each do |key, value|
        state_as_array[nations_order.index(key)] = rondel_positions_order.index(value["rondelPosition"]) || -1
        state_as_array[nations_order.index(key) + 6] = value["powerPoints"]
      end
    end

    # Number of available bonds
    owned_bonds_count = 0
    JSON.parse(JSON.parse(state)["state"])["players"].each do |key, value|
      owned_bonds_count += value["bonds"].count
    end
    state_as_array[12] = (9 * 6) - owned_bonds_count

    # Current player
    current_nation = parsed_state["currentNation"]
    current_player_name = ""
    parsed_state["nations"].each do |nation|
      nation.each do |key, value|
        if key == current_nation
          current_player_name = value["controller"]
        end
      end
    end
    current_player = {}
    parsed_state["players"].each do |key, value|
      if key == current_player_name
        current_player = value
      end
    end
    state_as_array[13] = current_player["cash"]
    state_as_array[14] = current_player["rawScore"] || 0
    state_as_array[15] = current_player["bonds"].count

    # Annotation

    # We're training to maximize current player's score and we value winning
    # d = change in score over 25 moves
    # annotation 9: d >= 10
    # annotation 8: d >= 6 && d < 10
    # annotation 7: d >= 3 && d < 6
    # annotation 6: d >= 2 && d < 3
    # annotation 5: d >= 1 && d < 2
    # annotation 4: d >= 0 && d < 1
    # annotation 3: d >= -1 && d < 0
    # annotation 2: d >= -3 && d < -1
    # annotation 1: d >= -6 && d < -3
    # annotation 0: d < -6
    # 1 is added to annotation if current player won the game

    game_snapshots = Snapshot.where(game: game).order(created_at: :asc)
    current_index = game_snapshots.index(self)
    comparison_snapshot = game_snapshots[current_index + 10]
    if comparison_snapshot
      current_score = state_as_array[13] + state_as_array[14]

      future_player = {}
      future_parsed_state = JSON.parse(JSON.parse(comparison_snapshot.state)["state"])
      future_parsed_state["players"].each do |key, value|
        if key == current_player_name
          future_player = value
        end
      end

      future_score = future_player["cash"] + (future_player["rawScore"] || 0)
      difference = future_score - current_score
      state_as_array[16] = annotation(difference)
    else
      state_as_array[16] = 4 # default, neutral number
    end

    if game.winner == current_player_name
      state_as_array[16] += 1
    end

    state_as_array.join(",")
  end

  private

  def annotation(difference)
    if difference >= 10
      9
    elsif difference >= 6
      8
    elsif difference >= 3
      7
    elsif difference >= 2
      6
    elsif difference >= 1
      5
    elsif difference >= 0
      4
    elsif difference >= -1
      3
    elsif difference >= -3
      2
    elsif difference >= -6
      1
    else
      0
    end
  end
end

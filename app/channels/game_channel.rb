require "openai"

class GameChannel < ApplicationCable::Channel
  def subscribed
    stream_from "game_channel"
    broadcast_games "game_channel", "updateGames"
  end

  def receive(data)
    case data["kind"]
    when "openGame"
      broadcast_games "game_channel", "updateGames"

    when "joinGame"
      game = game_from_data(data)
      user = User.find(data["data"]["userId"])
      game.users << user
      broadcast_games "game_channel", "updateGames"

    when "addRandomBot"
      game = game_from_data(data)
      user = User.bots.find { |bot| !game.users.include?(bot) }
      game.users << user
      broadcast_games "game_channel", "updateGames"

    when "getGameLog"
      game = game_from_data(data)
      broadcast_update_game_log "game_channel", "updateGameLog", game

    when "getBotMove"
      game = game_from_data(data)
      # move = ask_chatgpt(data)
      move = ask_finetuned_chatgpt(data)
      move_to_json = nil

      until move_to_json
        begin
          # binding.pry
          move_to_json = JSON.parse(move)
        rescue
          # move = ask_chatgpt(data)
          move = ask_finetuned_chatgpt(data)
          next
        end
      end

      broadcast_bot_move "game_channel", "botMove", game.id, move_to_json

    when "tick"
      game = game_from_data(data)
      game.update(started_at: Time.zone.now) unless game.started_at
      game.update(force_ended_at: nil) if game.force_ended_at
      data = data["data"]["action"]
      action = Action.create(data: data)
      if game.cloned_from_game
        action.originally_created_at = Time.zone.now
        action.save
      end
      game.actions << action
      broadcast_update_game_log "game_channel", "updateGameLog", game
      broadcast_games "game_channel", "updateGames"

    when "saveSnapshot"
      game = game_from_data(data)
      state = data["data"]["state"]
      available_actions = data["data"]["availableActions"]
      log = data["data"]["log"]
      action = data["data"]["action"]
      full_state = {state: state, available_actions: available_actions, log: log, action: action}.to_json
      Snapshot.create(game: game, state: full_state)

    when "updateGames"
      broadcast_games "game_channel", "updateGames"

    when "cancelGame"
      game = game_from_data(data)
      game.update(cancelled_at: Time.zone.now)
      broadcast_games "game_channel", "updateGames"

    when "bootPlayer"
      game = game_from_data(data)
      user_id = game.users.find_by(name: data["data"]["playerName"]).id
      game.players.find_by(user_id: user_id).delete
      broadcast_games "game_channel", "updateGames"

    when "updateCurrentPlayerName"
      game = game_from_data(data)
      current_player_name = data["data"]["currentPlayerName"]
      new_player = game.users.find_by(name: current_player_name)
      game.update(current_player: new_player)
      broadcast_games "game_channel", "updateGames"

    when "notifyNextPlayer"
      game = game_from_data(data)
      next_player_name = data["data"]["nextPlayerName"]
      next_player = game.users.find_by(name: next_player_name)

      if !game.winner && !game.last_move&.player_notified_at && !game.cloned_from_game
        # Send email notification
        should_send_turn_notification = next_player&.turn_notifications_enabled
        if should_send_turn_notification
          TurnNotificationJob.set(wait: 1.hour)
            .perform_later(next_player.id, game.id)
        end
        # Send Discord notification
        current_player_discord_id = next_player&.discord_id
        if current_player_discord_id.present? && ENV["RAILS_ENV"] == "production"
          puts "Preparing to send notifyNextPlayer Discord notification"
          DiscordTurnNotificationJob.set(wait: 5.minutes)
            .perform_later(current_player_discord_id, next_player.id, game.id, game.name)
        end

        game.last_move.update(player_notified_at: Time.now)
      end

    when "updateWinnerName"
      game = game_from_data(data)
      scores = data["data"]["scores"]
      game.players.each do |player|
        player.update(score: scores[player.user.name])
      end
      winner_name = data["data"]["winnerName"]
      winner = game.users.find_by(name: winner_name)
      someone_already_won_the_game = game.winner
      game.update(winner: winner) unless someone_already_won_the_game
      if !someone_already_won_the_game && !game.cloned_from_game
        # Send email notifications to all players
        game.players.each do |player|
          should_send_turn_notification = player.user&.turn_notifications_enabled
          should_send_turn_notification = true
          if player.user.name === winner_name && should_send_turn_notification
            YouWonNotificationJob.perform_later(player.id, game.id)
          elsif should_send_turn_notification
            GameOverNotificationJob.perform_later(player.id, game.id)
          end
        end
        # Send Discord notification to channel
        if ENV["RAILS_ENV"] == "production"
          puts "Preparing to send updateWinnerName Discord notification"
          DiscordGameOverNotificationJob.perform_later(winner_name, game.id, game.name)
        end
      end
      broadcast_games "game_channel", "updateGames"

    when "userObservingGame"
      user_name = data["data"]["playerName"]
      game_id = data["data"]["gameId"]
      users_observing_game = JSON.parse(REDIS.get("users_observing_games"))[game_id]
      users_observing_game ||= []
      unless users_observing_game.include? user_name
        users_observing_game << user_name
      end
      users_observing_games = JSON.parse(REDIS.get("users_observing_games")).merge(game_id => users_observing_game).to_json
      REDIS.set("users_observing_games", users_observing_games)
      broadcast_games "game_channel", "updateGames"

    when "userStoppedObservingGame"
      user_name = data["data"]["playerName"]
      game_id = data["data"]["gameId"]
      users_observing_game = JSON.parse(REDIS.get("users_observing_games"))[game_id]
      users_observing_game ||= []
      if users_observing_game.include? user_name
        users_observing_game.delete(user_name)
      end
      users_observing_games = JSON.parse(REDIS.get("users_observing_games")).merge(game_id => users_observing_game).to_json
      REDIS.set("users_observing_games", users_observing_games)
      broadcast_games "game_channel", "updateGames"

    end
  end

  private

  def game_from_data(data)
    Game.includes(:actions).find(data["data"]["gameId"])
  end

  def ask_chatgpt(data)
    game = game_from_data(data)
    available_actions = data["data"]["availableActions"]
    latest_state = data["data"]["latestState"]
    if latest_state
      units = {}
      full_units = latest_state["units"]
      full_units.each do |nation, provinces|
        units[nation] = {}
        provinces.each do |province, unit_data|
          if unit_data["armies"] != 0 || unit_data["fleets"] != 0
            units[nation][province] = unit_data
          end
        end
      end

      latest_state["units"] = units

      provinces = {}
      full_provinces = latest_state["provinces"]
      full_provinces.each do |province, factory_data|
        if factory_data["factory"]
          provinces[province] = factory_data
        end
      end

      latest_state["provinces"] = provinces
    end
    
    client = OpenAI::Client.new
    response = client.chat(
      parameters: {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are playing a game of Imperial. The object of the game is to end the game with the most points. Your points are calculated by adding your player's cash and score. Your score is calculated by multiplying the value of your nation bonds by the bond multiplier (1x, 2x, 3x, 4x or 5x, depending on the power points of the bond's nation)."
            },
            {
              role: "system",
              content: "Imperial is a board game in which you play as an investor in imperial powers. Players own bonds in various nations and whoever owns the majority stake in a nation controls the actions of that nation.
              Each nation takes its turn to do one action on the rondel. Whoever happens to control that nation when it is the nation's turn is the person who decides what that nation will do on that turn. Nations gain power points (which are increased by building factories and occupying territory). The first nation to gain 25 power points signals the end of the game. The winner of the game is determined by evaluating the bonds controlled by each player and calculating who has the most valuable portfolio. A player's cash is also counted toward the final score.

              When a nation's turn occurs, the current controller of that nation is allowed to place the nation's marker on a rondel slot (the effects of which are detailed below). Moving around the rondel in a clockwise fashion, players are allowed to advance their nation's marker up to 3 slots for free and each additional slot costs the player 2m per slot beyond the free 3, up to 3 additional slots. Costs in Imperial 2030 and Imperial Asia vary.
              
              Production
              Unoccupied factories produce a unit. Blue factories produce fleets and black factories produce armies.
              
              Factory
              Nation builds a factory for 5m.
              
              Import
              Nation may purchase up to 3 units for 1m each, to be placed anywhere in their home territory.
              
              Maneuver
              Units may move. Fleets must move first, followed by armies.
              
              Railroad Rule
              On a maneuver turn, an army may move inside their own home territory for free, in addition to being able to move to one adjacent land region. If a home province is occupied by a foreign power, the railroad network is not operational in that province and armies may not move through that province for free.
              Convoy
              Armies may use fleets to cross ocean regions. One fleet may only convoy one army per turn.
              Fighting and Coexisting
              When moving into a region occupied by another power, you will be given a choice of either fighting or coexisting. If you fight, your unit and one of their units will be removed from the board. If you coexist (and the other player coexists), both units remain but the dot on the region will not change.
              Placing a Dot
              If a nation has the only units in a neutral region (ie, one which is not a home province of another nation), the neutral region will acquire a dot in the color representing that nation.
              Investor
              Nation pays players interest, investor card holder receives 2m and may purchase a bond, Swiss Banks may invest.
              
              Taxation
              Player receives tax (2m per unoccupied factory and 1m per dot) from the nation. Power points are increased and nation receives tax, less soldiers' pay (1m per unit).
              
              
              The Investor Card
              
              The investor card rotates independently through the players as the game progresses. Each time the Investor rondel slot is landed on, the following steps are followed:
              
              Interest payments are made
              Each player who owns a bond in the nation that landed on the Investor rondel slot is paid interest from the nation. The interest on a bond is the left-hand number on the bond card.
              
              Investor is activated
              The player who has the investor card is given 2m and can purchase one bond. Bear in mind that it is possible to trade up a bond that you already own. Payments for bonds are taken from the player's cash and given to the nation's treasury.
              
              Swiss Bank
              If any players control no nations, then they represent a Swiss Bank and can purchase a bond, even if they do not have the investor card. After the Investor purchases a bond, the Swiss Banks will be allowed to purchase a bond. Then the investor card changes hands.
              
              If the investor rondel slot is passed-through by any nation, steps two and three above are triggered after the target rondel action is handled."
            },
            {
              role: "system",
              content: "You want to produce or import units before you perform any maneuver action. You only want to choose a maneuver action (maneuver1 or maneuver2) when your nation has units in the 'units' key of the game state. If you have no units (armies and fleets), maneuver is useless. When maneuvering, you generally want to move all your units. You want to occupy neutral provinces. Neutral provinces are ones that do not have a Nation associated with them on the board JSON. You want to fight enemy armies and fleets. Sometimes you want to disable or destroy their factories. You want your nations to cooperate with each other against enemy nations."
            },
            {
              role: "system",
              content: "If your nation can pay out you almost always want to land on the Investor slot. However, only the player with the Investor Card may buy a bond."
            },
            {
              role: "system",
              content: "If you are on the factory slot you always want to build a factory unless your nation cannot afford it or you cannot build one. Factories are one of the main ways to gain power points. To find out if your nation can afford it, refer to the nation's treasury."
            },
            {
              role: "system",
              content: "You generally only want to land on the taxation slot if your nation will increase in power points. This is how you increase your points."
            },
            {
              role: "system",
              content: "Here is the board, in JSON: #{data["data"]["board"].to_json}"
            },
            {
              role: "system",
              content: "Here is the current game state, in JSON: #{latest_state&.to_json}"
            },
            {
              role: "system",
              content: "You must select an action from the given availableActions. Reply with an array with two items: 1) the action as a JSON object with two keys, type and payload, exactly as given in the availableActions array, without any preamble, and 2) a string expressing the reason for your move. No additional language is desirable. Do not begin your response with 'I suggest' or 'I recommend'. Respond only with an array of two objects as previously explained. Here are the only available actions, in JSON: #{available_actions.to_json}"
            }
          ],
          temperature: 0,
      })
    puts "here is the board"
    puts data["data"]["board"]
    puts "here are the available actions"
    puts available_actions
    puts "here is the state"
    puts latest_state
    puts "Here is the response"
    puts "------------------------"
    puts response

    content = response.dig("choices", 0, "message", "content")

    content
  end

  def ask_finetuned_chatgpt(data)
    game = game_from_data(data)
    available_actions = data["data"]["availableActions"]
    log = data["data"]["logSlice"]

    prompt = { log: log, available_actions: available_actions }.to_json

    client = OpenAI::Client.new
    response = client.completions(
      parameters: {
        model: "ft:davinci-002:personal::8HKYEFNW",
        prompt: prompt,
        max_tokens: 50
      }
    )
    binding.pry
    response["choices"][0]["text"].split(/(?<=}) /)[0].strip
  end
end

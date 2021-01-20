class AppearanceChannel < ApplicationCable::Channel
  def subscribed
    stream_from "appearance_channel"
    ActionCable.server.broadcast(
      "appearance_channel",
      { kind: "updateUsers", data: {users: User.all} }
    )
    payload = {
      kind: "updateGames",
      data: {
        games: Game.all.map do |game|
          to_json(game)
        end
      }
    }
    ActionCable.server.broadcast("appearance_channel", payload)
  end

  def receive(data)
    case data["kind"]
    when "openGame"
      host = User.find_by(name: data["data"]["host"])
      host.games << Game.create(name: lovely_string, host: host)
      payload = {
        kind: "updateGames",
        data: {
          games: Game.all.map do |game|
            to_json(game)
          end
        }
      }
      ActionCable.server.broadcast("appearance_channel", payload)
    when "joinGame"
      game = Game.find(data["data"]["gameId"])
      user = User.find(data["data"]["userId"])
      game.users << user
      payload = {
        kind: "updateGames",
        data: {
          games: Game.all.map do |game|
            to_json(game)
          end
        }
      }
      ActionCable.server.broadcast("appearance_channel", payload)
    when "getGameLog"
      game = Game.find(data["data"]["gameId"])
      payload = {
        kind: "updateGameLog",
        data: {
          gameId: game.id,
          log: game.actions.order(:created_at).map(&:data)
        }
      }
      ActionCable.server.broadcast("appearance_channel", payload)
    when "tick"
      game = Game.find(data["data"]["gameId"])
      data = data["data"]["action"]
      game.actions << Action.create(data: data)
      payload = {
        kind: "updateGameLog",
        data: {
          gameId: game.id,
          log: game.actions.order(:created_at).map(&:data)
        }
      }
      ActionCable.server.broadcast("appearance_channel", payload)
    end
  end

  private

  def to_json(game)
    {
      name: game.name,
      id: game.id,
      host: game.host.name,
      players: game.users.map(&:name),
      log: game.actions.map(&:data)
    }
  end

  def lovely_string
    ADJECTIVES.sample + " " + NOUNS.sample
  end

  ADJECTIVES = [
	  "autumn", "hidden", "bitter", "misty", "silent", "empty", "dry", "dark", "summer", "icy", "delicate", "quiet", "white", "cool", "spring", "winter", "patient", "twilight", "dawn", "crimson", "wispy", "weathered", "blue", "billowing", "broken", "cold", "damp", "falling", "frosty", "green", "long", "late", "lingering", "bold", "little", "mourning", "muddy", "old", "red", "rough", "still", "small", "sparkling", "throbbing", "shy", "wandering", "withered", "wild", "black", "young", "holy", "solitary", "fragrant", "aged", "snowy", "proud", "floral", "restless", "divine", "polished", "ancient", "purple", "lively", "nameless", "verklempt", "filipendulous", "friable", "gezellig", "aleatory", "novaturient", "capernoited", "cosmogyral", "foudroyant", "glacous", "solivagant", "arcadian", "incalescent", "nubivagant", "orotund", "aspectabund", "novitious", "gauche", "discombobulated", "numinous", "eonian",
  ]

  NOUNS = [
	  "waterfall", "river", "breeze", "moon", "rain", "wind", "sea", "morning", "snow", "lake", "sunset", "pine", "shadow", "leaf", "dawn", "glitter", "forest", "hill", "cloud", "meadow", "sun", "glade", "bird", "brook", "butterfly", "bush", "dew", "dust", "field", "fire", "flower", "firefly", "feather", "grass", "haze", "mountain", "night", "pond", "darkness", "snowflake", "silence", "sound", "sky", "shape", "surf", "thunder", "violet", "water", "wildflower", "wave", "water", "resonance", "sun", "wood", "dream", "cherry", "tree", "fog", "frost", "voice", "paper", "frog", "smoke", "star", "snood", "aglet", "splat", "tact", "zugzwang", "carriwitchet", "noosphere", "pettifoggery", "quiddity", "kakistocracy", "holophrasis",
  ]
end

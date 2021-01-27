class OpenGameChannel < ApplicationCable::Channel
  def subscribed
    stream_from "open_game_channel"
    broadcast_games "open_game_channel", "updateGames"
  end

  def receive(data)
    host = User.find_by(name: data["data"]["host"])
    host.games << Game.create(name: lovely_string, host: host)
    broadcast_games "open_game_channel", "updateGames"
  end

  private

  def lovely_string
    ADJECTIVES.sample + " " + NOUNS.sample
  end

  ADJECTIVES = [
    "autumn", "hidden", "bitter", "misty", "silent", "empty", "dry", "dark", "summer", "icy", "delicate", "quiet", "white", "cool", "spring", "winter", "patient", "twilight", "dawn", "crimson", "wispy", "weathered", "blue", "billowing", "broken", "cold", "damp", "falling", "frosty", "green", "long", "late", "lingering", "bold", "little", "mourning", "muddy", "old", "red", "rough", "still", "small", "sparkling", "throbbing", "shy", "wandering", "withered", "wild", "black", "young", "holy", "solitary", "fragrant", "aged", "snowy", "proud", "floral", "restless", "divine", "polished", "ancient", "purple", "lively", "nameless", "verklempt", "filipendulous", "friable", "gezellig", "aleatory", "novaturient", "capernoited", "cosmogyral", "foudroyant", "glacous", "solivagant", "arcadian", "incalescent", "nubivagant", "orotund", "aspectabund", "novitious", "gauche", "discombobulated", "numinous", "eonian"
  ]

  NOUNS = [
    "waterfall", "river", "breeze", "moon", "rain", "wind", "sea", "morning", "snow", "lake", "sunset", "pine", "shadow", "leaf", "dawn", "glitter", "forest", "hill", "cloud", "meadow", "sun", "glade", "bird", "brook", "butterfly", "bush", "dew", "dust", "field", "fire", "flower", "firefly", "feather", "grass", "haze", "mountain", "night", "pond", "darkness", "snowflake", "silence", "sound", "sky", "shape", "surf", "thunder", "violet", "water", "wildflower", "wave", "water", "resonance", "sun", "wood", "dream", "cherry", "tree", "fog", "frost", "voice", "paper", "frog", "smoke", "star", "snood", "aglet", "splat", "tact", "zugzwang", "carriwitchet", "noosphere", "pettifoggery", "quiddity", "kakistocracy", "holophrasis"
  ]
end

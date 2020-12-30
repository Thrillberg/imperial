class MyActionCable < ActionCable::Server::Base
  def self.server
    new
  end

  def call(env)
    env["rack.session"]["animal"] = "sweat"
    super(env)
  end
end

class MyActionCable < ActionCable::Server::Base
  def self.server
    new
  end

  def call(env)
    env["rack.session"]["animal"] = "sweat"
    response = Rack::Response.new(env)
    response.set_cookie("animal", "no sweat")
    super(env)
  end
end

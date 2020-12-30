module ApplicationCable
  class Connection < ActionCable::Connection::Base
    def connect
      response = Rack::Response.new(@env)
      response.set_cookie("animal", "no sweat")
      pp response
    end
  end
end

class PagesController < ActionController::Base
  def index
    render file: "index.html"
  end
end

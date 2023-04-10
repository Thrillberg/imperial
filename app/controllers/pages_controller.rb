class PagesController < ActionController::Base
  def index
    render file: "dist/index.html"
  end
end

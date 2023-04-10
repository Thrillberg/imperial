class PagesController < ActionController::Base
  def index
    render file: "dist/index.html", content_type: "text/javascript"
  end
end

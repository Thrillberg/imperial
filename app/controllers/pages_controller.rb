class PagesController < ActionController::Base
  def index
    render file: "public/packs/index.html"
  end

  def robots
    rules = <<~ROBOTS
      User-agent: *
      Allow: /
    ROBOTS

    respond_to do |format|
      format.text { render plain: rules }
    end
  end
end

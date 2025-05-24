class ApplicationController < ActionController::Base
  include ActionController::Cookies

  protect_from_forgery with: :exception
  before_action :set_csrf_cookie
  respond_to :json

  private

  def set_csrf_cookie
    cookies["CSRF-TOKEN"] = form_authenticity_token
  end
end

class ApplicationMailer < ActionMailer::Base
  default from: ENV["GMAIL_ADDRESS"]
  layout "mailer"
end

Rails.application.config.after_initialize do
  ActiveSupport.on_load(:blazer) do
    Blazer::ApplicationController.layout "blazer"
  end
end

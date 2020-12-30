Rails.application.routes.draw do
  mount ActionCable.server => "/ws"

  post "/session", to: "sessions#create"
end

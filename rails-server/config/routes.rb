Rails.application.routes.draw do
  mount ActionCable.server => "/ws"

  post "/session", to: "sessions#create"
  post "/user", to: "users#create"
end

Rails.application.routes.draw do
  mount ActionCable.server => "/ws"
  get "/health", to: "health#index"

  post "/session", to: "sessions#create"
  post "/user", to: "users#create"
end

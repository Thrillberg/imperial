Rails.application.routes.draw do
  devise_for :accounts, controllers: {
    registrations: "accounts/registrations",
    sessions: "accounts/sessions"
  }, defaults: {format: :json}
  mount ActionCable.server => "/ws"
  get "/health", to: "health#index"

  post "/session", to: "sessions#create"
  post "/anonymity_confirmations", to: "anonymity_confirmations#create"
  post "/games", to: "games#create"
  resources :users, only: [:show, :create]

  root "pages#index", as: :pages_index
  get "*path", to: "pages#index", format: false
end

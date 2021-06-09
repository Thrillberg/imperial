Rails.application.routes.draw do
  devise_for :accounts, controllers: {
    registrations: "accounts/registrations",
    sessions: "accounts/sessions"
  }, defaults: {format: :json}
  mount ActionCable.server => "/ws"
  get "/health", to: "health#index"

  post "/session", to: "sessions#create"
  post "/anonymity_confirmations", to: "anonymity_confirmations#create"

  get "/get_games", to: "games#index"
  post "/games", to: "games#create"

  resources :clone_games, only: [:create]

  namespace :api do
    resources :users, only: [:show, :create]
    get "/games/:id", to: "games#show"
  end

  resources :profiles, only: [:show]

  root "pages#index", as: :pages_index
  get "*path", to: "pages#index", format: false

  if Rails.env.test?
    require "test_routes"
    define_test_routes
  end
end

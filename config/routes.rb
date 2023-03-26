require "sidekiq/web"

Rails.application.routes.draw do
  devise_for :accounts, controllers: {
    registrations: "accounts/registrations",
    sessions: "accounts/sessions",
    passwords: "accounts/passwords"
  }, defaults: {format: :json}
  mount ActionCable.server => "/ws"
  mount Sidekiq::Web => "/sidekiq"
  get "/health", to: "health#index"

  post "/session", to: "sessions#create"
  post "/anonymity_confirmations", to: "anonymity_confirmations#create"

  get "/get_games", to: "games#index"
  post "/games", to: "games#create"

  resources :clone_games, only: [:create]
  resources :exports, only: [:show]
  resources :imports, only: [:create]

  namespace :api do
    resources :users, only: [:show, :create, :update]
    resources :ranked_games, only: [:index]
  end

  resources :profiles, only: [:show]

  root "pages#index", as: :pages_index
  get "*path", to: "pages#index", format: false
end

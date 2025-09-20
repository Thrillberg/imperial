Rails.application.routes.draw do
  devise_for :accounts, controllers: {
    registrations: "accounts/registrations",
    sessions: "accounts/sessions",
    passwords: "accounts/passwords"
  }, defaults: {format: :json}
  mount ActionCable.server => "/ws"
  authenticate :account, ->(account) { account.admin? } do
    mount Blazer::Engine, at: "blazer"
  end
  get "/health", to: "health#index"

  post "/session", to: "sessions#create"
  post "/anonymity_confirmations", to: "anonymity_confirmations#create"

  resources :clone_games, only: [:create]
  resources :exports, only: [:show]

  unless Rails.env.production?
    resources :imports, only: [:create]
  end

  namespace :api do
    resources :games, only: [:index, :create, :update]
    resources :ranked_games, only: [:index]
    resources :users, only: [:show, :create, :update]
  end

  resources :profiles, only: [:show]

  root "pages#index", as: :pages_index
  get "/robots.txt", to: "pages#robots"
  get "*path", to: "pages#index", constraints: ->(req) { req.format.html? }, format: false

  if Rails.env.test?
    namespace :cypress do
      delete "cleanup", to: "cleanup#destroy"

      resource :factories, only: %i[create]
      resource :sessions, only: %i[create]
    end
  end
end

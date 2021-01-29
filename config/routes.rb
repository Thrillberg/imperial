Rails.application.routes.draw do
  devise_for :accounts, controllers: {
    registrations: "accounts/registrations",
    sessions: "accounts/sessions"
  }, defaults: {format: :json}
  mount ActionCable.server => "/ws"
  get "/health", to: "health#index"

  post "/session", to: "sessions#create"
  resources :users, only: [:show, :create]

  root "pages#index", as: :pages_index
  get "*path", to: "pages#index", format: false
end

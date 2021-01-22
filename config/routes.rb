Rails.application.routes.draw do
  
  devise_for :accounts, controllers: {
    registrations: 'accounts/registrations'
  }
  mount ActionCable.server => "/ws"
  get "/health", to: "health#index"

  post "/session", to: "sessions#create"
  post "/user", to: "users#create"

  root "pages#index", as: :pages_index
  get "*path", to: "pages#index", format: false
end

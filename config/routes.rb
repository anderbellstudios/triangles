Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  mount ActionCable.server => '/cable'

  root 'application#index'
  get '/:id', to: 'application#index'

  resources :games, only: [:show, :create], defaults: { format: :json }
end

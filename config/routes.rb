Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  mount ActionCable.server => '/cable'

  root 'application#index'

  match '/404', to: 'errors#not_found', via: :all
  match '/422', to: 'errors#unprocessable_entity', via: :all
  match '/500', to: 'errors#internal_server_error', via: :all

  resources :games, only: [:show, :create], defaults: { format: :json }

  get '/:id', to: 'application#index'
end

Rails.application.routes.draw do
  post "/login",   to: 'session#create'
  resources :users
end

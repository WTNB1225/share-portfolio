Rails.application.routes.draw do
  post "/login",   to: 'session#create'
  delete "/logout",to: "session#destroy"
  resources :users
end

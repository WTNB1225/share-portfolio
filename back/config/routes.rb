Rails.application.routes.draw do
  post "/login",   to: 'session#create'
  delete "/logout",to: "session#destroy"
  get "/logged_in_user", to: "session#get_current_user"
  resources :users
  resources :posts
  get "/post/:id", to: "posts#show_by_id"
end

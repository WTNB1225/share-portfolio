Rails.application.routes.draw do
  get 'relationships/followings'
  get 'relationships/followers'
  post "/login",   to: 'session#create'
  delete "/logout",to: "session#destroy"
  get "/logged_in_user", to: "session#get_current_user"
  resources :users
  resources :posts
  get "/post/:id", to: "posts#show_by_id"
  get "/csrf_token", to: "session#get_token"
  resources :relationships, only:[:create, :destroy, :index]
  get "followings/:id", to: "relationships#followings"
  get "followers/:id", to: "relationships#followers"
end

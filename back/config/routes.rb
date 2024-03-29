Rails.application.routes.draw do
  get 'relationships/followings'
  get 'relationships/followers'
  post "/login",   to: 'session#create'
  delete "/logout",to: "session#destroy"
  patch "/post_update/:id", to: "posts#update_by_id"
  get "/logged_in_user", to: "session#get_current_user"
  resources :users
  resources :posts
  get "/post/:id", to: "posts#show_by_id"
  get "/csrf_token", to: "session#get_token"
  resources :relationships, only:[:create, :destroy, :index]
  get "followings/:id", to: "relationships#followings"
  get "followers/:id", to: "relationships#followers"
  resources :favorites
  get "favorites_count/:id", to: "favorites#count"
  delete "favorites/:user_id/:post_id", to: "favorites#destroy"
  get "isFavorites/:user_id/:post_id", to: "favorites#favorite?"
  get ":id/favorites", to: "favorites#users_favorite"
  resources :bookmarks
  delete "bookmarks/:user_id/:post_id", to: "bookmarks#destroy"
  get "/:id/bookmarks", to: "bookmarks#users_bookmark"
  get "isBookmarked/:user_id/:post_id", to: "bookmarks#bookmark?"
  resources :comments
  get "/showPostComments/:post_id", to: "comments#show_post_comments"
  get "user/:user_id", to:"users#show_by_id"
end

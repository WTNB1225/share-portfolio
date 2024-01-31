bundle install
bundle exec rails db:drop
bundle exec rails db:migrate:reset
bundle exec rails db:seed
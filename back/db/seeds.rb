require 'open-uri'
user = User.create(
  name: "admin",
  email:"admin@email.com",
  password: "password",
  password_confirmation: "password",
  admin: true)
file = URI.open("https://pub-a05d828609984db8b2239cd099a20aac.r2.dev/282639_bird_xl-1024-v1-0.png")
user.avatar.attach(io: file, filename: 'avatar.png')
User.create!(
  name: "admin",
  email:"admin@email.com",
  password: "password",
  password_confirmation: "password",
  avatar: open("https://pub-a05d828609984db8b2239cd099a20aac.r2.dev/996705_bird%20_xl-1024-v1-0.png"),
  admin: true
)
Rails.application.config.session_store :cookie_store, key: '_back_session', secure: Rails.env.production?, same_site: :none, domain: "share-portfolio.vercel.app"
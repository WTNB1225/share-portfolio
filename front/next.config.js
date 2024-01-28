/** @type {import('next').NextConfig} */
const path = require("path")
const nextConfig = {
  images:{
    domains:["localhost", "share-portfolio-api.onrender.com","share-portfolio.vercel.app"]
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}

module.exports = nextConfig

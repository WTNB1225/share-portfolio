/** @type {import('next').NextConfig} */
const path = require("path")
const nextConfig = {
  images:{
    domains:["localhost", "share-portfolio-git-product-wtnbjps-projects.vercel.app"]
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}

module.exports = nextConfig

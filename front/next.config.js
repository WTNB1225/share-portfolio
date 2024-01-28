/** @type {import('next').NextConfig} */
const path = require("path")
const nextConfig = {
  images:{
    domains:[ "share-portfolio-api.onrender.com"]
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}

module.exports = nextConfig

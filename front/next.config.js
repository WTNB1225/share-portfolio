/** @type {import('next').NextConfig} */
const path = require("path")
const nextConfig = {
  images:{
    domains:["share-portfolio-api.onrender.com", "share-portfolio-wut1.vercel.app"]
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}

module.exports = nextConfig

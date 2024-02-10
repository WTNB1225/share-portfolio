/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
  images: {
    domains: [
      "pub-a05d828609984db8b2239cd099a20aac.r2.dev",
      "share-portfolio-api.onrender.com",
      "share-portfolio-wut1.vercel.app",
      "220adec07b5f7904b15452e2a7974eb6.r2.cloudflarestorage.com",
    ],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
};

module.exports = nextConfig;

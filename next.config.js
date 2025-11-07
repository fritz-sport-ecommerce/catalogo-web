/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "cdn.sanity.io",
      "lh3.googleusercontent.com",
      "images.unsplash.com",
      "via.placeholder.com",
    ],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;

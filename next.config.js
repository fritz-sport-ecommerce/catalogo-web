/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "cdn.sanity.io",
      "lh3.googleusercontent.com",
      "images.unsplash.com",
    ],
  },
  reactStrictMode: false,
    experimental: {
    runtime: "edge", // Habilita Edge Runtime para el middleware
  },
};

module.exports = nextConfig;

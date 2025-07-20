/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'recipehub-images-collection.s3.eu-north-1.amazonaws.com',
        port: '',
        pathname: '/**'
      }
    ]
  },
  outputFileTracing: false,
}

module.exports = nextConfig

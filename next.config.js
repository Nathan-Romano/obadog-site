/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig



module.exports = {
  // Resto da configuração...

  exportPathMap: async function () {
    return {
      '/loading': { page: '/loading' }
    }
  }
}
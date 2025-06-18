import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return {
      afterFiles: [
        {
          source: '/v1/:path*',
          destination: 'http://localhost:3000/v1/:path*',
        },
      ],
      beforeFiles: [
        {
          source: '/v1/:path*',
          destination: 'http://localhost:3000/v1/:path*',
        },
      ],
      fallback: [
        {
          source: '/v1/:path*',
          destination: 'http://localhost:3000/v1/:path*',
        },
      ],
    }
    // return [
    //   {

    //     basePath: false,
    //   },
    // ]
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/admin/dashboard',
        permanent: true,
      },
    ]
  },
  poweredByHeader: false,
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
        },
      ],
    },
  ],
}

export default nextConfig

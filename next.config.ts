import type { NextConfig } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://bkgsskk8co0s4ck0ws4444kw.103.181.182.113.sslip.io'

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return {
      afterFiles: [
        {
          source: '/v1/:path*',
          destination: BASE_URL + '/v1/:path*',
        },
      ],
      beforeFiles: [
        {
          source: '/v1/:path*',
          destination: BASE_URL + '/v1/:path*',
        },
      ],
      fallback: [
        {
          source: '/v1/:path*',
          destination: BASE_URL + '/v1/:path*',
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
        destination: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/dashboard`,
        permanent: false,
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

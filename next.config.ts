import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  sassOptions: {
    additionalData: `$var: red;`,
    silenceDeprecations: ['legacy-js-api'],
  },
}

export default nextConfig
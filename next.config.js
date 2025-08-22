/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'loremflickr.com' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }, //  google 的圖片
    ],
    unoptimized: true, // 開發用，正式環境建議移除
  },
  // output: 'export', // 若要部署靜態站時再打開
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3005/api/:path*',
      },
    ]
  },
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|swf|ogv)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/videos/',
          outputPath: 'static/videos/',
          name: '[name].[hash].[ext]',
          esModule: false,
        },
      },
    })
    return config
  },

  // 部屬時, 自動忽略 eslint 錯誤
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig

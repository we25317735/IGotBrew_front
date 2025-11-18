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

  // 部屬時, 自動忽略 eslint 錯誤
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig

/* sentry 設定 */
const { withSentryConfig } = require('@sentry/nextjs')

module.exports = withSentryConfig(module.exports, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: '832c1cbcf8cc',
  project: 'javascript-nextjs',

  silent: !process.env.CI,

  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',
  disableLogger: true,
  automaticVercelMonitors: true,
})
/* sentry 設定 結束 */

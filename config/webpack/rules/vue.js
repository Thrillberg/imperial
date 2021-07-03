const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const path = require('path')

module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: { loader: 'vue-loader' }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.svg$/,
        use: [
          'babel-loader',
          'vue-svg-loader',
        ],
      },
      {
        test: /\.mp3$/,
        loader: 'file-loader',
        options: {
          limit: 10000,
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      alwaysWriteToDisk: true,
      appMountId: "app",
      favicon: "favicon.ico",
      inject: "body",
      lang: 'en-US',
      meta: {
        charset: "UTF-8",
        description: "Play Imperial online",
        keywords: "imperial, board game, game, online, play",
        viewport: "width=device-width, initial-scale=1"
      },
      template: require('html-webpack-template'),
      title: "Imperial",
      googleAnalytics: {
        trackingId: "G-HETMN2G3GE",
        pageViewOnLoad: true
      },
      headHtmlSnippet: `
        <!-- Google Tag Manager -->
          <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-TPLXHT2');</script>
        <!-- End Google Tag Manager -->
      `,
      bodyHtmlSnippet: `
        <!-- Google Tag Manager (noscript) -->
          <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TPLXHT2"
          height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        <!-- End Google Tag Manager (noscript) -->
      `
    }),
    new HtmlWebpackHarddiskPlugin({
      outputPath: path.resolve(__dirname, '../../../public/packs')
    }),
    new VueLoaderPlugin(),
  ]
}

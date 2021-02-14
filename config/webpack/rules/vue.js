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
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      alwaysWriteToDisk: true,
      favicon: "favicon.ico",
      meta: {
        charset: "UTF-8",
        description: "Play Imperial online",
        keywords: "imperial, board game, game, online, play",
        viewport: "width=device-width, initial-scale=1"
      },
      title: "Imperial"
    }),
    new HtmlWebpackHarddiskPlugin({
      outputPath: path.resolve(__dirname, '../../../public/packs')
    }),
    new VueLoaderPlugin(),
  ]
}

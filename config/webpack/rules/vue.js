const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
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
        test: /\.(mp3|json)$/,
        loader: 'file-loader',
        options: {
          limit: 10000,
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackHarddiskPlugin({
      outputPath: path.resolve(__dirname, '../../../public/packs')
    }),
    new VueLoaderPlugin(),
    new NodePolyfillPlugin(),
  ]
}

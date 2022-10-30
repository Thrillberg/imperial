const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const path = require('path')

module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.svg$/,
        use: [
          'vue-loader',
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
    new HtmlWebpackHarddiskPlugin({
      outputPath: path.resolve(__dirname, '../../../public/packs')
    }),
    new VueLoaderPlugin(),
  ]
}

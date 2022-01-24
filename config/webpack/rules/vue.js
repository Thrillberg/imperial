const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  resolve: {
    alias: {
      vue: '@vue/compat'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [{
          loader: 'vue-loader',
          options: {
            compilerOptions: {
              compatConfig: {
                MODE: 2,
                COMPILER_V_ON_NATIVE: true
              }
            }
          }
        }]
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
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
  ]
}

const { environment } = require('@rails/webpacker')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')

environment.plugins.append(
  'html',
  new HtmlWebpackPlugin({
    alwaysWriteToDisk: true
  })
)

environment.plugins.append(
  'html-harddisk',
  new HtmlWebpackHarddiskPlugin()
)

environment.config.merge({
  resolve: {
    alias: {
      vue: '@vue/compat',
    },
  },
});

module.exports = environment

const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const { VuetifyPlugin } = require('webpack-plugin-vuetify');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const path = require('path');
const webpack = require('webpack');

module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
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
        },
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new HtmlWebpackHarddiskPlugin({
      outputPath: path.resolve(__dirname, '../../../public/packs'),
    }),
    new VueLoaderPlugin(),
    new NodePolyfillPlugin(),
    new VuetifyPlugin({ autoImport: true }),
  ],
};

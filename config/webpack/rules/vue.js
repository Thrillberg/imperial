const { VueLoaderPlugin } = require('vue-loader');
const { VuetifyPlugin } = require('webpack-plugin-vuetify');
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
    new VueLoaderPlugin(),
    new VuetifyPlugin({ autoImport: true }),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
    }),
  ],
};
